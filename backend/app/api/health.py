from fastapi import APIRouter
from app.schemas.health import HealthResponse
from app.services.health_service import HealthService

router = APIRouter()
health_service = HealthService()


@router.get("/", response_model=HealthResponse)
async def get_health():
    """获取系统健康状态"""
    health_status = await health_service.get_health_status()
    return health_status
