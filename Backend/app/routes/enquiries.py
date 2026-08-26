import base64
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.enquiry import EnquiryCreate, EnquiryImageResponse, EnquiryResponse
from app.services.enquiry_service import (
    create_enquiry,
    get_enquiries,
    get_enquiry_by_id,
)
from app.models.enquiry_image import EnquiryImage

# Maximum allowed size for a single uploaded image (e.g. 8 MB).
MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def _mime_for_filename(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    return {
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".webp": "image/webp",
        ".gif": "image/gif",
    }.get(ext, "application/octet-stream")


router = APIRouter(prefix="/api", tags=["Enquiries"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post(
    "/enquiries",
    response_model=EnquiryResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_enquiry(
    enquiry_data: EnquiryCreate,
    db: Session = Depends(get_db),
):
    return create_enquiry(db, enquiry_data)


@router.get(
    "/admin/enquiries",
    response_model=list[EnquiryResponse],
)
def read_enquiries(db: Session = Depends(get_db)):
    return get_enquiries(db)


@router.get(
    "/admin/enquiries/{enquiry_id}",
    response_model=EnquiryResponse,
)
def read_enquiry(
    enquiry_id: int,
    db: Session = Depends(get_db),
):
    enquiry = get_enquiry_by_id(db, enquiry_id)

    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    return enquiry


@router.post(
    "/enquiries/{enquiry_id}/images",
    response_model=list[EnquiryImageResponse],
    status_code=status.HTTP_201_CREATED,
)
def upload_enquiry_images(
    enquiry_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
):
    """Upload one or more reference images for an enquiry.

    Images are stored as data URIs in the existing ``enquiry_images`` table
    (``file_url`` field) so they persist with the hosted database rather than
    relying on a local filesystem or an external storage provider.
    """
    enquiry = get_enquiry_by_id(db, enquiry_id)

    if not enquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Enquiry not found",
        )

    if not files:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No files provided",
        )

    created_images: list[EnquiryImage] = []

    for upload in files:
        filename = upload.filename or "image"
        ext = Path(filename).suffix.lower()

        if ext not in ALLOWED_IMAGE_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    f"Unsupported file type for '{filename}'. "
                    "Allowed: jpg, jpeg, png, webp, gif."
                ),
            )

        contents = upload.file.read()
        if len(contents) > MAX_IMAGE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                detail=f"File '{filename}' exceeds the 8 MB size limit.",
            )

        mime = _mime_for_filename(filename)
        data_uri = f"data:{mime};base64,{base64.b64encode(contents).decode('ascii')}"

        image = EnquiryImage(
            enquiry_id=enquiry.id,
            file_url=data_uri,
            original_filename=filename,
        )
        db.add(image)
        created_images.append(image)

    db.commit()
    for image in created_images:
        db.refresh(image)

    return created_images