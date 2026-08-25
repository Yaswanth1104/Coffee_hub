from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.admin import Admin
from app.schemas.admin import (
    AdminCreate,
    AdminResponse,
    AdminLogin,
    TokenResponse,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/admins",
    tags=["Admins"],
)


# -------------------------
# CREATE ADMIN
# -------------------------
@router.post("/", response_model=AdminResponse)
def create_admin(
    admin: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    # Check if email already exists
    existing_admin = db.query(Admin).filter(
        Admin.email == admin.email
    ).first()

    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Admin with this email already exists",
        )

    # Hash password before storing
    hashed_password = hash_password(
        admin.password
    )

    new_admin = Admin(
        name=admin.name,
        email=admin.email,
        password=hashed_password,
    )

    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)

    return new_admin


# -------------------------
# GET ALL ADMINS
# -------------------------
@router.get("/", response_model=list[AdminResponse])
def get_admins(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    return db.query(Admin).all()


# -------------------------
# GET ADMIN BY ID
# -------------------------
@router.get("/{admin_id}", response_model=AdminResponse)
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    admin = db.query(Admin).filter(
        Admin.id == admin_id
    ).first()

    if admin is None:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    return admin


# -------------------------
# UPDATE ADMIN
# -------------------------
@router.put("/{admin_id}", response_model=AdminResponse)
def update_admin(
    admin_id: int,
    admin_data: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    admin = db.query(Admin).filter(
        Admin.id == admin_id
    ).first()

    if admin is None:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    # Check if email belongs to another admin
    existing_admin = db.query(Admin).filter(
        Admin.email == admin_data.email,
        Admin.id != admin_id,
    ).first()

    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Another admin with this email already exists",
        )

    admin.name = admin_data.name
    admin.email = admin_data.email

    # Hash the new password
    admin.password = hash_password(
        admin_data.password
    )

    db.commit()
    db.refresh(admin)

    return admin


# -------------------------
# ADMIN LOGIN
# -------------------------
@router.post(
    "/login",
    response_model=TokenResponse,
)
def login_admin(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    # Find admin by email
    admin = db.query(Admin).filter(
        Admin.email == login_data.email
    ).first()

    if admin is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    # Verify password
    password_valid = verify_password(
        login_data.password,
        admin.password,
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password",
        )

    # Create JWT token with an explicit admin role
    access_token = create_access_token(
        data={
            "sub": str(admin.id),
            "email": admin.email,
            "role": "admin",
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# -------------------------
# DELETE ADMIN
# -------------------------
@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    admin = db.query(Admin).filter(
        Admin.id == admin_id
    ).first()

    if admin is None:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    db.delete(admin)
    db.commit()

    return {
        "message": "Admin deleted successfully"
    }