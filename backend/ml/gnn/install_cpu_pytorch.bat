@echo off

rem 安装CPU版本的PyTorch和相关依赖
echo ====================================
echo 安装CPU版本的PyTorch
echo ====================================

echo 1. 卸载现有PyTorch...
python -m pip uninstall -y torch torchvision torchaudio torch-geometric

echo 2. 安装Visual C++ Redistributable (如果需要)...
echo 请确保已安装Visual C++ Redistributable 2019或更高版本
echo 可以从以下链接下载：
echo https://learn.microsoft.com/zh-cn/cpp/windows/latest-supported-vc-redist?view=msvc-170

echo 3. 安装CPU版本的PyTorch...
python -m pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu

echo 4. 安装torch-geometric...
python -m pip install torch-geometric

echo 5. 验证安装...
python -c "import torch; print('PyTorch版本:', torch.__version__); print('CUDA可用:', torch.cuda.is_available())"

echo ====================================
echo 安装完成
pause
