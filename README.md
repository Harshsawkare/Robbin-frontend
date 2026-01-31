# 🧠 Robbin – AI-Powered Incident Analysis & Post-Mortem Generator (Prototype)

Robbin is an early-stage, local-first incident intelligence platform that helps developers understand logs, group related failures into incidents, and generate structured post-mortems using LLMs.

This repository contains two separate applications:

- **Frontend** – a dashboard to view logs, incidents, and post-mortems
- **Backend** – APIs to ingest events, create incidents, and generate post-mortems

## ⚠️ Important:
This is a very prototype built to showcase the core idea, UX flow, and system design.
The application currently runs entirely locally and uses SQLite with dummy data.
As soon as a user adds their own OpenAI API key, the LLM-powered features can be activated.

## 🚀 What Problem Does Robbin Solve?
Modern systems generate huge volumes of logs, but:
- Engineers still manually correlate errors
- Incident timelines are reconstructed by hand
- Post-mortems are time-consuming and inconsistent

Robbin explores a future where:
- Logs automatically cluster into incidents
- LLMs help reason over stack traces
- Post-mortems are generated, structured, and exportable

## 🧩 High-Level Architecture
```
Frontend (Dashboard)
   ↓ REST APIs
Backend (Event, Incident & Post-Mortem APIs)
   ↓
Local SQLite Database
   ↓
LLM (via user-provided API key)
```

- Frontend and backend are fully decoupled
- No cloud DB or third-party storage (yet)
- All data lives locally on the user's machine

## 🔐 LLM Usage & API Keys
1. No API keys are hardcoded
2. Users provide their own OpenAI API key
3. Once attached:
   - Incident extraction
   - Log correlation
   - Post-mortem generation can be powered by a real LLM

## 🧪 Current State of the Project
✅ Fully working frontend
✅ Fully working backend APIs
✅ End-to-end flow with dummy data
❌ No production LLM calls yet
❌ No cloud hosting yet

This project is raw by design — the goal is to demonstrate:
- System thinking
- UX for incident workflows
- Clean separation of concerns
- LLM-first product architecture

## 🖥️ Frontend Overview
- **Live Feed**: Real-time logs (info, warning, error) with pause/resume and expandable details.
- **Incidents**: Automatically grouped warning/error logs into open and closed incidents using LLM-based logic (currently mocked).
- **Post-Mortems**: LLM-generated incident reports with summaries, timelines, root cause, action items, and prevention steps. Exportable and re-generatable.

## ⚙️ Backend Overview
REST APIs for:
- Creating and fetching events (logs)
- Creating and managing incidents
- Generating post-mortems from incident IDs
- Fetching all or specific post-mortem reports
- Uses local SQLite for storage.
- LLM integration is designed but currently uses dummy data (activated via user API key).

## 🌱 Future Scope
- Integrations with tools like Sentry and Datadog
- Cloud-hosted backend with multi-project support
- Smarter LLM-driven incident correlation and root-cause analysis
- Team collaboration, analytics, and incident insights
