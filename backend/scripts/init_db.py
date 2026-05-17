"""数据库初始化脚本"""
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import create_tables, engine
from app.models.database import Base


def init_database():
    """初始化数据库"""
    print("开始初始化数据库...")
    try:
        # 创建数据库表
        create_tables()
        print("数据库表创建成功！")
        
        # 验证连接
        from sqlalchemy import text
        from app.core.database import SessionLocal
        
        db = SessionLocal()
        try:
            # 执行简单查询验证连接
            result = db.execute(text("SELECT 1")).scalar()
            print(f"数据库连接成功！查询结果: {result}")
        finally:
            db.close()
            
    except Exception as e:
        print(f"数据库初始化失败: {e}")
        sys.exit(1)


if __name__ == "__main__":
    init_database()
