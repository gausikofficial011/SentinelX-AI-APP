# SENTINELX AI — PROJECT STATUS

## Overview
AI-Powered Mobile & Web Public Safety and Law Enforcement Intelligence Platform

---

## Current Status: ✅ STABLE & COMPLETED

| Module / System | Status | Verification |
|-----------------|--------|--------------|
| Master Frontpage (`/`) | ✅ Created | Native mobile frontpage with role gateway, SOS distress beacon, and quick civilian tiles |
| Real App Simulator Frame (`_layout`) | ✅ Created | Flagship smartphone device frame on web desktop, dynamic island, toggleable fullscreen |
| Login & Auth System (`/auth/login`) | ✅ Verified | Multi-role presets, real JWT auth against Node API (:3000), 1-tap demo access |
| Role Selection (`/auth/role-selection`) | ✅ Verified | 6 roles configured with direct launch actions and feature summaries |
| Citizen Portal (`/citizen/*`) | ✅ Verified | 1-Tap SOS, E-FIR Status Tracker, Crime Reporting, GIS Map, Profile |
| Police Officer Portal (`/officer/*`) | ✅ Verified | CAD Missions, Patrol Tracking, Police E-FIR Stepper, Suspect Dossiers, Evidence Locker |
| CAD Dispatcher Portal (`/dispatcher/*`) | ✅ Verified | Live 911 Call Queue, Active Fleet Tracking, 1-Click Interceptor Unit Dispatch |
| Intelligence Analyst Portal (`/analyst/*`) | ✅ Verified | DBSCAN Hotspots, Prophet 7-Day Forecasting, Patrol AI Recommendations, Reports |
| Command Admin Portal (`/admin/*`) | ✅ Verified | Personnel Roster, Broadcast Alerts, Cluster Diagnostics, Audit Logs |
| Sentinel AI Copilot (`/copilot`) | ✅ Verified | Conversational Legal AI, IPC Guidance, Procedural FIR Drafting |
| Node.js API Server (`:3000`) | ✅ Online | Express, TypeScript, JWT, BCrypt, Socket.IO, Demo Mode, Health check |
| Python FastAPI Engine (`:8000`) | ✅ Online | FastAPI, DBSCAN, Copilot RAG, Hotspots, Health check |

---

## System Access & Default Credentials

| Role | Username / Identifier | Password | Default Operative Name | Badge ID |
|------|-----------------------|----------|------------------------|----------|
| **Citizen** | `citizen@example.com` | `citizen123` | Ananya Sharma | Verified Citizen #DL-8821 |
| **Police Officer** | `officer01` | `police123` | Insp. Vikram Rathore | Badge #DL-4082 |
| **CAD Dispatcher** | `dispatcher01` | `dispatch123` | Chief Dispatcher Mehta | CAD-Lead-09 |
| **Intelligence Analyst** | `analyst01` | `analyst123` | Dr. Arjun Roy | INTEL-7 Division |
| **System Admin** | `staff` | `staff123` | Staff Administrator | HQ-COMMANDER |
| **Super Admin** | `admin` | `password` | System Administrator | SUPERUSER-ROOT |

---

## Service Endpoints

- **Platform Frontpage / App**: `http://localhost:8081`
- **Node.js REST API**: `http://localhost:3000` (Health: `http://localhost:3000/health`)
- **FastAPI AI Engine**: `http://localhost:8000` (Health: `http://localhost:8000/health`)

---

## Launch Instructions

To launch all 3 microservices simultaneously, execute:
```cmd
start-all.bat
```
Or start each service individually:
1. **Python AI Engine**: `cd backend\python-ai && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
2. **Node.js REST API**: `cd backend\node-api && npm run dev`
3. **Expo Mobile / Web**: `cd mobile && npx expo start --lan`
