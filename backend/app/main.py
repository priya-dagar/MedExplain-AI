from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.auth.routes import router as auth_router
from app.symptom.routes import router as symptom_router
from app.prescription.routes import router as prescription_router
from app.health_record.routes import router as health_record_router
from app.profile.routes import router as profile_router
from app.healthcare.routes import router as healthcare_router




app = FastAPI(
    title="MedExplain AI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://medexplain-frontend.vercel.app", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(symptom_router)
app.include_router(prescription_router)
app.include_router(health_record_router)
app.include_router(profile_router)
app.include_router(healthcare_router)





@app.get("/")
def root():
    return {"message": "Welcome to MedExplain AI"}


@app.get("/health")
def health():
    return {"status": "healthy"}