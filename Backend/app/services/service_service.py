from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate


def get_services(db: Session) -> list[Service]:
    statement = (
        select(Service)
        .where(Service.is_active == True)
        .order_by(Service.id)
    )

    return list(db.scalars(statement).all())


def get_all_services(db: Session) -> list[Service]:
    """Admin listing: every service, including inactive ones."""
    statement = select(Service).order_by(Service.id)

    return list(db.scalars(statement).all())


def get_service_by_slug(db: Session, slug: str) -> Service | None:
    statement = select(Service).where(
        Service.slug == slug,
        Service.is_active == True
    )

    return db.scalar(statement)


def create_service(db: Session, service_data: ServiceCreate) -> Service:
    service = Service(**service_data.model_dump())

    db.add(service)
    db.commit()
    db.refresh(service)

    return service


def update_service(
    db: Session,
    service: Service,
    service_data: ServiceUpdate
) -> Service:
    for field, value in service_data.model_dump().items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)

    return service


def delete_service(db: Session, service: Service) -> None:
    db.delete(service)
    db.commit()