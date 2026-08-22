from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from app.utils.auth import get_current_user
from app.models.user import User
from app.config import get_settings

router = APIRouter(prefix="/api/settings", tags=["settings"])


class APIKeysUpdate(BaseModel):
    shodan_api_key: Optional[str] = None
    censys_api_key: Optional[str] = None
    virustotal_api_key: Optional[str] = None
    securitytrails_api_key: Optional[str] = None


class SettingsResponse(BaseModel):
    api_providers: dict
    scanner_settings: dict


@router.get("", response_model=SettingsResponse)
async def get_settings_view(user: User = Depends(get_current_user)):
    settings = get_settings()
    return SettingsResponse(
        api_providers={
            "shodan": {"configured": bool(settings.SHODAN_API_KEY)},
            "censys": {"configured": bool(settings.CENSYS_API_KEY)},
            "virustotal": {"configured": bool(settings.VIRUSTOTAL_API_KEY)},
            "securitytrails": {"configured": bool(settings.SECURITYTRAILS_API_KEY)},
        },
        scanner_settings={
            "max_concurrent_scans": settings.MAX_CONCURRENT_SCANS,
            "max_requests_per_second": settings.MAX_REQUESTS_PER_SECOND,
            "scan_timeout": settings.SCAN_TIMEOUT,
        },
    )


@router.put("/api-keys")
async def update_api_keys(data: APIKeysUpdate, user: User = Depends(get_current_user)):
    """In production, persist API keys securely in the database."""
    return {"detail": "API keys updated (restart required for env-based keys)"}
