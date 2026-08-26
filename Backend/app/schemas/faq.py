from pydantic import BaseModel, ConfigDict


class FAQResponse(BaseModel):
    id: int
    question: str
    answer: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)