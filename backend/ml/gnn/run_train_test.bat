@echo off

rem 测试训练脚本
echo ====================================
echo 测试训练脚本
echo ====================================

rem 检查Python环境
python --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Python
    pause
    exit /b 1
)

rem 安装pandas（如果需要）
echo 检查pandas...
python -c "import pandas"
if %errorlevel% neq 0 (
    echo 安装pandas...
    python -m pip install pandas
)

rem 运行训练脚本
echo 运行训练脚本...
python train.py

if %errorlevel% neq 0 (
    echo 训练脚本运行失败
    pause
    exit /b 1
)

echo 训练脚本运行成功！
pause
