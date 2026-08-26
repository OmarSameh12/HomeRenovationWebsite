from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.enquiry import Enquiry
from app.schemas.enquiry import EnquiryCreate


def create_enquiry(
    db: Session,
    enquiry_data: EnquiryCreate
) -> Enquiry:
    enquiry = Enquiry(
        **enquiry_data.model_dump()
    )

    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)

    return enquiry


def get_enquiries(db: Session) -> list[Enquiry]:
    statement = (
        select(Enquiry)
        .options(selectinload(Enquiry.reference_images))
        .order_by(Enquiry.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_enquiry_by_id(
    db: Session,
    enquiry_id: int
) -> Enquiry | None:
    statement = (
        select(Enquiry)
        .options(selectinload(Enquiry.reference_images))
        .where(Enquiry.id == enquiry_id)
    )

    return db.scalar(statement)