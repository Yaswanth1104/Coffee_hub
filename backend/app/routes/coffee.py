from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.coffee import Coffee
from app.schemas.coffee import CoffeeCreate, CoffeeResponse
from app.core.dependencies import get_current_admin


router = APIRouter(
    prefix="/coffees",
    tags=["Coffees"],
)


# -------------------------
# CREATE COFFEE
# -------------------------
@router.post("/", response_model=CoffeeResponse)
def create_coffee(
    coffee: CoffeeCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    new_coffee = Coffee(
        name=coffee.name,
        description=coffee.description,
        price=coffee.price,
        category=coffee.category,
        is_available=coffee.is_available,
    )

    db.add(new_coffee)
    db.commit()
    db.refresh(new_coffee)

    return new_coffee


# -------------------------
# GET ALL COFFEES
# -------------------------
@router.get("/", response_model=list[CoffeeResponse])
def get_coffees(
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    return db.query(Coffee).all()


# -------------------------
# GET COFFEE BY ID
# -------------------------
@router.get("/{coffee_id}", response_model=CoffeeResponse)
def get_coffee(
    coffee_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    coffee = db.query(Coffee).filter(
        Coffee.id == coffee_id
    ).first()

    if coffee is None:
        raise HTTPException(
            status_code=404,
            detail="Coffee not found",
        )

    return coffee


# -------------------------
# UPDATE COFFEE
# -------------------------
@router.put("/{coffee_id}", response_model=CoffeeResponse)
def update_coffee(
    coffee_id: int,
    coffee_data: CoffeeCreate,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    coffee = db.query(Coffee).filter(
        Coffee.id == coffee_id
    ).first()

    if coffee is None:
        raise HTTPException(
            status_code=404,
            detail="Coffee not found",
        )

    coffee.name = coffee_data.name
    coffee.description = coffee_data.description
    coffee.price = coffee_data.price
    coffee.category = coffee_data.category
    coffee.is_available = coffee_data.is_available

    db.commit()
    db.refresh(coffee)

    return coffee


# -------------------------
# DELETE COFFEE
# -------------------------
@router.delete("/{coffee_id}")
def delete_coffee(
    coffee_id: int,
    db: Session = Depends(get_db),
    current_admin: dict = Depends(get_current_admin),
):
    coffee = db.query(Coffee).filter(
        Coffee.id == coffee_id
    ).first()

    if coffee is None:
        raise HTTPException(
            status_code=404,
            detail="Coffee not found",
        )

    db.delete(coffee)
    db.commit()

    return {
        "message": "Coffee deleted successfully"
    }