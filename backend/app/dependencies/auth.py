from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.security import decode_access_token


# -------------------------
# BEARER TOKEN SECURITY
# -------------------------

security = HTTPBearer()


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