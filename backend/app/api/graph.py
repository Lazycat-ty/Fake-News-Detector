from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.graph import GraphResponse, NodeResponse
from app.services.graph_service import GraphService

router = APIRouter()
graph_service = GraphService()


@router.get("/", response_model=GraphResponse)
async def get_graph(db: Session = Depends(get_db)):
    """获取传播图谱数据"""
    try:
        graph_data = await graph_service.get_graph_data(db)
        return graph_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/node/{node_id}", response_model=NodeResponse)
async def get_node_detail(node_id: str, db: Session = Depends(get_db)):
    """获取节点详情"""
    try:
        node = await graph_service.get_node_detail(node_id, db)
        if not node:
            raise HTTPException(status_code=404, detail="节点不存在")
        return node
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
