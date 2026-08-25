import os

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.database.connection import get_db
from app.models.admin import Admin
from app.models.customer import Customer
from app.models.customer_account import CustomerAccount
from app.schemas.customer_auth import (
    CustomerAuthResponse,
    CustomerLogin,
    CustomerRegister,
    UnifiedLoginResponse,
)


router = APIRouter(prefix="/customer-auth", tags=["Customer Authentication"])

ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "yashuchowdary565@gmail.com").strip().lower()


@router.post("/register", response_model=CustomerAuthResponse, status_code=status.HTTP_201_CREATED)
def register_customer(data: CustomerRegister, db: Session = Depends(get_db)):
    existing = db.query(Customer).filter(Customer.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Customer with this email already exists")

    customer = Customer(name=data.name, email=data.email, phone=data.phone)
    db.add(customer)
    db.flush()

    account = CustomerAccount(
        customer_id=customer.id,
        password_hash=hash_password(data.password),
    )
    db.add(account)
    db.commit()
    db.refresh(customer)

    token = create_access_token({"sub": str(customer.id), "role": "customer"})
    return CustomerAuthResponse(
        access_token=token,
        customer_id=customer.id,
        name=customer.name,
        email=customer.email,
    )


@router.post("/login", response_model=UnifiedLoginResponse)
def login_unified(data: CustomerLogin, db: Session = Depends(get_db)):
    """Single login entry point for both administrators and customers."""
    email = data.email.strip().lower()

    # Admin credentials always take the admin path.
    if email == ADMIN_EMAIL:
        admin = db.query(Admin).filter(Admin.email == ADMIN_EMAIL).first()
        if admin and verify_password(data.password, admin.password):
            token = create_access_token(
                {"sub": str(admin.id), "email": ADMIN_EMAIL, "role": "admin"}
            )
            return UnifiedLoginResponse(
                access_token=token,
                role="admin",
                name=admin.name,
                email=admin.email,
            )
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Any other valid account is authenticated as a customer.
    customer = db.query(Customer).filter(Customer.email == email).first()
    if not customer:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    account = db.query(CustomerAccount).filter(CustomerAccount.customer_id == customer.id).first()
    if not account or not verify_password(data.password, account.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": str(customer.id), "role": "customer"})
    return UnifiedLoginResponse(
        access_token=token,
        role="customer",
        customer_id=customer.id,
        name=customer.name,
        email=customer.email,
    )
