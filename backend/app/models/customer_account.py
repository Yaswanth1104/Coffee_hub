from sqlalchemy import Column, ForeignKey, Integer, String

from app.database.connection import Base


class CustomerAccount(Base):
    __tablename__ = "customer_accounts"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
