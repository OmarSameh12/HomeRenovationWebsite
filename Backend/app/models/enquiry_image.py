from sqlalchemy import DateTime, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime

from app.database import Base


class EnquiryImage(Base):
    __tablename__ = "enquiry_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    enquiry_id: Mapped[int] = mapped_column(
        ForeignKey("enquiries.id", ondelete="CASCADE"),
        nullable=False
    )

    # Text (unbounded) because file_url stores base64 data URIs.
    file_url: Mapped[str] = mapped_column(Text, nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False
    )

    enquiry = relationship(
        "Enquiry",
        back_populates="reference_images"
    )