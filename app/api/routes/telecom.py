from typing import Annotated

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.telecom import ActivateEsimRequest, TopUpRequest
from app.schemas.wallet import ActionResponse
from app.services.telecom_service import TelecomService

router = APIRouter(tags=["telecom"])


@router.post("/topup", response_model=ActionResponse)
def top_up(
    payload: Annotated[TopUpRequest, Depends(TopUpRequest.as_form)],
    db: Session = Depends(get_db),
) -> ActionResponse:
    result = TelecomService.top_up(db, payload)
    return ActionResponse(**result)


@router.post("/activate-esim", response_model=ActionResponse)
async def activate_esim(
    payload: Annotated[ActivateEsimRequest, Depends(ActivateEsimRequest.as_form)],
    selfie: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
) -> ActionResponse:
    result = await TelecomService.activate_esim(db, payload, selfie)
    return ActionResponse(**result)
