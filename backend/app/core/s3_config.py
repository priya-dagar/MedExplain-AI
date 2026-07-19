import uuid
import boto3
from botocore.exceptions import ClientError
from app.core.config import settings

_s3_client = boto3.client(
    "s3",
    region_name=settings.AWS_REGION,
    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
)


def upload_prescription_image(image_bytes: bytes, user_id: int, content_type: str = "image/jpeg") -> str:
    key = f"medexplain/prescriptions/user_{user_id}/{uuid.uuid4()}.jpg"

    try:
        _s3_client.put_object(
            Bucket=settings.S3_BUCKET_NAME,
            Key=key,
            Body=image_bytes,
            ContentType=content_type,
        )
    except ClientError as e:
        raise RuntimeError(f"Failed to upload prescription image to S3: {e}") from e

    return f"https://{settings.S3_BUCKET_NAME}.s3.{settings.AWS_REGION}.amazonaws.com/{key}"