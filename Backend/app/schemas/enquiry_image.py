from pydantic import BaseModel, ConfigDict


class EnquiryImageResponse(BaseModel):
    id: int
    enquiry_id: int
    file_url: str
    original_filename: str

    model_config = ConfigDict(from_attributes=True)