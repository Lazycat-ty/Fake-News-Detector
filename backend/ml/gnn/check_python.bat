@echo off

rem 检查Python安装情况
echo ====================================
echo 检查Python安装情况
echo ====================================

echo 1. 检查Python命令是否可用...
python --version
if %errorlevel% neq 0 (
    echo 错误: Python命令不可用
    echo 检查以下内容:
    echo - 是否已安装Python
    echo - Python是否添加到系统环境变量
    echo - 尝试使用 python3 命令
    python3 --version
    if %errorlevel% neq 0 (
        echo 错误: python3 命令也不可用
    ) else (
        echo 提示: python3 命令可用
    )
) else (
    echo Python命令可用
)

echo 2. 检查pip命令是否可用...
python -m pip --version
if %errorlevel% neq 0 (
    echo 错误: pip命令不可用
) else (
    echo pip命令可用
)

echo 3. 检查系统PATH环境变量...
echo %PATH%

echo ====================================
echo 检查完成
pause
