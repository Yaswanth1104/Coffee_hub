from pydantic import BaseModel


class CoffeeCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    category: str
    is_available: bool = True


class CoffeeResponse(BaseModel):
    id: int
    name: str
    description: str | None
    price: float
    category: str
    is_available: bool

    model_config = {
        "from_attributes": True
    }