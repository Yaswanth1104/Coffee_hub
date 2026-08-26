from datetime import datetime

from pydantic import BaseModel, EmailStr


class CustomerCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    pincode: str | None = None
    password: str | None = None


class CustomerUpdate(BaseModel):
    name: str
    email: EmailStr
    phone: str | None = None
    address: str | None = None
    city: str | None = None
    pincode: str | None = None
    password: str | None = None


class CustomerResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: str | None
    address: str | None
    city: str | None
    pincode: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
