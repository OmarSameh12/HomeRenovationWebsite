from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.faq import FAQ
from app.schemas.faq import FAQResponse

router = APIRouter(prefix="/api", tags=["FAQs"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get(
    "/faqs",
    response_model=list[FAQResponse],
)
def read_faqs(db: Session = Depends(get_db)):
    statement = (
        select(FAQ)
        .where(FAQ.is_active == True)
        .order_by(FAQ.id)
    )

    return list(db.scalars(statement).all())