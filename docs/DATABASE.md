# Database Design

## 1. Overview
The backend uses PostgreSQL with SQLAlchemy ORM models and Alembic migrations. The database stores user identity, health conversations, prescriptions, and timeline records.

## 2. Core Tables
### users
Stores account and profile information.

| Column | Type | Notes |
|---|---|---|
| id | integer | Primary key |
| name | varchar(100) | User display name |
| email | varchar(255) | Unique, indexed |
| password_hash | varchar(255) | Hashed password |
| phone_number | varchar(20) | Optional |
| is_verified | boolean | Email verification status |
| otp_code | varchar | One-time password |
| otp_expires_at | datetime | OTP validity window |
| age | integer | Optional |
| gender | varchar | Optional |
| blood_group | varchar | Optional |
| allergies | text | Comma-separated notes |
| medical_history | text | Optional profile context |
| created_at | datetime | Timestamp |

### prescriptions
Stores prescription uploads and AI analysis output.

| Column | Type | Notes |
|---|---|---|
| id | integer | Primary key |
| user_id | integer | Foreign key to users.id |
| image_url | varchar(500) | Stored file URL |
| ai_summary | text | Gemini-generated explanation |
| extracted_data | json | Optional structured data |
| created_at | datetime | Timestamp |

### chat_history
Stores conversation turns for the symptom assistant.

| Column | Type | Notes |
|---|---|---|
| id | integer | Primary key |
| user_id | integer | Foreign key to users.id |
| conversation_id | varchar(36) | Groups turns into one chat |
| message | text | User message |
| response | text | Assistant response |
| intent | varchar(50) | Routed intent |
| created_at | datetime | Timestamp |

### health_records
Represents the user’s timeline of events and actions.

| Column | Type | Notes |
|---|---|---|
| id | integer | Primary key |
| user_id | integer | Foreign key to users.id |
| record_type | varchar(50) | symptom or prescription |
| source_id | integer | Reference to source record |
| summary | text | Human-readable summary |
| created_at | datetime | Timestamp |

## 3. Relationships
- One user has many prescriptions
- One user has many chat turns
- One user has many health records
- Health records can reference either a chat_history row or a prescription row via source_id

## 4. Migration Strategy
Alembic is used for schema changes. Migration files are stored in the backend/alembic/versions folder.

Typical workflow:
```bash
cd backend
alembic upgrade head
```

## 5. Design Notes
- The schema is intentionally simple and relational for ease of maintenance.
- Health records are derived from other data rather than stored as separate rich objects.
- The current implementation does not yet enforce strict foreign-key integrity across all source_id references, so the application layer remains responsible for consistent data entry.
