from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.database import DetectionHistory, DetectionResult
from app.schemas.detect import DetectResponse, Feature, GraphFeature, HistoryResponse
from ml.gnn.model import GNNModel
import json
import time


class DetectService:
    def __init__(self):
        self.model = GNNModel()
    
    async def detect_news(self, content: str, db: Session) -> DetectResponse:
        """检测新闻内容"""
        start_time = time.time()
        
        # 调用模型进行检测
        result = self.model.predict(content)
        
        # 保存检测历史
        history = DetectionHistory(
            content=content
        )
        db.add(history)
        db.flush()  # 获取history.id
        
        # 保存检测结果
        detection_result = DetectionResult(
            score=result['score'],
            label=result['label'],
            confidence=result['confidence'],
            features=json.dumps([f.model_dump() for f in result['features']]),
            graph_features=json.dumps(result['graphFeatures'].model_dump()),
            keywords=json.dumps(result['keywords']),
            risk_factors=json.dumps(result['riskFactors'])
        )
        db.add(detection_result)
        db.flush()  # 获取detection_result.id
        
        # 关联历史和结果
        history.result_id = detection_result.id
        db.commit()
        
        # 计算响应时间
        response_time = int((time.time() - start_time) * 1000)
        
        return result
    
    async def get_history(self, limit: int, db: Session) -> List[HistoryResponse]:
        """获取检测历史"""
        histories = db.query(DetectionHistory).order_by(
            DetectionHistory.created_at.desc()
        ).limit(limit).all()
        
        result = []
        for history in histories:
            if history.result_id:
                detection_result = db.query(DetectionResult).filter(
                    DetectionResult.id == history.result_id
                ).first()
                if detection_result:
                    features = [
                        Feature(**f) for f in json.loads(detection_result.features)
                    ]
                    graph_features = GraphFeature(**json.loads(detection_result.graph_features))
                    
                    detect_response = DetectResponse(
                        score=detection_result.score,
                        label=detection_result.label,
                        confidence=detection_result.confidence,
                        features=features,
                        graphFeatures=graph_features,
                        keywords=json.loads(detection_result.keywords),
                        riskFactors=json.loads(detection_result.risk_factors),
                        timestamp=int(detection_result.created_at.timestamp() * 1000)
                    )
                else:
                    detect_response = None
            else:
                detect_response = None
            
            history_response = HistoryResponse(
                id=history.id,
                content=history.content,
                result=detect_response,
                timestamp=history.created_at
            )
            result.append(history_response)
        
        return result
    
    async def get_history_detail(self, history_id: int, db: Session) -> HistoryResponse:
        """获取历史详情"""
        history = db.query(DetectionHistory).filter(
            DetectionHistory.id == history_id
        ).first()
        
        if not history:
            return None
        
        if history.result_id:
            detection_result = db.query(DetectionResult).filter(
                DetectionResult.id == history.result_id
            ).first()
            if detection_result:
                features = [
                    Feature(**f) for f in json.loads(detection_result.features)
                ]
                graph_features = GraphFeature(**json.loads(detection_result.graph_features))
                
                detect_response = DetectResponse(
                    score=detection_result.score,
                    label=detection_result.label,
                    confidence=detection_result.confidence,
                    features=features,
                    graphFeatures=graph_features,
                    keywords=json.loads(detection_result.keywords),
                    riskFactors=json.loads(detection_result.risk_factors),
                    timestamp=int(detection_result.created_at.timestamp() * 1000)
                )
            else:
                detect_response = None
        else:
            detect_response = None
        
        history_response = HistoryResponse(
            id=history.id,
            content=history.content,
            result=detect_response,
            timestamp=history.created_at
        )
        
        return history_response
