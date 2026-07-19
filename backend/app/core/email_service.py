import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

_ses_client = boto3.client(
    "ses",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


def send_otp_email(to_email: str, otp_code: str):
    subject = "Your MedExplain AI verification code"
    html_body = (
        f"<p>Your verification code is:</p>"
        f"<h2>{otp_code}</h2>"
        f"<p>This code expires in 10 minutes.</p>"
    )

    try:
        _ses_client.send_email(
            Source=settings.SES_SENDER_EMAIL,
            Destination={"ToAddresses": [to_email]},
            Message={
                "Subject": {"Data": subject},
                "Body": {"Html": {"Data": html_body}},
            },
        )
    except ClientError as e:
        raise RuntimeError(f"Failed to send OTP email via SES: {e}") from e