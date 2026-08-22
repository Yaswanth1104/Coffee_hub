from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from passlib.context import CryptContext
from jose import jwt, JWTError


# -------------------------
# PASSWORD HASHING
# -------------------------

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return pwd_context.verify(
        plain_password,
        hashed_password,
    )


# -------------------------
# JWT CONFIGURATION
# -------------------------

SECRET_KEY = "coffeehub-secret-key"
ALGORITHM = "HS256"


# -------------------------
# HTTP BEARER
# -------------------------

security = HTTPBearer()


# -------------------------
# CREATE JWT TOKEN
# -------------------------

def create_access_token(data: dict) -> str:
    return jwt.encode(
        data,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# -------------------------
# DECODE JWT TOKEN
# -------------------------

def decode_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        return payload

    except JWTError:
        return None


# -------------------------
# GET CURRENT ADMIN
# -------------------------

def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    token = credentials.credentials

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
        )

    return payload