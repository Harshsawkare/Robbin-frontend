# 🧠 Robbin – AI-Powered Incident Analysis & Post-Mortem Generator (Prototype)

Robbin is an early-stage, local-first incident intelligence platform that helps developers understand logs, group related failures into incidents, and generate structured post-mortems using LLMs.

This repository contains two separate applications:

- **Frontend** – a dashboard to view logs, incidents, and post-mortems
- **Backend** – APIs to ingest events, create incidents, and generate post-mortems

<img width="4386" height="1409" alt="Robbin" src="https://github.com/user-attachments/assets/fba6aa39-add8-4e96-a20d-68bce4c94471" />

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

## 🌱 Future Scope
- Integrations with tools like Sentry and Datadog
- Cloud-hosted backend with multi-project support
- Smarter LLM-driven incident correlation and root-cause analysis
- Team collaboration, analytics, and incident insights

## 🏃 Running the Frontend

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager
- Backend server running (see backend repository for setup instructions)

### Installation & Running

1. **Clone the repository** (if you haven't already)
   ```bash
   git clone <repository-url>
   cd robbin-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure the backend API URL** (optional)
   - Create a `.env.local` file in the root directory
   - Add the following line (adjust the URL if your backend runs on a different port):
     ```
     NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
     ```
   - If not set, the frontend will default to `http://localhost:8000`

4. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   - Navigate to [http://localhost:3000](http://localhost:3000)
   - The frontend should now be running and connected to your backend

### Available Scripts

- `npm run dev` - Start the development server (runs on port 3000 by default)
- `npm run build` - Build the production-ready application
- `npm run start` - Start the production server (requires build first)
- `npm run lint` - Run ESLint to check for code issues

### Troubleshooting

- **Connection issues**: Make sure your backend server is running on the port specified in your `.env.local` file (default: `http://localhost:8000`)
- **Port already in use**: If port 3000 is occupied, Next.js will automatically use the next available port
- **Dependencies issues**: Try deleting `node_modules` and `package-lock.json`, then run `npm install` again
