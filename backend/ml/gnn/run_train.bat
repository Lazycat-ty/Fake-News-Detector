@echo off

rem 图神经网络模型训练启动脚本

setlocal

echo ====================================
echo 图神经网络模型训练启动脚本
echo ====================================

echo 检查Python环境...
python --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Python。请确保已安装Python 3.10+并添加到系统路径。
    pause
    exit /b 1
)

echo 检查依赖包...
python -c "import torch, torch_geometric; print('依赖检查通过')"
if %errorlevel% neq 0 (
    echo 错误: 缺少依赖包。正在安装...
    pip install torch torchvision torchaudio torch-geometric
    if %errorlevel% neq 0 (
        echo 错误: 依赖安装失败。请手动安装所需依赖。
        pause
        exit /b 1
    )
)

echo 启动训练...
python train.py

if %errorlevel% neq 0 (
    echo 训练失败，请检查错误信息。
    pause
    exit /b 1
)

echo 训练完成！
pause
