export interface LogEntry {
  id: string;
  timestamp: string;
  ip: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  status: number;
  latencyMs: number;
  sizeBytes: number;
  node: string;
  severity: "SAFE" | "WARNING" | "CRITICAL" | "FATAL";
  anomalyTag?: string;
  raw: string;
  vector: number[];
}

export interface MetricDataPoint {
  timestamp: string;
  timeLabel: string;
  cpuPercent: number;
  memoryMb: number;
  latencyMs: number;
  errorRate: number;
  networkKbps: number;
  threatIndex: number;
  isAnomaly: boolean;
  anomalyReason?: string;
}

export const INITIAL_LOG_STREAM: LogEntry[] = [
  {
    id: "LOG-1888-001",
    timestamp: "12:00:14",
    ip: "192.168.1.105",
    method: "GET",
    path: "/api/v1/telemetry/health",
    status: 200,
    latencyMs: 14,
    sizeBytes: 142,
    node: "node-victoria-01",
    severity: "SAFE",
    raw: '192.168.1.105 - - [04/Sep/2026:12:00:14] "GET /api/v1/telemetry/health HTTP/1.1" 200 142 14ms',
    vector: [0.05, 0.01, 0.0, 0.12],
  },
  {
    id: "LOG-1888-002",
    timestamp: "12:00:28",
    ip: "192.168.1.108",
    method: "GET",
    path: "/dashboard/galvanic-stream",
    status: 200,
    latencyMs: 28,
    sizeBytes: 4820,
    node: "node-victoria-01",
    severity: "SAFE",
    raw: '192.168.1.108 - - [04/Sep/2026:12:00:28] "GET /dashboard/galvanic-stream HTTP/1.1" 200 4820 28ms',
    vector: [0.05, 0.02, 0.0, 0.24],
  },
  {
    id: "LOG-1888-003",
    timestamp: "12:01:05",
    ip: "185.220.101.5",
    method: "GET",
    path: "/wp-login.php?redirect_to=admin",
    status: 404,
    latencyMs: 38,
    sizeBytes: 192,
    node: "node-victoria-02",
    severity: "WARNING",
    anomalyTag: "PROBE_DIRECTORY_SCAN",
    raw: '185.220.101.5 - - [04/Sep/2026:12:01:05] "GET /wp-login.php?redirect_to=admin HTTP/1.1" 404 192 38ms [PROBE]',
    vector: [0.45, 0.03, 0.7, 0.62],
  },
  {
    id: "LOG-1888-004",
    timestamp: "12:01:07",
    ip: "185.220.101.5",
    method: "GET",
    path: "/.env",
    status: 404,
    latencyMs: 35,
    sizeBytes: 192,
    node: "node-victoria-02",
    severity: "WARNING",
    anomalyTag: "SECRET_EXTRACTION_PROBE",
    raw: '185.220.101.5 - - [04/Sep/2026:12:01:07] "GET /.env HTTP/1.1" 404 192 35ms [PROBE]',
    vector: [0.45, 0.03, 0.8, 0.71],
  },
  {
    id: "LOG-1888-005",
    timestamp: "12:02:18",
    ip: "45.155.205.233",
    method: "POST",
    path: "/api/v1/query?q=1' UNION SELECT 1,password_hash FROM vault--",
    status: 500,
    latencyMs: 420,
    sizeBytes: 1200,
    node: "node-victoria-02",
    severity: "CRITICAL",
    anomalyTag: "SQL_INJECTION_EXPLOIT",
    raw: '45.155.205.233 - - [04/Sep/2026:12:02:18] "POST /api/v1/query?q=1\' UNION SELECT..." 500 1200 420ms [SQLi]',
    vector: [0.95, 0.42, 1.0, 0.94],
  },
  {
    id: "LOG-1888-006",
    timestamp: "12:02:19",
    ip: "45.155.205.233",
    method: "POST",
    path: "/api/v1/query?q=1' OR SLEEP(5)--",
    status: 403,
    latencyMs: 25,
    sizeBytes: 410,
    node: "node-victoria-02",
    severity: "CRITICAL",
    anomalyTag: "SQL_INJECTION_TIMED_BLOCKED",
    raw: '45.155.205.233 - - [04/Sep/2026:12:02:19] "POST /api/v1/query?q=1\' OR SLEEP(5)--" 403 410 25ms [WAF BLOCK]',
    vector: [0.85, 0.05, 0.9, 0.88],
  },
  {
    id: "LOG-1888-007",
    timestamp: "12:03:40",
    ip: "198.51.100.42",
    method: "POST",
    path: "/api/v1/auth/login",
    status: 401,
    latencyMs: 44,
    sizeBytes: 210,
    node: "node-victoria-03",
    severity: "WARNING",
    anomalyTag: "BRUTE_FORCE_AUTH_BURST",
    raw: '198.51.100.42 - - [04/Sep/2026:12:03:40] "POST /api/v1/auth/login HTTP/1.1" 401 210 44ms [ATTEMPT_14]',
    vector: [0.55, 0.04, 0.6, 0.52],
  },
  {
    id: "LOG-1888-008",
    timestamp: "12:04:15",
    ip: "10.0.1.50",
    method: "GET",
    path: "/api/v1/reports/export/aggregate",
    status: 500,
    latencyMs: 2950,
    sizeBytes: 940,
    node: "node-victoria-01",
    severity: "FATAL",
    anomalyTag: "LATENT_HEAP_OOM_CASCADE",
    raw: '10.0.1.50 - - [04/Sep/2026:12:04:15] "GET /api/v1/reports/export HTTP/1.1" 500 940 2950ms [OutOfMemoryError]',
    vector: [1.0, 0.98, 0.95, 0.99],
  },
  {
    id: "LOG-1888-009",
    timestamp: "12:04:55",
    ip: "10.0.1.50",
    method: "GET",
    path: "/api/v1/reports/export/aggregate",
    status: 503,
    latencyMs: 5002,
    sizeBytes: 520,
    node: "node-victoria-01",
    severity: "FATAL",
    anomalyTag: "GATEWAY_TIMEOUT_HANG",
    raw: '10.0.1.50 - - [04/Sep/2026:12:04:55] "GET /api/v1/reports/export HTTP/1.1" 503 520 5002ms [TIMEOUT]',
    vector: [1.0, 1.0, 0.8, 0.92],
  },
];

export const INITIAL_METRICS_SERIES: MetricDataPoint[] = [
  { timestamp: "11:40", timeLabel: "11:40", cpuPercent: 24.2, memoryMb: 4120, latencyMs: 38, errorRate: 0.001, networkKbps: 1450, threatIndex: 4, isAnomaly: false },
  { timestamp: "11:45", timeLabel: "11:45", cpuPercent: 25.8, memoryMb: 4190, latencyMs: 42, errorRate: 0.001, networkKbps: 1520, threatIndex: 5, isAnomaly: false },
  { timestamp: "11:50", timeLabel: "11:50", cpuPercent: 28.1, memoryMb: 4260, latencyMs: 44, errorRate: 0.002, networkKbps: 1610, threatIndex: 6, isAnomaly: false },
  { timestamp: "11:55", timeLabel: "11:55", cpuPercent: 32.5, memoryMb: 4350, latencyMs: 48, errorRate: 0.002, networkKbps: 1740, threatIndex: 8, isAnomaly: false },
  { timestamp: "12:00", timeLabel: "12:00", cpuPercent: 39.4, memoryMb: 4620, latencyMs: 56, errorRate: 0.005, networkKbps: 2100, threatIndex: 12, isAnomaly: false },
  { timestamp: "12:05", timeLabel: "12:05", cpuPercent: 61.2, memoryMb: 5240, latencyMs: 110, errorRate: 0.018, networkKbps: 3400, threatIndex: 45, isAnomaly: true, anomalyReason: "Heap Drift & 404 Burst" },
  { timestamp: "12:10", timeLabel: "12:10", cpuPercent: 88.6, memoryMb: 6850, latencyMs: 340, errorRate: 0.082, networkKbps: 5600, threatIndex: 78, isAnomaly: true, anomalyReason: "SQLi Exploit & Memory Leak" },
  { timestamp: "12:15", timeLabel: "12:15", cpuPercent: 99.1, memoryMb: 9400, latencyMs: 2450, errorRate: 0.420, networkKbps: 11200, threatIndex: 96, isAnomaly: true, anomalyReason: "Heap Exhaustion & OOM Cascade" },
  { timestamp: "12:20", timeLabel: "12:20", cpuPercent: 41.0, memoryMb: 4500, latencyMs: 62, errorRate: 0.008, networkKbps: 1980, threatIndex: 18, isAnomaly: false },
  { timestamp: "12:25", timeLabel: "12:25", cpuPercent: 26.3, memoryMb: 3950, latencyMs: 40, errorRate: 0.001, networkKbps: 1420, threatIndex: 5, isAnomaly: false },
];

export function generateRandomLog(seq: number): LogEntry {
  const nodes = ["node-victoria-01", "node-victoria-02", "node-victoria-03", "node-victoria-04"];
  const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
  const isAnomaly = Math.random() < 0.28;

  const now = new Date();
  const timeStr = now.toTimeString().split(" ")[0];

  if (!isAnomaly) {
    const paths = ["/api/v1/telemetry/nodes", "/api/v1/metrics/galvanic", "/dashboard/chambers", "/api/v1/status"];
    const path = paths[Math.floor(Math.random() * paths.length)];
    const latency = Math.floor(15 + Math.random() * 45);
    return {
      id: `LOG-1888-${seq.toString().padStart(3, "0")}`,
      timestamp: timeStr,
      ip: `192.168.1.${100 + Math.floor(Math.random() * 50)}`,
      method: "GET",
      path: path,
      status: 200,
      latencyMs: latency,
      sizeBytes: Math.floor(400 + Math.random() * 1800),
      node: randomNode,
      severity: "SAFE",
      raw: `192.168.1.100 - - [${timeStr}] "GET ${path} HTTP/1.1" 200 842 ${latency}ms`,
      vector: [0.05, latency / 1000, 0.0, 0.15],
    };
  } else {
    const anomalyTypes = [
      {
        tag: "SQL_INJECTION_VECTOR",
        path: "/api/v1/search?term=' UNION SELECT schema_name FROM information_schema.schemata--",
        method: "POST" as const,
        status: 500,
        severity: "CRITICAL" as const,
        latency: 480,
      },
      {
        tag: "HEAP_ALLOCATION_SPIKE",
        path: "/api/v1/export/pdf-heavy-chronicle",
        method: "GET" as const,
        status: 503,
        severity: "FATAL" as const,
        latency: 3820,
      },
      {
        tag: "SUSPICIOUS_RECON_BURST",
        path: "/.git/config",
        method: "GET" as const,
        status: 404,
        severity: "WARNING" as const,
        latency: 55,
      },
      {
        tag: "CREDENTIAL_STUFFING",
        path: "/api/v1/auth/exchange",
        method: "POST" as const,
        status: 401,
        severity: "WARNING" as const,
        latency: 68,
      },
    ];
    const picked = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
    return {
      id: `LOG-1888-${seq.toString().padStart(3, "0")}`,
      timestamp: timeStr,
      ip: `45.142.19.${Math.floor(Math.random() * 250)}`,
      method: picked.method,
      path: picked.path,
      status: picked.status,
      latencyMs: picked.latency,
      sizeBytes: 1240,
      node: randomNode,
      severity: picked.severity,
      anomalyTag: picked.tag,
      raw: `45.142.19.12 - - [${timeStr}] "${picked.method} ${picked.path} HTTP/1.1" ${picked.status} 1240 ${picked.latency}ms [${picked.tag}]`,
      vector: [picked.severity === "FATAL" ? 1.0 : 0.85, picked.latency / 2000, 1.0, 0.88],
    };
  }
}
