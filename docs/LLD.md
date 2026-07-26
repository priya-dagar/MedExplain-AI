# Low-Level Design

## 1. Module Breakdown
### Backend structure
- app/main.py
  - Creates the FastAPI app
  - Registers all routers and middleware
- app/auth/
  - Handles signup, login, OTP verification, JWT utilities, and current-user access
- app/symptom/
  - Stores chat turns and exposes symptom chat endpoints
- app/prescription/
  - Validates uploads, sends images to the AI agent, and stores prescriptions
- app/health_record/
  - Maintains a timeline of user health-related events
- app/healthcare/
  - Queries nearby facilities using location data
- app/profile/
  - Exposes profile read and update operations
- app/ai/
  - Contains the LangGraph graph, supervisor, agents, and tool definitions

## 2. Core Data Models
### User
- id
- name
- email
- password_hash
- phone_number
- is_verified
- otp_code
- otp_expires_at
- age, gender, blood_group, allergies, medical_history
- created_at

### Prescription
- id
- user_id
- image_url
- ai_summary
- extracted_data
- created_at

### HealthRecord
- id
- user_id
- record_type
- source_id
- summary
- created_at

### ChatHistory
- id
- user_id
- conversation_id
- message
- response
- intent
- created_at

## 3. Router-to-Service Mapping
| Route group | Responsibility | Main service/modules |
|---|---|---|
| /api/auth | Authentication and profile identity | auth/routes.py, auth/service.py |
| /api/symptom | AI symptom conversations | symptom/routes.py, symptom/service.py, ai/graph.py |
| /api/prescription | Upload and history of prescriptions | prescription/routes.py, prescription/service.py |
| /api/health-record | Timeline and health-record chat | health_record/routes.py, health_record/service.py |
| /api/healthcare | Nearby facility search | healthcare/routes.py, healthcare/service.py |
| /api/profile | Profile read and update | profile/routes.py |

## 4. AI Workflow Design
### Supervisor
- Classifies incoming messages into symptom, health_record, or general
- Uses the recent conversation history to improve routing

### Symptom agent
- Uses Gemini with tool calling
- Calls get_prescription_history to retrieve relevant previous prescriptions
- Produces conversational symptom guidance without diagnosing

### Health-record agent
- Uses get_health_timeline to summarize recorded activity
- Answers questions about a user’s history

### Prescription agent
- Receives image bytes and MIME type
- Sends the image to Gemini Vision
- Returns a plain-language explanation of the prescription

## 5. Implementation Notes
- SQLAlchemy ORM models are mapped using Alembic migrations
- Authentication uses a JWT access token with bearer token auth
- The backend validates uploads before storing or analyzing them
- Health records are generated automatically when new symptom chats or prescriptions are created
