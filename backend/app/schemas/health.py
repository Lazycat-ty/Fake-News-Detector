from pydantic import BaseModel
from typing import Dict


class HealthResponse(BaseModel):
    """健康检查响应模型"""
    status: str
    services: Dict[str, Dict[str, str]]
    latency: int
