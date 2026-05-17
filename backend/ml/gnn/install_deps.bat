@echo off

rem 安装所需依赖
echo ====================================
echo 安装所需依赖
echo ====================================

rem 检查Python环境
python --version
if %errorlevel% neq 0 (
    echo 错误: 未找到Python
    pause
    exit /b 1
)

rem 安装pandas
echo 安装pandas...
python -m pip install pandas

rem 安装scikit-learn
echo 安装scikit-learn...
python -m pip install scikit-learn

rem 安装networkx
echo 安装networkx...
python -m pip install networkx

rem 验证安装
echo 验证安装...
python -c "import pandas, sklearn, networkx; print('依赖安装成功')"

if %errorlevel% neq 0 (
    echo 依赖安装失败
    pause
    exit /b 1
)

echo 依赖安装成功！
pause
