import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.database.connection import Base, engine, ensure_legacy_columns
from app.models.admin import Admin
from app.models.customer_account import CustomerAccount
from app.models.order import Order, OrderItem
from app.models.cart import CartItem
from app.core.security import hash_password, verify_password

from app.routes.customer import router as customer_router
from app.routes.customer_auth import router as customer_auth_router
from app.routes.customer_profile import router as customer_profile_router
from app.routes.admin import router as admin_router
from app.routes.coffee import router as coffee_router
from app.routes.order import router as order_router
from app.routes.admin_orders import router as admin_orders_router
from app.routes.cart import router as cart_router


Base.metadata.create_all(bind=engine)
ensure_legacy_columns()

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "yashuchowdary565@gmail.com").strip().lower()
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD")
ADMIN_NAME = os.getenv("ADMIN_NAME", "CoffeeHub Administrator")


def ensure_single_admin() -> None:
    """Create and normalize exactly one CoffeeHub administrator."""
    with Session(engine) as db:
        admins = db.query(Admin).order_by(Admin.id.asc()).all()
        if not admins:
            if not ADMIN_PASSWORD:
                raise RuntimeError("No administrator exists. Set ADMIN_PASSWORD in backend/.env.")
            db.add(Admin(name=ADMIN_NAME, email=ADMIN_EMAIL, password=hash_password(ADMIN_PASSWORD)))
            db.commit()
            return

        admin = admins[0]
        changed = False
        if admin.email != ADMIN_EMAIL:
            admin.email = ADMIN_EMAIL
            changed = True
        if not admin.name:
            admin.name = ADMIN_NAME
            changed = True
        if ADMIN_PASSWORD:
            try:
                password_matches = verify_password(ADMIN_PASSWORD, admin.password)
            except Exception:
                password_matches = False
            if not password_matches:
                admin.password = hash_password(ADMIN_PASSWORD)
                changed = True
        if changed:
            db.commit()
        for extra_admin in admins[1:]:
            db.delete(extra_admin)
        if len(admins) > 1:
            db.commit()


ensure_single_admin()

app = FastAPI(
    title="CoffeeHub API",
    version="1.0.0",
    description="CoffeeHub Customer & Admin Management System",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
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
app.include_router(cart_router)


@app.get("/")
def root():
    return {"message": "CoffeeHub API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
