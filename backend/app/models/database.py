from sqlalchemy import Column, Integer, String, Text, Boolean, Float, ForeignKey, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class News(Base):
    """新闻表"""
    __tablename__ = "news"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    source_id = Column(Integer, ForeignKey("source.id"), nullable=True)
    is_fake = Column(Boolean, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class User(Base):
    """用户表"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Source(Base):
    """信息源表"""
    __tablename__ = "source"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True)
    credibility = Column(Float, default=0.5)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class Edge(Base):
    """边表（存储节点之间的关系）"""
    __tablename__ = "edges"
    
    id = Column(Integer, primary_key=True, index=True)
    source_id = Column(Integer, nullable=False)
    target_id = Column(Integer, nullable=False)
    source_type = Column(String(20), nullable=False)  # news, user, source
    target_type = Column(String(20), nullable=False)  # news, user, source
    edge_type = Column(String(20), nullable=False)  # share, comment, follow, publish
    strength = Column(Float, default=1.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DetectionHistory(Base):
    """检测历史表"""
    __tablename__ = "detection_history"
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(Text, nullable=False)
    result_id = Column(Integer, ForeignKey("detection_result.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class DetectionResult(Base):
    """检测结果表"""
    __tablename__ = "detection_result"
    
    id = Column(Integer, primary_key=True, index=True)
    score = Column(Float, nullable=False)
    label = Column(String(20), nullable=False)  # fake, real, uncertain
    confidence = Column(Float, nullable=False)
    features = Column(Text, nullable=True)  # JSON格式存储特征
    graph_features = Column(Text, nullable=True)  # JSON格式存储图谱特征
    keywords = Column(Text, nullable=True)  # JSON格式存储关键词
    risk_factors = Column(Text, nullable=True)  # JSON格式存储风险因素
    created_at = Column(DateTime(timezone=True), server_default=func.now())
