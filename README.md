# ⚜️ LogBook Anomaly Detection Engine
### *Intelligent Network & System Log Telemetry Diagnostic Engine*

[![Hackathon Certified](https://img.shields.io/badge/Hackathon-Certified_Accolades-gold?style=for-the-badge&logo=target)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js_16-Turbopack-000000?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-Glassmorphism-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Python ML](https://img.shields.io/badge/Python_3.11-Pandas_%7C_NumPy_%7C_FastAPI-3776AB?style=for-the-badge&logo=python)](https://fastapi.tiangolo.com)
[![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-Guest_Enabled-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)

---

## 📖 System Overview

**LogBook Anomaly Detection** is a high-performance log analysis and anomaly detection suite designed to parse, index, and monitor massive distributed network and server log streams. It detects abnormal access patterns, security breaches, and latent failure precursors before catastrophic downtimes occur.

The application features a modern, responsive **Glassmorphism design system** infused with a **Victorian Royal Telegraph laboratory** aesthetic — complete with acoustic mechanical telegraph feedback, rotary brass dials, real-time waveform monitors, and a unified full-stack architecture containing both the Next.js console and Python ML pipeline.

---

## 📂 Project Directory Structure

Everything is self-contained within `log_book_analyzer/`:

```
log_book_analyzer/
├── dataset/                               # 📁 Internal Dataset Vault
│   ├── server_telemetry_access.log        # Raw Apache/Nginx logs with SQLi & brute force attacks
│   ├── system_metrics_anomalies.csv       # Multivariate time-series metrics (CPU, RAM, Latency)
│   ├── distributed_cluster_events.json    # Microservice trace records with vector embeddings
│   └── README.md                          # Guide for custom log files
├── python_engine/                         # 🐍 Python ML Analytics & REST Engine
│   ├── eda_pipeline.py                    # Pandas/NumPy Z-Score, IQR & Shannon Entropy engine
│   ├── main.py                            # FastAPI REST API server
│   └── requirements.txt                   # Python dependencies (FastAPI, Pandas, NumPy, Uvicorn)
├── public/
│   ├── icon.svg                           # Custom Victorian Glassmorphism Favicon
│   └── dataset/                           # Publicly downloadable datasets
├── app/
│   ├── icon.svg                           # Next.js Favicon asset
│   ├── globals.css                        # Glassmorphism design tokens & ambient glows
│   ├── layout.tsx                         # Typography, viewport & metadata
│   ├── page.tsx                           # Master orchestrator (Landing <-> Auth <-> Console)
│   └── api/
│       ├── analyze/route.ts               # Next.js statistical analysis API endpoint
│       └── webhook/route.ts               # Next.js webhook dispatch testing endpoint
├── components/
│   ├── VictorianFrame.tsx                 # Frosted glass panel container
│   ├── LandingPage.tsx                    # Hero landing page with accolades & architecture
│   ├── AuthModal.tsx                      # Firebase Auth & one-click Guest Inspector login
│   ├── Dashboard.tsx                      # Master Telemetry Console workspace
│   ├── AnomalyGauges.tsx                  # Rotary brass dials with dynamic needle deflection
│   ├── TelemetryStream.tsx                # Live ticker tape, scrubber & waveform charts
│   ├── HeatmapScrubber.tsx                # Spatial-temporal 24h root cause matrix
│   ├── RegexEngine.tsx                    # Regex filter builder & threshold sliders
│   ├── LogVectorizer.tsx                  # Unstructured log tokenizer & 4D vector inspector
│   ├── WebhookDispatcher.tsx              # Slack/Email alert transmission simulator
│   └── DatasetStation.tsx                 # Dataset archive explorer & dropzone uploader
└── lib/
    ├── firebase.ts                        # Firebase client initialization & Guest generator
    ├── audio.ts                           # Web Audio telegraph sound synthesizer
    ├── sampleData.ts                      # Curated telemetry datasets & dynamic stream generator
    └── anomalyDetector.ts                 # Client-side statistical scoring & Shannon entropy
```

---

## 🚀 Running the Project

### 1. Launch Next.js Web Console
```bash
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser. Click **"Enter Apparatus"** for instant 1-click Guest Inspector access.

### 2. Execute Python ML Outlier Pipeline
Inside `log_book_analyzer/`, run the built-in npm script:
```bash
npm run python:eda
```
*(Or directly: `python python_engine/eda_pipeline.py`)*

### 3. Launch Python FastAPI REST Server (Optional)
```bash
npm run python:server
```
Interactive API documentation will be available at `http://localhost:8000/docs`.
