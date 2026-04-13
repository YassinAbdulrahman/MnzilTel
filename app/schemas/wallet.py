from pydantic import BaseModel, ConfigDict


class WalletResponse(BaseModel):
    wallet: float


class PlanResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    total: int
    used: int


class UsageResponse(BaseModel):
    used: int
    total: int


class ActionResponse(BaseModel):
    success: bool
    message: str
    wallet: float
