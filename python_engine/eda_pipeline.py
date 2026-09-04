"""
LogBook Telemetry Diagnostic Engine - Python ML & EDA Pipeline
Statistical time-series outlier detection, unstructured log vectorization, and severity scoring.
"""

import re
import math
from typing import Dict, List, Any, Tuple
import pandas as pd
import numpy as np


class LogTelemetryVectorizer:
    """Vectorizes and tokenizes raw unstructured server and system logs."""

    # Common web attack signatures and error patterns
    ATTACK_PATTERNS = {
        "SQL_INJECTION": r"(?i)(SELECT|UNION|INSERT|DELETE|DROP|OR\s+['\d]=['\d]|SLEEP\()",
        "DIRECTORY_TRAVERSAL": r"(\.\./|\.\.\\|/etc/passwd|\.env)",
        "BRUTE_FORCE": r"(?i)(wp-login|login|admin|auth.*401|invalid\s+credentials)",
        "MEMORY_LEAK": r"(?i)(OutOfMemoryError|heap\s+space|GC\s+overhead|leak)",
        "TIMEOUT_CASCADE": r"(?i)(timeout|gateway\s+timeout|connection\s+refused|hung)",
    }

    @classmethod
    def parse_access_line(cls, line: str) -> Dict[str, Any]:
        """Parses an Apache/Nginx combined log line with latency augmentation."""
        regex = r'^(\S+) \S+ \S+ \[([^:]+:\d+:\d+:\d+ [^\]]+)\] "(\S+) (.*?) (\S+)" (\d{3}) (\d+|-)(?: "(.*?)" "(.*?)")?(?: (\d+)ms)?'
        match = re.match(regex, line)
        if match:
            ip, timestamp, method, path, protocol, status, size, referer, user_agent, latency = match.groups()
            latency_val = int(latency) if latency else 20
            size_val = int(size) if size and size != "-" else 0
            
            # Anomaly check
            anomalies = []
            for name, pat in cls.ATTACK_PATTERNS.items():
                if re.search(pat, line):
                    anomalies.append(name)
            
            # Feature vector: [status_risk, latency_norm, payload_risk, attack_flag, path_entropy]
            status_code = int(status)
            status_risk = 1.0 if status_code >= 500 else (0.7 if status_code >= 400 else 0.05)
            latency_norm = min(1.0, latency_val / 3000.0)
            attack_flag = 1.0 if len(anomalies) > 0 else 0.0
            path_entropy = cls.calculate_shannon_entropy(path)
            
            vector = [status_risk, latency_norm, attack_flag, min(1.0, path_entropy / 4.5)]

            return {
                "ip": ip,
                "timestamp": timestamp,
                "method": method,
                "path": path,
                "status": status_code,
                "size_bytes": size_val,
                "latency_ms": latency_val,
                "anomalies": anomalies,
                "vector": vector,
                "is_anomaly": len(anomalies) > 0 or status_code >= 500 or latency_val > 1500
            }
        else:
            return {
                "raw": line,
                "is_anomaly": any(re.search(pat, line) for pat in cls.ATTACK_PATTERNS.values()),
                "anomalies": [name for name, pat in cls.ATTACK_PATTERNS.items() if re.search(pat, line)],
                "vector": [0.5, 0.5, 1.0 if any(re.search(pat, line) for pat in cls.ATTACK_PATTERNS.values()) else 0.0, 0.5]
            }

    @staticmethod
    def calculate_shannon_entropy(text: str) -> float:
        """Calculates Shannon entropy to detect obfuscated payloads / random probes."""
        if not text:
            return 0.0
        entropy = 0.0
        for char in set(text):
            p_x = float(text.count(char)) / len(text)
            if p_x > 0:
                entropy += - p_x * math.log2(p_x)
        return entropy


class TimeSeriesAnomalyEngine:
    """Statistical Time Series Outlier Detection (Z-Score, IQR, Rolling Volatility)."""

    def __init__(self, z_thresh: float = 2.5, iqr_multiplier: float = 1.5):
        self.z_thresh = z_thresh
        self.iqr_multiplier = iqr_multiplier

    def analyze_metrics_df(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Run statistical anomaly diagnostics on a Pandas DataFrame."""
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        results = {}

        for col in numeric_cols:
            series = df[col].dropna()
            mean = series.mean()
            std = series.std() if series.std() > 0 else 1.0
            
            # Z-Score detection
            z_scores = (series - mean) / std
            z_anomalies = series[np.abs(z_scores) > self.z_thresh]

            # IQR detection
            q25 = series.quantile(0.25)
            q75 = series.quantile(0.75)
            iqr = q75 - q25
            lower_bound = q25 - (self.iqr_multiplier * iqr)
            upper_bound = q75 + (self.iqr_multiplier * iqr)
            iqr_anomalies = series[(series < lower_bound) | (series > upper_bound)]

            results[col] = {
                "mean": float(round(mean, 2)),
                "std": float(round(std, 2)),
                "min": float(series.min()),
                "max": float(series.max()),
                "z_anomaly_count": int(len(z_anomalies)),
                "iqr_anomaly_count": int(len(iqr_anomalies)),
                "anomalous_indices": list(set(z_anomalies.index.tolist() + iqr_anomalies.index.tolist()))
            }

        # Dynamic Severity Categorization
        total_anomalies = sum(r["z_anomaly_count"] for r in results.values())
        severity = "SAFE"
        if total_anomalies > 10:
            severity = "FATAL"
        elif total_anomalies > 5:
            severity = "CRITICAL"
        elif total_anomalies > 1:
            severity = "WARNING"

        return {
            "columns_analyzed": numeric_cols,
            "total_rows": len(df),
            "total_anomalies": total_anomalies,
            "severity": severity,
            "column_metrics": results
        }


if __name__ == "__main__":
    import os
    csv_path = os.path.join(os.path.dirname(__file__), "..", "dataset", "system_metrics_anomalies.csv")
    if os.path.exists(csv_path):
        df = pd.read_csv(csv_path)
        engine = TimeSeriesAnomalyEngine()
        report = engine.analyze_metrics_df(df)
        print("Victorian Diagnostic Engine Pipeline Complete:")
        print(f"Total Rows: {report['total_rows']}, Anomalies: {report['total_anomalies']}, Severity: {report['severity']}")
