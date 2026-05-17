from pydantic import BaseModel
from typing import List, Optional


class Node(BaseModel):
    """节点模型"""
    id: str
    x: float
    y: float
    vx: float
    vy: float
    label: str
    type: str
    isFake: Optional[bool] = None
    size: float
    timestamp: Optional[int] = None
    engagement: Optional[int] = None


class Edge(BaseModel):
    """边模型"""
    source: str
    target: str
    strength: float
    type: str


class GraphResponse(BaseModel):
    """图谱响应模型"""
    nodes: List[Node]
    edges: List[Edge]


class NodeResponse(BaseModel):
    """节点详情响应模型"""
    node: Node
    connections: int
    shares: int
    comments: int
