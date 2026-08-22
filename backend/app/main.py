from fastapi import FastAPI

from app.database.connection import Base, engine

from app.routes.customer import router as customer_router
from app.routes.admin import router as admin_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CoffeeHub API",
    version="1.0.0",
    description="CoffeeHub Customer & Admin Management System",
)


app.include_router(customer_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {"message": "CoffeeHub API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}