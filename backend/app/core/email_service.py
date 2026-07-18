import resend
import os
from app.core.config import settings

resend.api_key = settings.RESEND_API_KEY

def send_otp_email(to_email: str, otp_code: str):
    resend.Emails.send({
        "from": "MedExplain AI <onboarding@resend.dev>",
        "to": [to_email],
        "subject": "Your MedExplain AI verification code",
        "html": f"<p>Your verification code is:</p><h2>{otp_code}</h2><p>This code expires in 10 minutes.</p>",
    })