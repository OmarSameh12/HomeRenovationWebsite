from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    slug: str
    description: str
    image_url: str
    is_active: bool = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)