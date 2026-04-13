from sqlalchemy import Float
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Wallet(Base):
    __tablename__ = "wallet"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    balance: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
