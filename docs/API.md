# API Documentation

## 1. Base URL
- Local development: http://localhost:8000
- Production: https://api.priyadagar.site or the deployed backend URL

## 2. Authentication
Most protected endpoints require a bearer token.

Header:
```http
Authorization: Bearer <access_token>
```

## 3. Endpoints

### Health
| Method | Path | Description |
|---|---|---|
| GET | / | Welcome endpoint |
| GET | /health | Health check |

### Authentication
| Method | Path | Description |
|---|---|---|
| POST | /api/auth/signup | Create a new user account |
| POST | /api/auth/login | Log in and return a JWT |
| POST | /api/auth/verify-otp | Verify email with OTP |
| POST | /api/auth/resend-otp | Resend OTP to the registered email |
| GET | /api/auth/me | Get the current user profile |

### Symptom chat
| Method | Path | Description |
|---|---|---|
| POST | /api/symptom/chat | Send a symptom or general health message to the AI assistant |
| GET | /api/symptom/chat/history?conversation_id=... | Retrieve full chat history for a conversation |

Example request body for chat:
```json
{
  "message": "I have a mild headache after taking my medicine.",
  "conversation_id": "optional-existing-id"
}
```

### Prescription
| Method | Path | Description |
|---|---|---|
| POST | /api/prescription/upload | Upload a prescription image |
| GET | /api/prescription/history | Retrieve the user’s prescription history |

Example upload request:
- Form field: file
- Accepted types: image/jpeg, image/png, image/webp
- Max size: 10 MB

### Health records
| Method | Path | Description |
|---|---|---|
| POST | /api/health-record/chat | Ask the health-record agent about prior health activity |
| GET | /api/health-record/timeline | Get the user’s full health timeline |
| GET | /api/health-record/summary | Get dashboard summary metrics |

### Healthcare discovery
| Method | Path | Description |
|---|---|---|
| GET | /api/healthcare/nearby | Find nearby hospitals, clinics, or diagnostic labs |

Query parameters:
- lat: required latitude
- lng: required longitude
- facility_type: optional hospital | clinic | diagnostic_lab
- radius_m: optional distance in meters (500 to 20000)

### Profile
| Method | Path | Description |
|---|---|---|
| GET | /api/profile | Get profile details |
| PUT | /api/profile | Update profile details |

## 4. Error Handling
Common response patterns:
- 400: Invalid input, unsupported file type, or invalid OTP
- 401: Missing or invalid bearer token
- 403: Email not verified
- 404: Resource not found

## 5. Notes
- AI-generated responses should be treated as supportive information and not medical diagnosis.
- The app automatically records prescription uploads and symptom chats into the health timeline.
