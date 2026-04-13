from sqlalchemy.orm import Session

from app.models.plan import Plan
from app.models.wallet import Wallet


class WalletService:
    DEFAULT_BALANCE = 100.0
    DEFAULT_PLAN_NAME = "20GB Monthly"
    DEFAULT_PLAN_TOTAL = 20
    DEFAULT_PLAN_USED = 8

    @staticmethod
    def get_wallet(db: Session) -> Wallet:
        wallet = db.query(Wallet).first()
        if wallet is None:
            wallet = Wallet(balance=WalletService.DEFAULT_BALANCE)
            db.add(wallet)
            db.commit()
            db.refresh(wallet)
        return wallet

    @staticmethod
    def get_plan(db: Session) -> Plan:
        plan = db.query(Plan).first()
        if plan is None:
            plan = Plan(
                name=WalletService.DEFAULT_PLAN_NAME,
                total=WalletService.DEFAULT_PLAN_TOTAL,
                used=WalletService.DEFAULT_PLAN_USED,
            )
            db.add(plan)
            db.commit()
            db.refresh(plan)
        return plan

    @staticmethod
    def seed_initial_data(db: Session) -> None:
        WalletService.get_wallet(db)
        WalletService.get_plan(db)
