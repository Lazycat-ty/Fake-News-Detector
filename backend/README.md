# Fake News Detector 后端服务

基于图神经网络的假新闻检测系统后端服务。

## 技术栈

- Python 3.10+
- FastAPI
- PostgreSQL
- Redis
- PyTorch 2.1.0
- PyTorch Geometric 2.4.0
- Docker

## 目录结构

```
backend/
├── app/
│   ├── api/           # API接口
│   ├── core/          # 核心配置
│   ├── models/        # 数据库模型
│   ├── schemas/       # 数据模型
│   └── services/      # 业务逻辑
├── ml/                # 机器学习模型
│   └── gnn/           # 图神经网络模型
├── scripts/           # 脚本工具
├── main.py            # 应用入口
├── requirements.txt   # 依赖文件
├── Dockerfile         # Docker配置
├── start.sh           # Linux启动脚本
├── start.bat          # Windows启动脚本
└── README.md          # 项目文档
```

## 核心功能

1. **新闻检测**：使用图神经网络模型检测新闻真实性
2. **传播图谱**：分析新闻传播网络结构
3. **数据统计**：提供系统运行和检测统计数据
4. **健康检查**：监控系统健康状态
5. **数据采集**：从社交媒体平台采集新闻数据

## API接口

### 检测接口
- `POST /api/detect/`：检测新闻真实性
- `GET /api/detect/history`：获取检测历史
- `GET /api/detect/history/{id}`：获取检测历史详情

### 图谱接口
- `GET /api/graph/`：获取传播图谱数据
- `GET /api/graph/node/{id}`：获取节点详情

### 统计接口
- `GET /api/stats/overview`：获取系统概览统计
- `GET /api/stats/performance`：获取模型性能数据
- `GET /api/stats/detection`：获取检测统计数据

### 健康检查接口
- `GET /api/health/`：获取系统健康状态

## 安装和运行

### 环境要求
- Python 3.10+
- PostgreSQL (可选，默认使用内存存储)
- Redis (可选，默认使用内存缓存)

### 安装步骤

1. **安装依赖**
   ```bash
   # Linux/Mac
   pip install -r requirements.txt
   
   # Windows
   python -m pip install -r requirements.txt
   ```

2. **配置环境变量**
   复制 `.env.example` 文件为 `.env`，并修改配置：
   ```
   # 数据库配置
   DATABASE_URL=postgresql://admin:password@localhost:5432/example_db
   
   # Redis配置
   REDIS_URL=redis://localhost:6379/0
   
   # 模型配置
   MODEL_PATH=./ml/models/gnn_model.pt
   
   # 应用配置
   APP_NAME=Fake News Detector
   DEBUG=True
   ```

3. **初始化数据库**
   ```bash
   # Linux/Mac
   python scripts/init_db.py
   
   # Windows
   python scripts\init_db.py
   ```

4. **启动服务**
   ```bash
   # Linux/Mac
   python main.py
   
   # Windows
   python main.py
   ```

   或者使用启动脚本：
   ```bash
   # Linux/Mac
   ./start.sh
   
   # Windows
   start.bat
   ```

## Docker部署

1. **构建镜像**
   ```bash
   docker build -t gnn-fakenews-backend .
   ```

2. **运行容器**
   ```bash
   docker run -d -p 8000:8000 --name gnn-fakenews-backend gnn-fakenews-backend
   ```

## API文档

启动服务后，可以访问以下地址查看API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 注意事项

1. 本系统使用的图神经网络模型为演示版本，实际应用中需要使用训练好的模型
2. 数据采集模块需要配置相应平台的API密钥
3. 生产环境中应修改默认的数据库配置和API密钥
4. 系统支持水平扩展，可以通过负载均衡提高性能
