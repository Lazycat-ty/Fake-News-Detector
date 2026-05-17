from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.detect import DetectRequest, DetectResponse, HistoryResponse
from app.services.detect_service import DetectService

router = APIRouter()
detect_service = DetectService()


@router.post("/", response_model=DetectResponse)
async def detect_news(request: DetectRequest, db: Session = Depends(get_db)):
    """检测新闻内容"""
    try:
        result = await detect_service.detect_news(request.content, db)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history", response_model=list[HistoryResponse])
async def get_history(limit: int = 10, db: Session = Depends(get_db)):
    """获取检测历史"""
    try:
        history = await detect_service.get_history(limit, db)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{history_id}", response_model=HistoryResponse)
async def get_history_detail(history_id: int, db: Session = Depends(get_db)):
    """获取历史详情"""
    try:
        history = await detect_service.get_history_detail(history_id, db)
        if not history:
            raise HTTPException(status_code=404, detail="历史记录不存在")
        return history
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
