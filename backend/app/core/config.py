from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置类"""
    # 应用配置
    APP_NAME: str = "Fake News Detector"
    DEBUG: bool = True
    
    # 数据库配置
    DATABASE_URL: str = "postgresql://admin:password@localhost:5432/example_db"
    
    # Redis配置
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # 模型配置
    MODEL_PATH: str = "./ml/models/gnn_model.pt"
    
    # 数据配置
    MAX_NEWS_LENGTH: int = 1000
    
    # API配置
    API_KEY: Optional[str] = None
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
