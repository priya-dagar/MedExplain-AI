# Product Requirements Document

## 1. Product Overview
MedExplain AI is a web-based health companion that helps users understand prescriptions, discuss symptoms in plain language, maintain a personal health timeline, and discover nearby healthcare facilities. The system combines a React frontend with a FastAPI backend and Gemini-powered AI agents to provide guided, conversational health support.

## 2. Problem Statement
Medical information is often hard to interpret. Users may receive prescriptions with unclear instructions, struggle to remember past symptoms or medications, or need help finding nearby care. MedExplain AI addresses this by turning health-related information into a more understandable and organized experience.

## 3. Target Users
- Patients who want help understanding prescriptions and symptoms
- Users managing ongoing health records and conversations
- People seeking nearby clinics, hospitals, or diagnostic labs

## 4. Goals
- Help users understand medication instructions and health-related questions
- Let users store and review a personal health timeline
- Make healthcare discovery easier with location-based search
- Provide secure, authenticated access to personal health information

## 5. Core Features
### Authentication and account management
- Sign up, log in, and verify email with OTP
- Retrieve and update personal profile information

### AI health assistant
- Chat with a symptom-focused AI assistant
- Use conversation history to maintain context
- Route requests between symptom, health-record, and general intents

### Prescription understanding
- Upload prescription images
- Analyze prescription content with Gemini Vision
- Save the uploaded prescription and explanation to the user’s timeline

### Health records and timeline
- Store symptom chats and prescription uploads as health records
- View timeline summaries and dashboard metrics

### Healthcare discovery
- Search nearby hospitals, clinics, and diagnostic labs using location data
- Display results with distance, address, and contact info when available

## 6. Functional Requirements
1. Users must be able to register and log in securely.
2. Users must be able to verify their email through OTP.
3. Authenticated users must be able to chat with the AI assistant.
4. Authenticated users must be able to upload prescription images.
5. The system must store uploaded prescriptions and associated AI summaries.
6. The system must record health-related interactions in a timeline.
7. Users must be able to view their profile and update profile details.
8. The system must allow location-based healthcare searches.

## 7. Non-Functional Requirements
- The app should provide a responsive experience on desktop and mobile browsers.
- Personal health data must be protected behind JWT-based authentication.
- AI responses should be clearly framed as informational and not a substitute for medical advice.
- The backend should handle errors gracefully for unsupported files, invalid credentials, and unavailable healthcare services.

## 8. Success Criteria
- Users can complete registration and login in a few steps.
- Prescription upload and AI explanation work end-to-end.
- The health timeline reflects both chat conversations and prescription uploads.
- Nearby healthcare results load correctly for supported locations.

## 9. Out of Scope for Initial Release
- Full clinical diagnosis engine
- Lab result analysis and visit-history modules
- Long-term memory beyond the existing chat history model
- Advanced RAG or document-grounded medical knowledge retrieval
