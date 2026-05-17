@echo off

REM 启动脚本

echo ====================================
echo Fake News Detector 后端服务启动脚本
echo ====================================

REM 检查Python版本
echo 检查Python版本...
python --version
if %errorlevel% neq 0 (
    echo 错误: 未安装Python 3.10+
    echo 请安装Python 3.10或更高版本
    pause
    exit /b 1
)

REM 检查pip
echo 检查pip...
python -m pip --version
if %errorlevel% neq 0 (
    echo 错误: 未安装pip
    echo 请安装pip
    pause
    exit /b 1
)

REM 安装依赖
echo 安装依赖...
python -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo 错误: 依赖安装失败
    pause
    exit /b 1
)

REM 初始化数据库
echo 初始化数据库...
python scripts/init_db.py
if %errorlevel% neq 0 (
    echo 警告: 数据库初始化失败，将使用内存存储
)

REM 启动服务
echo 启动后端服务...
echo 服务将在 http://localhost:8000 上运行
echo API文档地址: http://localhost:8000/docs
echo ====================================
python main.py
