from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerResponse
from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    """Admin-only customer directory.

    Customers are created through /customer-auth/register. The admin can
    view the resulting customer records here, but cannot create customer
    accounts on their behalf.
    """
    return db.query(Customer).order_by(Customer.created_at.desc()).all()


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer
