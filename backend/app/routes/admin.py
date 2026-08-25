from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminResponse, AdminLogin, TokenResponse
from app.core.security import hash_password, verify_password, create_access_token
from app.core.dependencies import get_current_admin


router = APIRouter(prefix="/admins", tags=["Admins"])


@router.post("/", response_model=AdminResponse)
def create_admin(
    admin: AdminCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    """Keep CoffeeHub as a single-admin system.

    The first administrator is created during initial setup. Once an admin
    exists, no second administrator can be created from the API.
    """
    if db.query(Admin).count() >= 1:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="CoffeeHub allows only one administrator account",
        )

    existing_admin = db.query(Admin).filter(Admin.email == admin.email).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Admin with this email already exists")

    new_admin = Admin(
        name=admin.name,
        email=admin.email,
        password=hash_password(admin.password),
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin


@router.get("/", response_model=list[AdminResponse])
def get_admins(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(get_current_admin),
):
    return db.query(Admin).all()


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
    admin = db.query(Admin).filter(Admin.id == admin_id).first()
    if admin is None:
        raise HTTPException(status_code=404, detail="Admin not found")

    existing_admin = db.query(Admin).filter(
        Admin.email == admin_data.email,
        Admin.id != admin_id,
    ).first()
    if existing_admin:
        raise HTTPException(status_code=400, detail="Another admin with this email already exists")

    admin.name = admin_data.name
    admin.email = admin_data.email
    admin.password = hash_password(admin_data.password)
    db.commit()
    db.refresh(admin)
    return admin


@router.post("/login", response_model=TokenResponse)
def login_admin(
    login_data: AdminLogin,
    db: Session = Depends(get_db),
):
    admin = db.query(Admin).order_by(Admin.id.asc()).first()
    if admin is None or admin.email != login_data.email:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(login_data.password, admin.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={"sub": str(admin.id), "email": admin.email, "role": "admin"}
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
