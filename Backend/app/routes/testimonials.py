from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialResponse

router = APIRouter(prefix="/api", tags=["Testimonials"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/testimonials",
    response_model=list[TestimonialResponse],
)
def read_testimonials(db: Session = Depends(get_db)):
    statement = (
        select(Testimonial)
        .where(Testimonial.is_active == True)
        .order_by(Testimonial.id)
    )

    return list(db.scalars(statement).all())