import os

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminResponse, AdminLogin, TokenResponse, AdminCreate
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_admin


router = APIRouter(prefix="/admins", tags=["Admins"])

# CoffeeHub has exactly one administrator. The email is configured outside the
# source code so it can never be changed through a public/admin API request.
ADMIN_EMAIL = os.getenv("ADMIN_EMAIL", "yashuchowdary565@gmail.com").strip().lower()


@router.get("/", response_model=list[AdminResponse])
def get_admins(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return db.query(Admin).order_by(Admin.id.asc()).all()


@router.get("/{admin_id}", response_model=AdminResponse)
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")
    return admin


@router.put("/{admin_id}", response_model=AdminResponse)
def update_admin(
    admin_id: int,
    admin_data: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    if admin_id != current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update the administrator account",
        )

    if admin_data.email.strip().lower() != ADMIN_EMAIL:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The CoffeeHub administrator email cannot be changed",
        )

    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")

    admin.name = admin_data.name
    admin.email = ADMIN_EMAIL
    admin.password = hash_password(admin_data.password)
    db.commit()
    db.refresh(admin)
    return admin


@router.post("/login", response_model=TokenResponse)
def login_admin(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    # There is only one administrator. Never authenticate an arbitrary admin
    # record just because it happens to be the first row in the table.
    if login_data.email.strip().lower() != ADMIN_EMAIL:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    admin = db.query(Admin).filter(Admin.email == ADMIN_EMAIL).first()
    if admin is None or not verify_password(login_data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": str(admin.id), "email": ADMIN_EMAIL, "role": "admin"}
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="The CoffeeHub administrator account cannot be deleted",
    )
