from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_customer
from app.database.connection import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerResponse, CustomerCreate


router = APIRouter(prefix="/customer-profile", tags=["Customer Profile"])


@router.get("/me", response_model=CustomerResponse)
def get_my_profile(
    current_customer: Customer = Depends(get_current_customer),
):
    return current_customer


@router.put("/me", response_model=CustomerResponse)
def update_my_profile(
    data: CustomerCreate,
    current_customer: Customer = Depends(get_current_customer),
    db: Session = Depends(get_db),
):
    duplicate = (
        db.query(Customer)
        .filter(Customer.email == data.email, Customer.id != current_customer.id)
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=400, detail="Customer with this email already exists")

    current_customer.name = data.name
    current_customer.email = data.email
    current_customer.phone = data.phone
    current_customer.address = data.address
    current_customer.city = data.city
    current_customer.pincode = data.pincode
    db.commit()
    db.refresh(current_customer)
    return current_customer
