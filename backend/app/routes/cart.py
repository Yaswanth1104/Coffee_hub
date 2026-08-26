from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.customer_dependencies import get_current_customer
from app.database.connection import get_db
from app.models.cart import CartItem
from app.models.coffee import Coffee
from app.models.customer import Customer
from app.schemas.cart import CartItemResponse, CartItemUpsert, CartResponse

router = APIRouter(prefix="/cart", tags=["Cart"])


def build_cart(db: Session, customer: Customer) -> CartResponse:
    rows = (
        db.query(CartItem, Coffee)
        .join(Coffee, CartItem.coffee_id == Coffee.id)
        .filter(CartItem.customer_id == customer.id)
        .order_by(CartItem.id.asc())
        .all()
    )
    items = [
        CartItemResponse(
            id=row.id,
            coffee_id=coffee.id,
            coffee_name=coffee.name,
            description=coffee.description,
            price=float(coffee.price),
            category=coffee.category,
            is_available=coffee.is_available,
            quantity=row.quantity,
        )
        for row, coffee in rows
    ]
    return CartResponse(
        items=items,
        subtotal=sum(item.price * item.quantity for item in items if item.is_available),
        total_items=sum(item.quantity for item in items),
    )


@router.get("/", response_model=CartResponse)
def get_cart(db: Session = Depends(get_db), customer: Customer = Depends(get_current_customer)):
    return build_cart(db, customer)


@router.post("/items", response_model=CartResponse)
def add_cart_item(data: CartItemUpsert, db: Session = Depends(get_db), customer: Customer = Depends(get_current_customer)):
    coffee = db.query(Coffee).filter(Coffee.id == data.coffee_id).first()
    if coffee is None:
        raise HTTPException(status_code=404, detail="Coffee not found")
    if not coffee.is_available:
        raise HTTPException(status_code=400, detail=f"{coffee.name} is currently unavailable")

    row = db.query(CartItem).filter(CartItem.customer_id == customer.id, CartItem.coffee_id == coffee.id).first()
    if row:
        row.quantity = min(50, row.quantity + data.quantity)
    else:
        row = CartItem(customer_id=customer.id, coffee_id=coffee.id, quantity=data.quantity)
        db.add(row)
    db.commit()
    return build_cart(db, customer)


@router.put("/items/{coffee_id}", response_model=CartResponse)
def update_cart_item(coffee_id: int, data: CartItemUpsert, db: Session = Depends(get_db), customer: Customer = Depends(get_current_customer)):
    if data.coffee_id != coffee_id:
        raise HTTPException(status_code=400, detail="Coffee id mismatch")
    row = db.query(CartItem).filter(CartItem.customer_id == customer.id, CartItem.coffee_id == coffee_id).first()
    if row is None:
        raise HTTPException(status_code=404, detail="Cart item not found")
    row.quantity = data.quantity
    db.commit()
    return build_cart(db, customer)


@router.delete("/items/{coffee_id}", response_model=CartResponse)
def remove_cart_item(coffee_id: int, db: Session = Depends(get_db), customer: Customer = Depends(get_current_customer)):
    row = db.query(CartItem).filter(CartItem.customer_id == customer.id, CartItem.coffee_id == coffee_id).first()
    if row:
        db.delete(row)
        db.commit()
    return build_cart(db, customer)


@router.delete("/", response_model=CartResponse)
def clear_cart(db: Session = Depends(get_db), customer: Customer = Depends(get_current_customer)):
    db.query(CartItem).filter(CartItem.customer_id == customer.id).delete(synchronize_session=False)
    db.commit()
    return build_cart(db, customer)
