#!/bin/bash

# 启动脚本

echo "===================================="
echo "Fake News Detector 后端服务启动脚本"
echo "===================================="

# 检查Python版本
echo "检查Python版本..."
python3 --version
if [ $? -ne 0 ]; then
    echo "错误: 未安装Python 3.10+"
    echo "请安装Python 3.10或更高版本"
    exit 1
fi

# 检查pip
echo "检查pip..."
pip3 --version
if [ $? -ne 0 ]; then
    echo "错误: 未安装pip"
    echo "请安装pip"
    exit 1
fi

# 安装依赖
echo "安装依赖..."
pip3 install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "错误: 依赖安装失败"
    exit 1
fi

# 初始化数据库
echo "初始化数据库..."
python3 scripts/init_db.py
if [ $? -ne 0 ]; then
    echo "警告: 数据库初始化失败，将使用内存存储"
fi

# 启动服务
echo "启动后端服务..."
echo "服务将在 http://localhost:8000 上运行"
echo "API文档地址: http://localhost:8000/docs"
echo "===================================="
python3 main.py
