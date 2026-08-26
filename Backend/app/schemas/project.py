from pydantic import BaseModel, ConfigDict


class ProjectBase(BaseModel):
    title: str
    description: str
    location: str
    image_url: str
    before_image_url: str
    after_image_url: str
    is_featured: bool = False


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int

    model_config = ConfigDict(from_attributes=True)