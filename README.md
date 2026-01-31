# 🧠 Robbin – AI-Powered Incident Analysis & Post-Mortem Generator (Prototype)

Robbin is an early-stage, local-first incident intelligence platform that helps developers understand logs, group related failures into incidents, and generate structured post-mortems using LLMs.
This repository contains two separate applications:- 

**Frontend** – a dashboard to view logs, incidents, and post-mortems- 
**Backend** – APIs to ingest events, create incidents, and generate post-mortems

<img width="4386" height="1409" alt="Robbin" src="https://github.com/user-attachments/assets/fba6aa39-add8-4e96-a20d-68bce4c94471" />

---

## Project StatusThis is a working prototype:
- Frontend and backend are functional  
- Data is stored in local SQLite  
- LLM features run when a user provides their own OpenAI API key  
- Cloud hosting and production integrations are not added yetThe goal is to show product flow, system design, and how LLMs can sit inside an incident workflow.

---

## Future Scope- Integrations with tools like Sentry and Datadog
- Cloud-hosted backend with multi-project support
- Smarter LLM-driven incident correlation and root-cause analysis
- Team collaboration, analytics, and incident insights

---

## Running the Frontend### Prerequisites
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
npm install   # or   
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
npm run dev   # or   
yarn dev   
```

5. **Open your browser**   
- Navigate to [http://localhost:3000](http://localhost:3000)   
- The frontend should now be running and connected to your backend
