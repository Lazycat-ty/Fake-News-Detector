from typing import List, Dict
from app.schemas.stats import StatsOverview, PerformanceStats, DetectionStats
import random
import time


class StatsService:
    async def get_overview(self) -> StatsOverview:
        """获取系统概览统计"""
        # 模拟数据
        return StatsOverview(
            totalToday=12847 + random.randint(0, 100),
            fakeCount=1234 + random.randint(0, 20),
            realCount=10613 + random.randint(0, 80),
            uncertainCount=1000 + random.randint(0, 10),
            accuracy=94.6,
            avgResponseTime=48 + random.randint(0, 5),
            activeUsers=2341 + random.randint(0, 50),
            qps=156 + random.randint(0, 20)
        )
    
    async def get_performance(self) -> PerformanceStats:
        """获取模型性能数据"""
        # 模拟数据
        return PerformanceStats(
            accuracy=94.6,
            recall=95.1,
            precision=93.2,
            f1=94.1,
            auc=96.8
        )
    
    async def get_detection_stats(self) -> DetectionStats:
        """获取检测统计数据"""
        # 生成每日统计数据
        daily_stats = []
        days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        for day in days:
            daily_stats.append({
                "day": day,
                "fake": random.randint(100, 250),
                "real": random.randint(400, 600),
                "uncertain": random.randint(50, 130)
            })
        
        # 生成小时统计数据
        hourly_stats = []
        for hour in range(24):
            hourly_stats.append({
                "hour": f"{hour}:00",
                "count": random.randint(200, 400),
                "fake": random.randint(20, 60)
            })
        
        # 生成类别统计数据
        category_stats = [
            {"name": "政治新闻", "value": 32, "count": 4120, "color": "#a855f7"},
            {"name": "健康医疗", "value": 28, "count": 3605, "color": "#06b6d4"},
            {"name": "科技财经", "value": 18, "count": 2318, "color": "#22c55e"},
            {"name": "社会民生", "value": 14, "count": 1803, "color": "#f59e0b"},
            {"name": "娱乐八卦", "value": 8, "count": 1030, "color": "#ec4899"}
        ]
        
        # 生成平台统计数据
        platform_stats = [
            {"name": "微博", "value": 45, "color": "#ef4444"},
            {"name": "微信", "value": 30, "color": "#22c55e"},
            {"name": "抖音", "value": 15, "color": "#000000"},
            {"name": "其他", "value": 10, "color": "#666666"}
        ]
        
        return DetectionStats(
            dailyStats=daily_stats,
            hourlyStats=hourly_stats,
            categoryStats=category_stats,
            platformStats=platform_stats
        )
