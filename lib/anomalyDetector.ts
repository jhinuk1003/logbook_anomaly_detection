import { LogEntry } from "./sampleData";

export interface DetectionThresholds {
  zScoreThreshold: number; // e.g. 2.5
  iqrMultiplier: number; // e.g. 1.5
  latencySpikeMs: number; // e.g. 800
  entropyCutoff: number; // e.g. 3.8
  regexPattern: string; // custom regex filter
}

export const DEFAULT_THRESHOLDS: DetectionThresholds = {
  zScoreThreshold: 2.2,
  iqrMultiplier: 1.5,
  latencySpikeMs: 650,
  entropyCutoff: 3.5,
  regexPattern: "(?i)(UNION|SELECT|wp-admin|OutOfMemoryError|40[1-4]|50[0-4])",
};

export function calculateZScores(numbers: number[]): number[] {
  if (numbers.length === 0) return [];
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance =
    numbers.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / numbers.length;
  const std = Math.sqrt(variance) || 1;
  return numbers.map((val) => Math.abs((val - mean) / std));
}

export function calculateShannonEntropy(str: string): number {
  if (!str) return 0;
  const freq: Record<string, number> = {};
  for (const char of str) {
    freq[char] = (freq[char] || 0) + 1;
  }
  let entropy = 0;
  const len = str.length;
  for (const char in freq) {
    const p = freq[char] / len;
    entropy -= p * Math.log2(p);
  }
  return Number(entropy.toFixed(3));
}

export function evaluateLogEntry(
  entry: LogEntry,
  thresholds: DetectionThresholds
): {
  isAnomaly: boolean;
  score: number;
  reasons: string[];
  matchedRegex: boolean;
} {
  const reasons: string[] = [];
  let score = 0.05;
  let matchedRegex = false;

  // 1. Custom Regex Rule Engine check
  if (thresholds.regexPattern.trim()) {
    try {
      // Strip inline flag (?i) if present for JS RegExp compatibility
      let patternStr = thresholds.regexPattern;
      let flags = "i";
      if (patternStr.startsWith("(?i)")) {
        patternStr = patternStr.slice(4);
      }
      const re = new RegExp(patternStr, flags);
      if (re.test(entry.raw) || re.test(entry.path)) {
        matchedRegex = true;
        reasons.push(`Regex rule match: '${thresholds.regexPattern}'`);
        score += 0.35;
      }
    } catch {
      // Invalid regex pattern gracefully handled
    }
  }

  // 2. Latency spike check
  if (entry.latencyMs >= thresholds.latencySpikeMs) {
    reasons.push(`Latency ${entry.latencyMs}ms exceeded threshold (${thresholds.latencySpikeMs}ms)`);
    score += 0.3;
  }

  // 3. HTTP status code severity
  if (entry.status >= 500) {
    reasons.push(`HTTP 5xx Server Error (${entry.status})`);
    score += 0.35;
  } else if (entry.status >= 400 && entry.status !== 404) {
    reasons.push(`HTTP 4xx Security Event (${entry.status})`);
    score += 0.25;
  }

  // 4. Entropy check on path / query
  const entropy = calculateShannonEntropy(entry.path);
  if (entropy >= thresholds.entropyCutoff) {
    reasons.push(`Elevated Shannon Entropy (${entropy} bits) indicates obfuscation/payload`);
    score += 0.2;
  }

  // 5. Explicit tag check
  if (entry.anomalyTag) {
    score += 0.2;
  }

  const normalizedScore = Math.min(1.0, Number(score.toFixed(2)));
  return {
    isAnomaly: normalizedScore >= 0.45 || matchedRegex,
    score: normalizedScore,
    reasons,
    matchedRegex,
  };
}

export function parseRawLogLine(line: string, id: string): LogEntry {
  const ipMatch = line.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
  const ip = ipMatch ? ipMatch[1] : "127.0.0.1";

  const methodMatch = line.match(/"(GET|POST|PUT|DELETE|HEAD|OPTIONS)/);
  const method = (methodMatch ? methodMatch[1] : "GET") as LogEntry["method"];

  const pathMatch = line.match(/"(?:GET|POST|PUT|DELETE)\s+([^\s]+)/);
  const path = pathMatch ? pathMatch[1] : "/";

  const statusMatch = line.match(/"\s+(\d{3})\s+/);
  const status = statusMatch ? parseInt(statusMatch[1], 10) : 200;

  const latencyMatch = line.match(/(\d+)ms/);
  const latencyMs = latencyMatch ? parseInt(latencyMatch[1], 10) : 25;

  let severity: LogEntry["severity"] = "SAFE";
  let anomalyTag: string | undefined;

  if (line.includes("OutOfMemoryError") || line.includes("CASCADE") || status >= 503) {
    severity = "FATAL";
    anomalyTag = "FATAL_OOM_CASCADE";
  } else if (line.includes("UNION") || line.includes("SELECT") || line.includes("SQLi") || status >= 500) {
    severity = "CRITICAL";
    anomalyTag = "SQL_INJECTION_OR_CRITICAL";
  } else if (line.includes("wp-login") || line.includes("401") || status === 404 || latencyMs > 500) {
    severity = "WARNING";
    anomalyTag = "SUSPICIOUS_PROBE";
  }

  return {
    id,
    timestamp: new Date().toTimeString().split(" ")[0],
    ip,
    method,
    path,
    status,
    latencyMs,
    sizeBytes: 850,
    node: "node-victoria-01",
    severity,
    anomalyTag,
    raw: line,
    vector: [severity === "FATAL" ? 1.0 : severity === "CRITICAL" ? 0.8 : 0.2, latencyMs / 1000, anomalyTag ? 1.0 : 0.0, 0.4],
  };
}
