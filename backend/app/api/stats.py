from fastapi import APIRouter, HTTPException
from app.schemas.stats import StatsOverview, PerformanceStats, DetectionStats
from app.services.stats_service import StatsService

router = APIRouter()
stats_service = StatsService()


@router.get("/overview", response_model=StatsOverview)
async def get_stats_overview():
    """获取系统概览统计"""
    try:
        stats = await stats_service.get_overview()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/performance", response_model=PerformanceStats)
async def get_performance_stats():
    """获取模型性能数据"""
    try:
        stats = await stats_service.get_performance()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/detection", response_model=DetectionStats)
async def get_detection_stats():
    """获取检测统计数据"""
    try:
        stats = await stats_service.get_detection_stats()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
