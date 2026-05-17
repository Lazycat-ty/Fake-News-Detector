from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import detect, graph, stats, health
from app.core.config import settings

app = FastAPI(
    title="Fake News Detector API",
    description="基于图神经网络的假新闻检测系统API",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 在生产环境中应该设置具体的前端域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(detect.router, prefix="/api/detect", tags=["检测"])
app.include_router(graph.router, prefix="/api/graph", tags=["图谱"])
app.include_router(stats.router, prefix="/api/stats", tags=["统计"])
app.include_router(health.router, prefix="/api/health", tags=["健康"])

@app.get("/")
async def root():
    return {"message": "Fake News Detector API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
