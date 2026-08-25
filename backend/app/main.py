from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.connection import Base, engine
from app.models.customer_account import CustomerAccount
from app.models.order import Order, OrderItem

from app.routes.customer import router as customer_router
from app.routes.customer_auth import router as customer_auth_router
from app.routes.admin import router as admin_router
from app.routes.coffee import router as coffee_router
from app.routes.order import router as order_router
from app.routes.admin_orders import router as admin_orders_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="CoffeeHub API",
    version="1.0.0",
    description="CoffeeHub Customer & Admin Management System",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(customer_router)
app.include_router(customer_auth_router)
app.include_router(admin_router)
app.include_router(coffee_router)
app.include_router(order_router)
app.include_router(admin_orders_router)


@app.get("/")
def root():
    return {"message": "CoffeeHub API is running"}


@app.get("/health")
def health():
    return {"status": "healthy"}
