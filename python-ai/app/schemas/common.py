from typing import Generic, TypeVar, Optional, Any
from pydantic import BaseModel
from datetime import datetime

T = TypeVar("T")

class StandardResponse(BaseModel, Generic[T]):
    success: bool = True
    message: str = "Operation successful"
    data: Optional[T] = None
    timestamp: datetime = datetime.utcnow()

class HealthCheckResponse(BaseModel):
    status: str
    version: str
    environment: str
    services: dict[str, str]
