from datetime import datetime

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    coffee_id: int
    quantity: int = Field(gt=0, le=50)


class OrderCreate(BaseModel):
    customer_name: str = Field(min_length=2, max_length=100)
    phone: str = Field(min_length=7, max_length=20)
    address: str = Field(min_length=5, max_length=300)
    city: str = Field(min_length=2, max_length=100)
    pincode: str = Field(pattern=r"^\d{6}$")
    payment_method: str = Field(default="cod", pattern="^cod$")
    items: list[OrderItemCreate] = Field(min_length=1, max_length=50)


class OrderItemResponse(BaseModel):
    coffee_id: int
    coffee_name: str
    unit_price: float
    quantity: int
    line_total: float


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    customer_name: str
    phone: str
    address: str
    city: str
    pincode: str
    subtotal: float
    delivery_fee: float
    total: float
    status: str
    payment_method: str
    created_at: datetime
    items: list[OrderItemResponse]

    model_config = {"from_attributes": True}
