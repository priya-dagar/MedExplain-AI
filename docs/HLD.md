# High-Level Design

## 1. Overview
MedExplain AI follows a three-layer architecture:
- Frontend: React + TypeScript application for user interaction
- Backend: FastAPI service for authentication, business logic, and API exposure
- AI layer: Gemini-powered LangGraph workflow with specialist agents

## 2. Architecture Summary
```text
User Browser (React + Vite)
        |
        v
FastAPI Backend
  - Auth routes
  - Symptom chat routes
  - Prescription upload routes
  - Health record routes
  - Healthcare search routes
  - Profile routes
        |
        +--> LangGraph AI Workflow
        |       - Supervisor
        |       - Symptom Agent
        |       - Health Record Agent
        |       - Prescription Agent
        |
        +--> PostgreSQL (Supabase)
        +--> AWS S3 for prescription images
        +--> AWS SES for OTP email delivery
```

## 3. Major Components
### Frontend
- Handles login, registration, dashboard, chat, prescription upload, records, and healthcare search
- Uses Axios for API calls and React Router for navigation
- Stores access tokens in browser storage and uses request interceptors

### Backend
- Exposes REST endpoints under /api
- Implements JWT-based authentication and authorization
- Processes image uploads, AI requests, and timeline persistence

### AI Orchestration
- Uses LangGraph to route requests to the most relevant agent
- The supervisor classifies the user intent as symptom, health_record, or general
- Specialist agents use Gemini and tool calls to retrieve prescription and health history context

## 4. Request Flow Examples
### Symptom chat flow
1. User sends a chat message from the frontend.
2. Backend creates or reuses a conversation ID and loads recent history.
3. The LangGraph workflow routes the message to the symptom agent.
4. The agent may call tools to fetch relevant prescription history.
5. The response is saved to chat_history and optionally to health_records.

### Prescription upload flow
1. User uploads an image from the frontend.
2. Backend validates file type and size.
3. The image is stored in S3 and passed to the prescription analysis agent.
4. The AI summary is saved as a prescription record.
5. A corresponding health record entry is created.

## 5. Data Storage
- PostgreSQL stores users, prescriptions, chat logs, and health records
- S3 stores prescription images
- Email-based OTP verification is handled through AWS SES

## 6. Deployment Model
- Frontend: Vercel
- Backend: AWS EC2 behind NGINX with SSL
- Database: Supabase PostgreSQL
- Storage and email: AWS S3 and SES

## 7. Security and Reliability Considerations
- JWT access tokens protect authenticated endpoints
- CORS is configured for localhost and the production frontend domain
- File uploads are limited by file type and size
- Medical responses are framed as informational and not diagnostic
