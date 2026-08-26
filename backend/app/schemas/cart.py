from pydantic import BaseModel, Field


class CartItemUpsert(BaseModel):
    coffee_id: int
    quantity: int = Field(ge=1, le=50)


class CartItemResponse(BaseModel):
    id: int
    coffee_id: int
    coffee_name: str
    description: str
    price: float
    category: str
    is_available: bool
    quantity: int


class CartResponse(BaseModel):
    items: list[CartItemResponse]
    subtotal: float
    total_items: int
