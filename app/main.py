from contextlib import asynccontextmanager
import logging

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.api.routes.telecom import router as telecom_router
from app.api.routes.wallet import router as wallet_router
from app.core.database import Base, SessionLocal, engine
from app.core.logging import configure_logging
from app.core.config import settings
from app.services.wallet_service import WalletService

configure_logging()
logger = logging.getLogger(__name__)


def create_app(initialize_database: bool = True) -> FastAPI:
    @asynccontextmanager
    async def lifespan(_: FastAPI):
        if initialize_database:
            logger.info("Initializing database schema")
            Base.metadata.create_all(bind=engine)
            db = SessionLocal()
            try:
                WalletService.seed_initial_data(db)
            finally:
                db.close()
            logger.info("Database initialization complete")
        yield

    app = FastAPI(title="Telecom Backend", version="1.0.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_credentials="*" not in settings.allowed_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(wallet_router)
    app.include_router(telecom_router)

    @app.exception_handler(SQLAlchemyError)
    async def handle_database_error(_: Request, exc: SQLAlchemyError) -> JSONResponse:
        logger.exception("Database error", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"message": "A database error occurred. Please try again later."},
        )

    @app.exception_handler(Exception)
    async def handle_unexpected_error(_: Request, exc: Exception) -> JSONResponse:
        logger.exception("Unexpected server error", exc_info=exc)
        return JSONResponse(
            status_code=500,
            content={"message": "An unexpected server error occurred."},
        )

    @app.get("/")
    def healthcheck() -> dict:
        return {"status": "ok"}

    @app.get("/health")
    def health() -> dict:
        return {"status": "healthy"}

    return app


app = create_app()
app = FastAPI()
