from io import BytesIO

from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.core.database import Base, get_db
from app.main import create_app
from app.services.wallet_service import WalletService


engine = create_engine(
    "sqlite://",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


def build_client():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()
    try:
        WalletService.seed_initial_data(db)
    finally:
        db.close()

    app = create_app(initialize_database=False)
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


def test_get_wallet_returns_seeded_balance():
    client = build_client()

    response = client.get("/wallet")

    assert response.status_code == 200
    assert response.json() == {"wallet": 100.0}


def test_get_plan_returns_seeded_plan():
    client = build_client()

    response = client.get("/plan")

    assert response.status_code == 200
    assert response.json() == {"name": "20GB Monthly", "total": 20, "used": 8}


def test_topup_updates_wallet_balance():
    client = build_client()

    response = client.post("/topup", files={"phone": (None, "0551234567"), "bundle": (None, "10GB")})

    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["wallet"] == 80.0


def test_activate_esim_requires_selfie():
    client = build_client()

    response = client.post(
        "/activate-esim",
        files={
            "iccid": (None, "8996651234567890123"),
            "name": (None, "Alaa Ali"),
            "nationality": (None, "Saudi"),
        },
    )

    assert response.status_code == 200
    assert response.json()["success"] is False
    assert response.json()["message"] == "Selfie upload is required for KYC"


def test_activate_esim_with_selfie_deducts_wallet_balance():
    client = build_client()

    response = client.post(
        "/activate-esim",
        files={
            "iccid": (None, "8996651234567890123"),
            "name": (None, "Alaa Ali"),
            "nationality": (None, "Saudi"),
            "selfie": ("selfie.jpg", BytesIO(b"fake-image-data"), "image/jpeg"),
        },
    )

    assert response.status_code == 200
    assert response.json()["success"] is True
    assert response.json()["wallet"] == 70.0


def test_activate_esim_rejects_invalid_selfie_type():
    client = build_client()

    response = client.post(
        "/activate-esim",
        files={
            "iccid": (None, "8996651234567890123"),
            "name": (None, "Alaa Ali"),
            "nationality": (None, "Saudi"),
            "selfie": ("selfie.txt", BytesIO(b"fake-image-data"), "text/plain"),
        },
    )

    assert response.status_code == 200
    assert response.json()["success"] is False
    assert response.json()["message"] == "Selfie must be a JPG, PNG, or WEBP image"


def test_topup_validation_rejects_non_numeric_phone():
    client = build_client()

    response = client.post("/topup", files={"phone": (None, "abc123"), "bundle": (None, "10GB")})

    assert response.status_code == 422
    assert response.json()["detail"][0]["msg"] == "Value error, phone must contain only digits"
