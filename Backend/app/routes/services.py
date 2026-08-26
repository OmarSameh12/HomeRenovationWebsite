from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.schemas.service import (
    ServiceCreate,
    ServiceResponse,
    ServiceUpdate,
)
from app.services.service_service import (
    get_services,
    get_service_by_slug,
    create_service,
    update_service,
    delete_service,
)

router = APIRouter(prefix="/api", tags=["Services"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/services", response_model=list[ServiceResponse])
def read_services(db: Session = Depends(get_db)):
    return get_services(db)


@router.get("/services/{slug}", response_model=ServiceResponse)
def read_service(slug: str, db: Session = Depends(get_db)):
    service = get_service_by_slug(db, slug)

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return service


@router.post(
    "/admin/services",
    response_model=ServiceResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_service(
    service_data: ServiceCreate,
    db: Session = Depends(get_db),
):
    return create_service(db, service_data)


@router.put(
    "/admin/services/{service_id}",
    response_model=ServiceResponse,
)
def update_existing_service(
    service_id: int,
    service_data: ServiceUpdate,
    db: Session = Depends(get_db),
):
    service = db.get(Service, service_id)

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return update_service(db, service, service_data)


@router.delete(
    "/admin/services/{service_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_existing_service(
    service_id: int,
    db: Session = Depends(get_db),
):
    service = db.get(Service, service_id)

    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    delete_service(db, service)