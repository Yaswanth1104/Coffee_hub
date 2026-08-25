from pydantic import BaseModel, Field


class OrderStatusUpdate(BaseModel):
    status: str = Field(pattern="^(pending|confirmed|preparing|ready|out_for_delivery|delivered|cancelled)$")
