from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class DetectRequest(BaseModel):
    """检测请求模型"""
    content: str


class Feature(BaseModel):
    """特征模型"""
    name: str
    value: float
    weight: float
    description: str
    indicator: str


class GraphFeature(BaseModel):
    """图谱特征模型"""
    propagationPattern: str
    propagationScore: float
    sourceCredibility: float
    userEngagement: str
    engagementScore: float
    botProbability: float


class DetectResponse(BaseModel):
    """检测响应模型"""
    score: float
    label: str
    confidence: float
    features: List[Feature]
    graphFeatures: GraphFeature
    keywords: List[str]
    riskFactors: List[str]
    timestamp: int


class HistoryResponse(BaseModel):
    """历史记录响应模型"""
    id: int
    content: str
    result: Optional[DetectResponse]
    timestamp: datetime
