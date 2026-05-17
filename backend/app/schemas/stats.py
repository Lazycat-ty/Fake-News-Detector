from pydantic import BaseModel
from typing import List, Optional


class StatsOverview(BaseModel):
    """系统概览统计模型"""
    totalToday: int
    fakeCount: int
    realCount: int
    uncertainCount: int
    accuracy: float
    avgResponseTime: int
    activeUsers: int
    qps: int


class PerformanceStats(BaseModel):
    """模型性能统计模型"""
    accuracy: float
    recall: float
    precision: float
    f1: float
    auc: float


class DetectionStats(BaseModel):
    """检测统计数据模型"""
    dailyStats: List[dict]
    hourlyStats: List[dict]
    categoryStats: List[dict]
    platformStats: List[dict]
