from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


def get_projects(db: Session) -> list[Project]:
    statement = (
        select(Project)
        .order_by(Project.created_at.desc())
    )

    return list(db.scalars(statement).all())


def get_project_by_id(db: Session, project_id: int) -> Project | None:
    return db.get(Project, project_id)


def create_project(
    db: Session,
    project_data: ProjectCreate
) -> Project:
    project = Project(**project_data.model_dump())

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


def update_project(
    db: Session,
    project: Project,
    project_data: ProjectUpdate
) -> Project:
    for field, value in project_data.model_dump().items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)

    return project


def delete_project(db: Session, project: Project) -> None:
    db.delete(project)
    db.commit()