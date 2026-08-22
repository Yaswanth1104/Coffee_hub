from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.customer import Customer
from app.schemas.customer import CustomerCreate, CustomerResponse


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


# CREATE CUSTOMER
@router.post("/", response_model=CustomerResponse)
def create_customer(
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    existing_customer = db.query(Customer).filter(
        Customer.email == customer.email
    ).first()

    if existing_customer:
        raise HTTPException(
            status_code=400,
            detail="Customer with this email already exists",
        )

    new_customer = Customer(
        name=customer.name,
        email=customer.email,
        phone=customer.phone,
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


# GET ALL CUSTOMERS
@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
):
    return db.query(Customer).all()


# GET SINGLE CUSTOMER
@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    return customer


# UPDATE CUSTOMER
@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    customer: CustomerCreate,
    db: Session = Depends(get_db),
):
    existing_customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if existing_customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    # Check if email belongs to another customer
    duplicate_email = db.query(Customer).filter(
        Customer.email == customer.email,
        Customer.id != customer_id,
    ).first()

    if duplicate_email:
        raise HTTPException(
            status_code=400,
            detail="Customer with this email already exists",
        )

    existing_customer.name = customer.name
    existing_customer.email = customer.email
    existing_customer.phone = customer.phone

    db.commit()
    db.refresh(existing_customer)

    return existing_customer


# DELETE CUSTOMER
@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
):
    existing_customer = db.query(Customer).filter(
        Customer.id == customer_id
    ).first()

    if existing_customer is None:
        raise HTTPException(
            status_code=404,
            detail="Customer not found",
        )

    db.delete(existing_customer)
    db.commit()

    return {
        "message": "Customer deleted successfully"
    }