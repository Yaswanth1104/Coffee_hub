from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.customer_dependencies import get_current_customer
from app.database.connection import get_db
from app.models.coffee import Coffee
from app.models.customer import Customer
from app.models.order import Order, OrderItem
from app.schemas.order import OrderCreate, OrderResponse
from app.services.whatsapp import send_new_order_notification


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post("/", response_model=OrderResponse, status_code=status.HTTP_201_CREATED)
def create_order(
    data: OrderCreate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    coffee_ids = [item.coffee_id for item in data.items]
    if len(set(coffee_ids)) != len(coffee_ids):
        raise HTTPException(status_code=400, detail="Duplicate coffee items are not allowed")

    coffees = db.query(Coffee).filter(Coffee.id.in_(coffee_ids)).all()
    coffee_map = {coffee.id: coffee for coffee in coffees}

    missing = [coffee_id for coffee_id in coffee_ids if coffee_id not in coffee_map]
    if missing:
        raise HTTPException(status_code=404, detail=f"Coffee not found: {missing[0]}")

    subtotal = 0.0
    order_items = []
    for requested in data.items:
        coffee = coffee_map[requested.coffee_id]
        if not coffee.is_available:
            raise HTTPException(status_code=400, detail=f"{coffee.name} is currently unavailable")
        line_total = float(coffee.price) * requested.quantity
        subtotal += line_total
        order_items.append(OrderItem(
            coffee_id=coffee.id,
            coffee_name=coffee.name,
            unit_price=float(coffee.price),
            quantity=requested.quantity,
            line_total=line_total,
        ))

    delivery_fee = 40.0 if subtotal > 0 else 0.0
    order = Order(
        customer_id=customer.id,
        customer_name=data.customer_name,
        phone=data.phone,
        address=data.address,
        city=data.city,
        pincode=data.pincode,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        total=subtotal + delivery_fee,
        status="pending",
        payment_method=data.payment_method,
    )
    order.items = order_items
    db.add(order)
    db.commit()
    db.refresh(order)

    # Notification is deliberately best-effort. A WhatsApp/API outage must not
    # turn a successful customer order into a failed checkout.
    send_new_order_notification(order)

    return order


@router.get("/", response_model=list[OrderResponse])
def get_my_orders(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    return (
        db.query(Order)
        .filter(Order.customer_id == customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_my_order(
    order_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):
    order = db.query(Order).filter(Order.id == order_id, Order.customer_id == customer.id).first()
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
