import cloudinary.uploader
from app.core.cloudinary_config import cloudinary  # noqa: F401 — ensures config runs


def upload_prescription_image(image_bytes: bytes, user_id: int) -> str:
    result = cloudinary.uploader.upload(
        image_bytes,
        folder=f"medexplain/prescriptions/user_{user_id}",
        resource_type="image",
    )
    return result["secure_url"]