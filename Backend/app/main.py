from fastapi import FastAPI

from app.routes.services import router as services_router
from app.routes.projects import router as projects_router
from app.routes.testimonials import router as testimonials_router
from app.routes.faqs import router as faqs_router
from app.routes.enquiries import router as enquiries_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="Home renovation and interior design"
)


app.include_router(services_router)
app.include_router(projects_router)
app.include_router(testimonials_router)
app.include_router(faqs_router)
app.include_router(enquiries_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/")
def root():
    return {
        "message": "Home renovation and interior design is running"
    }
    
