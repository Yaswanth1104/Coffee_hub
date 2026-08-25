import os

from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker


load_dotenv()


DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env")


engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def ensure_legacy_columns() -> None:
    """Add columns introduced after an older CoffeeHub database was created."""
    columns_by_table = {
        "customers": {
            "address": "VARCHAR",
            "city": "VARCHAR",
            "pincode": "VARCHAR",
        },
        "customer_accounts": {
            "customer_id": "INTEGER",
            "password_hash": "VARCHAR",
        },
        "coffees": {
            "description": "VARCHAR",
            "category": "VARCHAR",
            "is_available": "BOOLEAN DEFAULT TRUE",
        },
        "orders": {
            "customer_id": "INTEGER",
            "customer_name": "VARCHAR",
            "phone": "VARCHAR",
            "address": "VARCHAR",
            "city": "VARCHAR",
            "pincode": "VARCHAR",
            "subtotal": "DOUBLE PRECISION",
            "delivery_fee": "DOUBLE PRECISION DEFAULT 40",
            "total": "DOUBLE PRECISION",
            "status": "VARCHAR DEFAULT 'pending'",
            "payment_method": "VARCHAR DEFAULT 'cod'",
            "created_at": "TIMESTAMP",
        },
        "order_items": {
            "order_id": "INTEGER",
            "coffee_id": "INTEGER",
            "coffee_name": "VARCHAR",
            "unit_price": "DOUBLE PRECISION",
            "quantity": "INTEGER",
            "line_total": "DOUBLE PRECISION",
        },
    }

    with engine.begin() as connection:
        inspector = inspect(connection)
        for table_name, columns in columns_by_table.items():
            if not inspector.has_table(table_name):
                continue

            existing_columns = {
                column["name"] for column in inspector.get_columns(table_name)
            }
            for column_name, column_type in columns.items():
                if column_name not in existing_columns:
                    connection.execute(
                        text(
                            f'ALTER TABLE "{table_name}" '
                            f'ADD COLUMN "{column_name}" {column_type}'
                        )
                    )


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()
