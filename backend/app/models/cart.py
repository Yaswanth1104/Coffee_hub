from sqlalchemy import Column, ForeignKey, Integer, UniqueConstraint

from app.database.connection import Base


class CartItem(Base):
    __tablename__ = "cart_items"
    __table_args__ = (UniqueConstraint("customer_id", "coffee_id", name="uq_cart_customer_coffee"),)

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id", ondelete="CASCADE"), nullable=False, index=True)
    coffee_id = Column(Integer, ForeignKey("coffees.id", ondelete="CASCADE"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
