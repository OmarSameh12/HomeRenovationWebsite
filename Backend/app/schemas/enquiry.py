from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class EnquiryCreate(BaseModel):
    name: str
    phone: str
    email: str | None = None
    service_id: int | None = None
    property_type: str | None = None
    location: str | None = None
    description: str


class EnquiryImageResponse(BaseModel):
    id: int
    file_url: str
    original_filename: str

    model_config = ConfigDict(from_attributes=True)


class EnquiryResponse(BaseModel):
    id: int
    name: str
    phone: str
    email: str | None
    service_id: int | None
    property_type: str | None
    location: str | None
    description: str
    status: str
    created_at: datetime
    reference_images: list[EnquiryImageResponse] = Field(default_factory=list)

    model_config = ConfigDict(from_attributes=True)