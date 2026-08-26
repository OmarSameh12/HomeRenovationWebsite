from pydantic import BaseModel, ConfigDict


class TestimonialResponse(BaseModel):
    id: int
    name: str
    text: str
    rating: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True)