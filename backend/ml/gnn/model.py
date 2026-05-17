import torch
import torch.nn as nn
from torch_geometric.nn import GCNConv, GATConv, global_mean_pool
from app.schemas.detect import DetectResponse, Feature, GraphFeature
import random
import time


class GNNModel:
    def __init__(self):
        # 初始化模型
        self.model = GraphNeuralNetwork()
        # 加载预训练模型（这里使用模拟数据）
        self.load_model()
    
    def load_model(self):
        """加载预训练模型"""
        # 这里应该加载实际的预训练模型
        # 由于是演示，我们使用随机初始化的模型
        pass
    
    def predict(self, content: str) -> DetectResponse:
        """预测新闻真实性"""
        # 模拟模型预测
        # 在实际应用中，这里应该：
        # 1. 提取文本特征
        # 2. 构建传播图谱
        # 3. 使用GNN模型进行预测
        # 4. 生成检测结果
        
        # 模拟特征提取
        has_sensational_words = any(word in content for word in ["紧急", "震惊", "扩散", "转发", "治愈", "百病", "秘密", "立即", "绝对", "一定", "必须", "不转不是"])
        has_credible_source = any(word in content for word in ["央行", "研究院", "科学院", "研究所", "大学", "发布公告", "研究表明", "发表在", "期刊"])
        has_exaggeration = any(word in content for word in ["100%", "所有", "一切", "永远", "绝对", "必定", "肯定"])
        has_emotional_appeal = any(word in content for word in ["震惊", "不敢相信", "太可怕", "救人", "浮屠", "免费", "价值.*元"])
        content_length = len(content)
        has_logical_structure = "。" in content and len(content.split("。")) > 2
        
        # 计算分数
        score = 50
        if has_sensational_words: score -= 25
        if has_exaggeration: score -= 15
        if has_emotional_appeal: score -= 20
        if has_credible_source: score += 20
        if content_length > 150: score += 10
        if has_logical_structure: score += 10
        
        # 添加随机性
        score = max(5, min(95, score + (random.random() * 10 - 5)))
        
        # 生成特征
        features = [
            Feature(
                name="内容可信度",
                value=0.78 + random.random() * 0.15 if has_credible_source else 0.22 + random.random() * 0.2,
                weight=0.25,
                description="包含可追溯的权威来源引用" if has_credible_source else "缺乏可验证的信息来源",
                indicator="positive" if has_credible_source else "negative"
            ),
            Feature(
                name="情感倾向分析",
                value=0.18 + random.random() * 0.15 if has_sensational_words or has_emotional_appeal else 0.75 + random.random() * 0.15,
                weight=0.2,
                description="存在煽动性、夸张性用语" if has_sensational_words else "语言表达客观中立",
                indicator="negative" if has_sensational_words else "positive"
            ),
            Feature(
                name="逻辑一致性",
                value=0.72 + random.random() * 0.2 if has_logical_structure and not has_exaggeration else 0.35 + random.random() * 0.2,
                weight=0.2,
                description="内容结构清晰，逻辑通顺" if has_logical_structure else "存在逻辑跳跃或自相矛盾",
                indicator="positive" if has_logical_structure else "neutral"
            ),
            Feature(
                name="来源信誉评估",
                value=0.82 + random.random() * 0.1 if has_credible_source else 0.28 + random.random() * 0.15,
                weight=0.2,
                description="来源机构具有较高公信力" if has_credible_source else "来源模糊或无法验证",
                indicator="positive" if has_credible_source else "negative"
            ),
            Feature(
                name="传播特征分析",
                value=0.65 + random.random() * 0.2 if score > 50 else 0.3 + random.random() * 0.2,
                weight=0.15,
                description="传播模式符合自然扩散规律" if score > 50 else "传播模式存在异常特征",
                indicator="positive" if score > 50 else "negative"
            )
        ]
        
        # 生成图谱特征
        graph_features = GraphFeature(
            propagationPattern="自然扩散模式" if score > 50 else "异常病毒式传播",
            propagationScore=75 + random.random() * 20 if score > 50 else 20 + random.random() * 30,
            sourceCredibility=80 + random.random() * 15 if has_credible_source else 20 + random.random() * 25,
            userEngagement="正常用户主导" if score > 50 else "可疑账号参与度高",
            engagementScore=70 + random.random() * 25 if score > 50 else 25 + random.random() * 30,
            botProbability=5 + random.random() * 15 if score > 50 else 45 + random.random() * 40
        )
        
        # 生成关键词
        keywords = []
        keyword_patterns = [
            "研究", "科学", "实验", "发现", "证实",
            "政策", "公告", "发布", "宣布",
            "紧急", "震惊", "扩散", "转发"
        ]
        for pattern in keyword_patterns:
            if pattern in content:
                keywords.append(pattern)
        keywords = list(set(keywords))[:5]
        
        # 生成风险因素
        risk_factors = []
        if has_sensational_words: risk_factors.append("包含煽动性词汇")
        if has_exaggeration: risk_factors.append("存在绝对化表述")
        if has_emotional_appeal: risk_factors.append("情感操控倾向")
        if not has_credible_source: risk_factors.append("缺乏权威来源")
        if content_length < 100: risk_factors.append("内容过于简短")
        
        # 生成检测结果
        label = "real" if score > 65 else "fake" if score < 40 else "uncertain"
        confidence = abs(score - 50) * 2
        
        return DetectResponse(
            score=score,
            label=label,
            confidence=confidence,
            features=features,
            graphFeatures=graph_features,
            keywords=keywords,
            riskFactors=risk_factors,
            timestamp=int(random.randint(1609459200, int(time.time())) * 1000)
        )


class GraphNeuralNetwork(nn.Module):
    """图神经网络模型"""
    def __init__(self):
        super(GraphNeuralNetwork, self).__init__()
        # 定义图卷积层
        self.conv1 = GCNConv(128, 64)
        self.conv2 = GCNConv(64, 32)
        
        # 定义全连接层
        self.fc1 = nn.Linear(32, 16)
        self.fc2 = nn.Linear(16, 3)  # 3个类别：真实、虚假、不确定
        
        # 定义激活函数
        self.relu = nn.ReLU()
        self.softmax = nn.Softmax(dim=1)
    
    def forward(self, x, edge_index, batch):
        """前向传播"""
        # 图卷积层
        x = self.relu(self.conv1(x, edge_index))
        x = self.relu(self.conv2(x, edge_index))
        
        # 全局池化
        x = global_mean_pool(x, batch)
        
        # 全连接层
        x = self.relu(self.fc1(x))
        x = self.softmax(self.fc2(x))
        
        return x
