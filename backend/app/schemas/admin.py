from pydantic import BaseModel, EmailStr


class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class AdminResponse(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class AdminLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str