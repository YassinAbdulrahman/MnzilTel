import logging

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.core.config import settings
from app.schemas.telecom import ActivateEsimRequest, TopUpRequest
from app.services.wallet_service import WalletService

logger = logging.getLogger(__name__)


class TelecomService:
    BUNDLE_PRICES = {
        "10GB": 20,
        "30GB": 50,
        "Unlimited": 100,
    }

    BUNDLE_USAGE_INCREASE = {
        "10GB": 2,
        "30GB": 5,
        "Unlimited": 10,
    }

    ESIM_COST = 30

    @classmethod
    def top_up(cls, db: Session, payload: TopUpRequest) -> dict:
        wallet = WalletService.get_wallet(db)
        plan = WalletService.get_plan(db)
        cost = cls.BUNDLE_PRICES[payload.bundle]

        if wallet.balance < cost:
            logger.info("Top-up rejected for phone=%s because wallet balance is insufficient", payload.phone)
            return {
                "success": False,
                "message": "Insufficient wallet balance",
                "wallet": wallet.balance,
            }

        try:
            wallet.balance -= cost
            plan.used = min(plan.total, plan.used + cls.BUNDLE_USAGE_INCREASE[payload.bundle])
            db.commit()
            db.refresh(wallet)
        except Exception:
            db.rollback()
            logger.exception("Top-up transaction failed for phone=%s", payload.phone)
            raise

        logger.info("Top-up completed for phone=%s with bundle=%s", payload.phone, payload.bundle)

        return {
            "success": True,
            "message": f"Top-up completed successfully for {payload.phone}",
            "wallet": wallet.balance,
        }

    @classmethod
    async def activate_esim(
        cls,
        db: Session,
        payload: ActivateEsimRequest,
        selfie: UploadFile | None,
    ) -> dict:
        wallet = WalletService.get_wallet(db)

        if selfie is None or not selfie.filename:
            return {
                "success": False,
                "message": "Selfie upload is required for KYC",
                "wallet": wallet.balance,
            }

        if selfie.content_type not in settings.selfie_allowed_content_types:
            return {
                "success": False,
                "message": "Selfie must be a JPG, PNG, or WEBP image",
                "wallet": wallet.balance,
            }

        if wallet.balance < cls.ESIM_COST:
            logger.info("eSIM activation rejected for iccid=%s because wallet balance is insufficient", payload.iccid)
            return {
                "success": False,
                "message": "Insufficient wallet balance for eSIM activation",
                "wallet": wallet.balance,
            }

        selfie_bytes = await selfie.read()
        if len(selfie_bytes) > settings.selfie_max_size_bytes:
            return {
                "success": False,
                "message": "Selfie file is too large",
                "wallet": wallet.balance,
            }

        try:
            wallet.balance -= cls.ESIM_COST
            db.commit()
            db.refresh(wallet)
        except Exception:
            db.rollback()
            logger.exception("eSIM activation transaction failed for iccid=%s", payload.iccid)
            raise

        logger.info("eSIM activated for iccid=%s", payload.iccid)

        return {
            "success": True,
            "message": f"eSIM activated successfully for {payload.iccid}",
            "wallet": wallet.balance,
        }
