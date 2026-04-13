from typing import ClassVar

from fastapi import Form, HTTPException
from pydantic import BaseModel, ConfigDict, ValidationError, field_validator


def build_validation_error_detail(exc: ValidationError) -> list[dict]:
    return exc.errors(include_context=False, include_url=False)


class TopUpRequest(BaseModel):
    allowed_bundles: ClassVar[set[str]] = {"10GB", "30GB", "Unlimited"}

    phone: str
    bundle: str

    model_config = ConfigDict(str_strip_whitespace=True)

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        if not value:
            raise ValueError("phone is required")
        if not value.isdigit():
            raise ValueError("phone must contain only digits")
        if not 9 <= len(value) <= 15:
            raise ValueError("phone length must be between 9 and 15 digits")
        return value

    @field_validator("bundle")
    @classmethod
    def validate_bundle(cls, value: str) -> str:
        if value not in cls.allowed_bundles:
            raise ValueError("bundle must be one of: 10GB, 30GB, Unlimited")
        return value

    @classmethod
    def as_form(
        cls,
        phone: str = Form(...),
        bundle: str = Form(...),
    ) -> "TopUpRequest":
        try:
            return cls(phone=phone, bundle=bundle)
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=build_validation_error_detail(exc)) from exc


class ActivateEsimRequest(BaseModel):
    iccid: str
    name: str
    nationality: str

    model_config = ConfigDict(str_strip_whitespace=True)

    @field_validator("iccid")
    @classmethod
    def validate_iccid(cls, value: str) -> str:
        if not value:
            raise ValueError("iccid is required")
        if not value.isdigit():
            raise ValueError("iccid must contain only digits")
        if not value.startswith("89"):
            raise ValueError("iccid must start with 89")
        if not 19 <= len(value) <= 20:
            raise ValueError("iccid length must be between 19 and 20 digits")
        return value

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        if not value:
            raise ValueError("name is required")
        if len(value) < 2:
            raise ValueError("name must be at least 2 characters")
        if len(value) > 100:
            raise ValueError("name must not exceed 100 characters")
        return value

    @field_validator("nationality")
    @classmethod
    def validate_nationality(cls, value: str) -> str:
        if not value:
            raise ValueError("nationality is required")
        if len(value) < 2:
            raise ValueError("nationality must be at least 2 characters")
        if len(value) > 60:
            raise ValueError("nationality must not exceed 60 characters")
        return value

    @classmethod
    def as_form(
        cls,
        iccid: str = Form(...),
        name: str = Form(...),
        nationality: str = Form(...),
    ) -> "ActivateEsimRequest":
        try:
            return cls(iccid=iccid, name=name, nationality=nationality)
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=build_validation_error_detail(exc)) from exc
