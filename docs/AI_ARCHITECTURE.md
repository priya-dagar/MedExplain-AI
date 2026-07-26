# AI Architecture

## 1. Purpose
The AI layer of MedExplain AI helps users understand health-related information without requiring them to manually inspect documents or remember past interactions. It combines LLM reasoning, tool use, and a small orchestration graph to keep the experience practical and contextual.

## 2. Core Components
### Supervisor
The supervisor classifies each user message into one of three intents:
- symptom
- health_record
- general

This routing step decides whether the message should be handled by the symptom agent, the health-record agent, or the fallback general response.

### Symptom agent
The symptom agent answers questions about symptoms, medication-related concerns, or lifestyle factors. It uses Gemini to generate a response and may call a tool to retrieve recent prescription history for context.

### Health-record agent
The health-record agent answers questions about a user’s timeline, prior conversations, and uploaded prescriptions. It uses a tool that fetches health records for the current user.

### Prescription agent
The prescription agent processes uploaded images and transforms them into a simple explanation of the medication and instructions seen in the prescription.

## 3. LangGraph Workflow
The backend uses LangGraph with a simple graph:
```text
Supervisor -> [symptom | health_record | general]
```

The supervisor is the entry point. From there, the workflow enters the appropriate specialist node and terminates.

## 4. Tool Use
The AI agents rely on tools to make responses more grounded:
- get_prescription_history: retrieves recent prescriptions for the user
- get_health_timeline: retrieves the user’s health record timeline

These tools allow the model to answer with context from prior activity rather than relying only on the latest message.

## 5. Prompting Strategy
- The agents use system prompts to enforce safety boundaries and response style.
- The symptom agent is instructed to avoid diagnosis and encourage medical consultation when appropriate.
- The prescription agent is instructed to explain only what is visible in the uploaded image and to avoid guessing.

## 6. Data Flow
### Chat flow
1. The frontend sends a message to /api/symptom/chat.
2. The backend loads recent conversation history.
3. The supervisor classifies the intent.
4. The relevant agent generates the response.
5. The response is saved to chat_history and optionally added to health_records.

### Prescription flow
1. The frontend uploads an image to /api/prescription/upload.
2. The backend validates the file and stores it in S3.
3. The prescription agent analyzes the image and returns a summary.
4. The summary is saved in the prescriptions table and a health record entry is created.

## 7. Safety and Guardrails
- Responses are framed as general support, not medical diagnosis.
- The system does not instruct users to start or stop medications.
- Emergency symptoms are handled by encouraging urgent medical attention.
- The app uses explicit disclaimers in the frontend experience.
