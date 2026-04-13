from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.wallet import PlanResponse, UsageResponse, WalletResponse
from app.services.wallet_service import WalletService

router = APIRouter(tags=["wallet"])


@router.get("/wallet", response_model=WalletResponse)
def get_wallet(db: Session = Depends(get_db)) -> WalletResponse:
    wallet = WalletService.get_wallet(db)
    return WalletResponse(wallet=wallet.balance)


@router.get("/plan", response_model=PlanResponse)
def get_plan(db: Session = Depends(get_db)) -> PlanResponse:
    plan = WalletService.get_plan(db)
    return PlanResponse.model_validate(plan)


@router.get("/usage", response_model=UsageResponse)
def get_usage(db: Session = Depends(get_db)) -> UsageResponse:
    plan = WalletService.get_plan(db)
    return UsageResponse(used=plan.used, total=plan.total)
