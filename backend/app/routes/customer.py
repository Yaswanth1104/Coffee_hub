from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin
from app.core.security import hash_password
from app.database.connection import get_db
from app.models.customer import Customer
from app.models.customer_account import CustomerAccount
from app.schemas.customer import CustomerCreate, CustomerResponse, CustomerUpdate


router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.get("/", response_model=list[CustomerResponse])
def get_customers(
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
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


@router.post("/", response_model=CustomerResponse, status_code=status.HTTP_201_CREATED)
def create_customer(
    data: CustomerCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    if db.query(Customer).filter(Customer.email == data.email).first():
        raise HTTPException(status_code=400, detail="Customer with this email already exists")

    customer = Customer(
        name=data.name,
        email=data.email,
        phone=data.phone,
        address=data.address,
        city=data.city,
        pincode=data.pincode,
    )
    db.add(customer)
    db.flush()

    # Admin-created customers need a login account too.
    if data.password:
        db.add(
            CustomerAccount(
                customer_id=customer.id,
                password_hash=hash_password(data.password),
            )
        )

    try:
        db.commit()
        db.refresh(customer)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Customer could not be created")

    return customer


@router.put("/{customer_id}", response_model=CustomerResponse)
def update_customer(
    customer_id: int,
    data: CustomerUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    duplicate = (
        db.query(Customer)
        .filter(Customer.email == data.email, Customer.id != customer_id)
        .first()
    )
    if duplicate:
        raise HTTPException(status_code=400, detail="Another customer already uses this email")

    customer.name = data.name
    customer.email = data.email
    customer.phone = data.phone
    customer.address = data.address
    customer.city = data.city
    customer.pincode = data.pincode

    account = db.query(CustomerAccount).filter(CustomerAccount.customer_id == customer.id).first()
    if data.password:
        if account:
            account.password_hash = hash_password(data.password)
        else:
            db.add(
                CustomerAccount(
                    customer_id=customer.id,
                    password_hash=hash_password(data.password),
                )
            )

    try:
        db.commit()
        db.refresh(customer)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Customer could not be updated")

    return customer


@router.delete("/{customer_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin),
):
    customer = db.query(Customer).filter(Customer.id == customer_id).first()
    if customer is None:
        raise HTTPException(status_code=404, detail="Customer not found")

    account = db.query(CustomerAccount).filter(CustomerAccount.customer_id == customer.id).first()
    if account:
        db.delete(account)

    db.delete(customer)
    db.commit()
    return None
