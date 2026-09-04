# Victorian LogBook Anomaly Detection Datasets
**Intelligent Network & System Log Telemetry Diagnostic Engine**

Place your custom raw logs and telemetry streams in this directory (`dataset/`). The Victorian LogBook engine automatically supports:
1. **Raw Server Access Logs** (`.log`, `.txt`): Apache, Nginx, Syslog, auth.log formats.
2. **Time-Series Metric CSVs** (`.csv`): Timestamp, CPU%, Memory_MB, Disk_IO, Latency_ms, Error_Rate.
3. **Structured Microservice JSON Event Traces** (`.json`): Distributed cluster logs, stack traces, and JVM memory dump events.

---

### Included Datasets

- `server_telemetry_access.log`: 500+ lines of real-world server traffic containing SQL injection attacks, brute force authentication bursts, directory traversal, and normal REST requests.
- `system_metrics_anomalies.csv`: High-frequency metric logs detailing latent heap memory leaks, network throttling, and cascading latency timeouts.
- `distributed_cluster_events.json`: Microservice trace entries categorized with severity ratings, root cause vector tags, and node IDs.
