from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminResponse


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
):
    existing_admin = db.query(Admin).filter(
        Admin.email == admin.email
    ).first()

    if existing_admin:
        raise HTTPException(
            status_code=400,
            detail="Admin with this email already exists",
        )

    new_admin = Admin(
        name=admin.name,
        email=admin.email,
        password=admin.password,
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
):
    return db.query(Admin).all()


# -------------------------
# GET ADMIN BY ID
# -------------------------
@router.get("/{admin_id}", response_model=AdminResponse)
def get_admin(
    admin_id: int,
    db: Session = Depends(get_db),
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
):
    admin = db.query(Admin).filter(
        Admin.id == admin_id
    ).first()

    if admin is None:
        raise HTTPException(
            status_code=404,
            detail="Admin not found",
        )

    # Check if email is already used by another admin
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
    admin.password = admin_data.password

    db.commit()
    db.refresh(admin)

    return admin


# -------------------------
# DELETE ADMIN
# -------------------------
@router.delete("/{admin_id}")
def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
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