# SentinelX AI

> AI-Powered Mobile Public Safety and Law Enforcement Intelligence Platform

[![Android](https://img.shields.io/badge/Android-3DDC84?style=flat&logo=android&logoColor=white)](https://developer.android.com)
[![Kotlin](https://img.shields.io/badge/Kotlin-7F52FF?style=flat&logo=kotlin&logoColor=white)](https://kotlinlang.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://postgresql.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Overview

SentinelX AI is a complete, modular, AI-powered Android-first public safety platform connecting Citizens, Police Officers, Investigators, Dispatchers, Intelligence Analysts, and Administrators through a single native Android application backed by Node.js APIs, a Python/FastAPI AI engine, PostgreSQL/PostGIS, Redis, and real-time communication.

This project is intended as a college major project, company-level demonstration, hackathon demonstration, and portfolio project.

> **This is a demonstration/academic prototype. All data used is synthetic or anonymized. AI features are decision-support tools only. Human officers remain responsible for all decisions.**

---

## Architecture

```
ANDROID APP (Kotlin + Jetpack Compose)
       │
       ├── Retrofit / OkHttp (REST)
       ├── WebSocket / Socket.IO (Realtime)
       ├── Firebase Cloud Messaging (Push)
       └── Google Maps SDK (GIS)
       │
       ▼
NODE.JS API (TypeScript + Express)
       │
       ├── PostgreSQL + PostGIS (Primary DB)
       ├── Redis (Cache + Realtime State)
       └── Object Storage (Files/Evidence)
       │
       ▼
FASTAPI AI ENGINE (Python)
       │
       ├── DBSCAN Hotspot Detection
       ├── Prophet Crime Forecasting
       ├── Case Similarity Engine
       ├── RAG AI Copilot
       └── Explainable AI
```

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Language | Kotlin |
| UI Framework | Jetpack Compose |
| Architecture | MVVM + Clean Architecture |
| Networking | Retrofit + OkHttp |
| Local DB | Room |
| DI | Hilt |
| Authentication | JWT + Refresh Tokens |
| Maps | Google Maps SDK |
| Location | Fused Location Provider |
| Push Notifications | Firebase Cloud Messaging |
| Background Work | WorkManager |
| Camera | CameraX |
| Secure Storage | Android Keystore |
| Realtime | WebSocket / Socket.IO |
| Backend API | Node.js + TypeScript |
| AI Engine | FastAPI + Python |
| Database | PostgreSQL + PostGIS |
| Cache | Redis |
| ML | Scikit-learn, Prophet, Pandas |

---

## Folder Structure

```
sentinelx-ai/
├── android/
│   └── SentinelX/          ← Open this in Android Studio
├── backend/
│   ├── node-api/           ← Node.js TypeScript API
│   └── ai-engine/          ← FastAPI Python AI Engine
├── database/
│   ├── migrations/
│   ├── seeds/
│   ├── schema/
│   ├── functions/
│   └── indexes/
├── datasets/
│   ├── raw/
│   ├── processed/
│   ├── synthetic/
│   └── schemas/
├── ml-models/
│   ├── versions/
│   ├── metadata/
│   └── evaluation/
├── scripts/
├── tests/
├── docs/
├── storage/
├── deployment/
├── .env.example
├── .gitignore
├── README.md
└── PROJECT_STATUS.md
```

---

## Roles

| Role | Description |
|------|-------------|
| CITIZEN | Public user — report crimes, SOS, track cases |
| OFFICER | Police officer — incidents, FIRs, evidence, patrol |
| INVESTIGATOR | Investigator — cases, evidence, suspects, witnesses |
| DISPATCHER | Dispatcher — emergency dispatch, patrol coordination |
| INTELLIGENCE_ANALYST | Analyst — AI insights, hotspots, intelligence |
| ADMIN | Admin — users, departments, reports, alerts |
| SUPER_ADMIN | Full system administration |

---

## Setup

### Prerequisites

- Android Studio (latest stable)
- JDK 17+
- Node.js 20+
- Python 3.11+
- PostgreSQL 15+ with PostGIS extension
- Redis 7+

### 1. Clone Repository

```bash
git clone https://github.com/your-org/sentinelx-ai.git
cd sentinelx-ai
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your values
```

### 3. Database Setup

```bash
# Windows
psql -U postgres -c "CREATE DATABASE sentinelx;"
psql -U postgres -d sentinelx -c "CREATE EXTENSION postgis;"
psql -U postgres -d sentinelx -f database/schema/001_initial_schema.sql
psql -U postgres -d sentinelx -f database/seeds/seed_demo.sql
```

### 4. Node.js Backend

```bash
cd backend/node-api
npm install
npm run dev
# Runs on http://localhost:3000
```

### 5. FastAPI AI Engine

```bash
cd backend/ai-engine
# Windows
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Runs on http://localhost:8000
```

### 6. Android App

1. Open Android Studio
2. Open folder: `android/SentinelX/`
3. Wait for Gradle sync
4. Configure API base URL in `local.properties`
5. Run on emulator or device

---

## Environment Variables

See [.env.example](.env.example) for all required variables.

Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | JWT refresh token secret |
| `GOOGLE_MAPS_API_KEY` | Google Maps API key |
| `FIREBASE_SERVICE_ACCOUNT` | Path to Firebase service account JSON |
| `AI_ENGINE_URL` | FastAPI AI engine URL |
| `STORAGE_TYPE` | local / s3 / minio |

---

## Demo Accounts

> **For development only. Never use real credentials.**

| Role | Email | Password |
|------|-------|----------|
| CITIZEN | demo.citizen@sentinelx.local | Demo@1234 |
| OFFICER | demo.officer@sentinelx.local | Demo@1234 |
| INVESTIGATOR | demo.investigator@sentinelx.local | Demo@1234 |
| DISPATCHER | demo.dispatcher@sentinelx.local | Demo@1234 |
| ANALYST | demo.analyst@sentinelx.local | Demo@1234 |
| ADMIN | demo.admin@sentinelx.local | Demo@1234 |
| SUPER_ADMIN | demo.superadmin@sentinelx.local | Demo@1234 |

---

## Emulator / Device Networking

### Android Emulator
- Use `10.0.2.2` to reach host localhost
- API URL: `http://10.0.2.2:3000`
- AI Engine: `http://10.0.2.2:8000`

### Physical Android Device (USB/LAN)
- Use your host machine's LAN IP (e.g., `192.168.1.x`)
- Enable USB debugging on device
- Set `BASE_URL` in `local.properties`

---

## Health Endpoints

| Service | Endpoint |
|---------|----------|
| Node API | GET http://localhost:3000/health |
| FastAPI | GET http://localhost:8000/health |

---

## API Documentation

- Node API: http://localhost:3000/api-docs (Swagger)
- FastAPI: http://localhost:8000/docs (Auto-generated)

---

## Testing

```bash
# Node API tests
cd backend/node-api
npm test

# Python AI Engine tests
cd backend/ai-engine
pytest

# Android tests (from project root)
cd android/SentinelX
./gradlew test
./gradlew connectedAndroidTest
```

---

## Build Android APK

```bash
cd android/SentinelX
# Windows
gradlew.bat assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk
```

---

## Screenshots

> Screenshots will be added after UI completion in Phase 5-6.

---

## Limitations

- This is an academic/demonstration prototype
- AI features are decision-support only — not autonomous enforcement tools
- All demo data is synthetic/fictional
- Some production features (e.g., real emergency dispatch integration) require additional infrastructure
- ML models are trained on synthetic data and require real-world validation before any production use

---

## Ethical Notice

This platform is a **decision-support prototype**. The AI features:
- Do NOT predict individual criminal behavior
- Do NOT recommend arrests
- Do NOT use protected characteristics for risk scoring
- Provide aggregate insights only
- Expose uncertainty and explanations
- Require human judgment for all decisions

---

## License

MIT License — See [LICENSE](LICENSE) for details.

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).
