"""
FastAPI Server for Victorian LogBook Telemetry Engine
REST APIs for log ingestion, statistical outlier calculation, and webhook dispatching.
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import io
import pandas as pd
from eda_pipeline import LogTelemetryVectorizer, TimeSeriesAnomalyEngine

app = FastAPI(
    title="LogBook Anomaly Detection REST API",
    description="Intelligent Network & System Log Telemetry Diagnostic Engine",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LogParseRequest(BaseModel):
    raw_logs: List[str]

class ThresholdConfig(BaseModel):
    z_score_threshold: float = 2.5
    iqr_multiplier: float = 1.5

@app.get("/")
def root():
    return {
        "engine": "Victorian LogBook Anomaly Detection Telemetry Engine",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "patent": "GB-1888-TEL-488219"
    }

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "HEALTHY",
        "galvanic_pressure": "OPTIMAL",
        "steam_telemetry": "CONNECTED"
    }

@app.post("/api/v1/parse/logs")
def parse_logs(payload: LogParseRequest):
    results = [LogTelemetryVectorizer.parse_access_line(line) for line in payload.raw_logs]
    anomaly_count = sum(1 for r in results if r.get("is_anomaly"))
    return {
        "total_parsed": len(results),
        "anomaly_count": anomaly_count,
        "records": results
    }

@app.post("/api/v1/analyze/metrics")
async def analyze_metrics(
    file: UploadFile = File(...),
    z_thresh: float = Form(2.5),
    iqr_mult: float = Form(1.5)
):
    try:
        content = await file.read()
        df = pd.read_csv(io.BytesIO(content))
        engine = TimeSeriesAnomalyEngine(z_thresh=z_thresh, iqr_multiplier=iqr_mult)
        report = engine.analyze_metrics_df(df)
        return report
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process CSV file: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
