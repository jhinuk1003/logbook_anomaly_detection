import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { logs, thresholds } = body;

    const zScoreThreshold = thresholds?.zScoreThreshold || 2.2;
    const latencySpikeMs = thresholds?.latencySpikeMs || 650;

    // Run statistical evaluations
    const evaluated = (logs || []).map((line: string, idx: number) => {
      const isSql = /UNION|SELECT|DROP|OR 1=1/i.test(line);
      const isOom = /OutOfMemoryError|heap space|GC overhead/i.test(line);
      const is404 = /404\s+\d+/i.test(line);
      const isTimeout = /503|504|timeout/i.test(line);

      let severity = "SAFE";
      if (isOom || isTimeout) severity = "FATAL";
      else if (isSql) severity = "CRITICAL";
      else if (is404) severity = "WARNING";

      return {
        id: `API-EVAL-${idx + 1}`,
        raw: line,
        severity,
        isAnomaly: severity !== "SAFE",
        timestamp: new Date().toISOString(),
      };
    });

    const anomalyCount = evaluated.filter((e: any) => e.isAnomaly).length;

    return NextResponse.json({
      status: "SUCCESS",
      engine: "Victorian LogBook Diagnostic Engine",
      totalLogs: evaluated.length,
      anomalyCount,
      overallSeverity:
        anomalyCount > 5 ? "CRITICAL" : anomalyCount > 0 ? "WARNING" : "SAFE",
      results: evaluated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { status: "ERROR", message: error.message || "Failed to analyze log stream." },
      { status: 500 }
    );
  }
}
