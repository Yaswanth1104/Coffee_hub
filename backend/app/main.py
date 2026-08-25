import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database.connection import Base, engine, ensure_legacy_columns
from app.models.admin import Admin
from app.models.customer_account import CustomerAccount
from app.models.order import Order, OrderItem
from app.core.security import hash_password

from app.routes.customer import router as customer_router
from app.routes.customer_auth import router as customer_auth_router
from app.routes.customer_profile import router as customer_profile_router
from app.routes.admin import router as admin_router
from app.routes.coffee import router as coffee_router
from app.routes.order import router as order_router
from app.routes.admin_orders import router as admin_orders_router


# Keep existing local databases compatible with the current SQLAlchemy models.
Base.metadata.create_all(bind=engine)
ensure_legacy_columns()


def ensure_single_admin() -> None:
    """Create the first and only admin from environment credentials if needed."""
    admin_email = os.getenv("ADMIN_EMAIL")
    admin_password = os.getenv("ADMIN_PASSWORD")
    admin_name = os.getenv("ADMIN_NAME", "CoffeeHub Administrator")

    with Session(engine) as db:
        admin = db.query(Admin).order_by(Admin.id.asc()).first()
        if admin is not None:
            return

        if not admin_email or not admin_password:
            raise RuntimeError(
                "No administrator exists. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env."
            )

        db.add(
            Admin(
                name=admin_name,
                email=admin_email,
                password=hash_password(admin_password),
            )
        )
        db.commit()


ensure_single_admin()


app = FastAPI(
    title="CoffeeHub API",
    version="1.0.0",
    description="CoffeeHub Customer & Admin Management System",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(customer_router)
app.include_router(customer_auth_router)
app.include_router(customer_profile_router)
app.include_router(admin_router)
app.include_router(coffee_router)
app.include_router(order_router)
app.include_router(admin_orders_router)


@app.get("/")
def root():
    return {"message": "CoffeeHub API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
