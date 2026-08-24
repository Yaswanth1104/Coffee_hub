from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database.connection import get_db
from app.models.admin import Admin


security = HTTPBearer()


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    # -------------------------
    # GET TOKEN
    # -------------------------

    token = credentials.credentials

    # -------------------------
    # DECODE JWT TOKEN
    # -------------------------

    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    # -------------------------
    # GET ADMIN ID FROM TOKEN
    # -------------------------

    admin_id = payload.get("sub")

    if admin_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    # -------------------------
    # FIND ADMIN IN DATABASE
    # -------------------------

    try:
        admin_id = int(admin_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )

    admin = db.query(Admin).filter(
        Admin.id == admin_id
    ).first()

    # -------------------------
    # ADMIN DOES NOT EXIST
    # -------------------------

    if admin is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found",
        )

    # -------------------------
    # RETURN ADMIN
    # -------------------------

    return admin