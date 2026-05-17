#!/usr/bin/env python
# 测试Python是否能正常运行

print("Python测试脚本")
print("=================================")

# 测试基本功能
print("1. 测试基本打印功能: 成功")

# 测试变量定义
x = 10
print(f"2. 测试变量定义: x = {x}")

# 测试循环
print("3. 测试循环:")
for i in range(3):
    print(f"   循环 {i+1}")

# 测试条件语句
if x > 5:
    print("4. 测试条件语句: x > 5 为真")

print("=================================")
print("Python测试完成！")
