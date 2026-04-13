import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.app_env = os.getenv("APP_ENV", "development")
        self.api_host = os.getenv("API_HOST", "127.0.0.1")
        self.api_port = int(os.getenv("API_PORT", "8001"))
        self.allowed_origins = self._resolve_allowed_origins()
        self.selfie_max_size_bytes = int(os.getenv("SELFIE_MAX_SIZE_BYTES", str(5 * 1024 * 1024)))
        self.selfie_allowed_content_types = {
            "image/jpeg",
            "image/png",
            "image/webp",
        }
        self.database_url = self._resolve_database_url()

    def _resolve_database_url(self) -> str:
        database_url = os.getenv("DATABASE_URL", "").strip()
        if database_url:
            return database_url

        db_host = os.getenv("DB_HOST", "").strip()
        db_port = os.getenv("DB_PORT", "3306").strip()
        db_user = os.getenv("DB_USER", "").strip()
        db_password = os.getenv("DB_PASSWORD", "").strip()
        db_name = os.getenv("DB_NAME", "").strip()

        if all([db_host, db_user, db_name]):
            return f"mysql+pymysql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

        raise ValueError(
            "Database configuration is missing. Set DATABASE_URL or provide "
            "DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, and DB_NAME in .env."
        )

    def _resolve_allowed_origins(self) -> list[str]:
        raw_value = os.getenv("ALLOWED_ORIGINS", "*").strip()
        if not raw_value:
            return ["*"]
        return [origin.strip() for origin in raw_value.split(",") if origin.strip()]


settings = Settings()
