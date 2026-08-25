from pydantic import BaseModel, EmailStr, Field


class CustomerRegister(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str | None = None
    password: str = Field(min_length=8, max_length=128)


class CustomerLogin(BaseModel):
    email: EmailStr
    password: str


class CustomerAuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    customer_id: int
    name: str
    email: EmailStr
