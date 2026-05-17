"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Database, 
  Network, 
  Brain, 
  Layers, 
  GitBranch, 
  Cpu,
  ArrowRight,
  Zap,
  Server,
  Code2,
  FileCode,
  Workflow,
  CircleDot,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  ArrowDown,
  Sparkles,
  Target,
  LineChart,
  Settings2,
  Binary,
  Boxes
} from "lucide-react"

const architectureLayers = [
  {
    icon: Database,
    title: "数据采集层",
    description: "多源异构数据采集与预处理",
    features: [
      { name: "实时爬虫系统", desc: "支持多平台并发采集", metric: "50K+/天" },
      { name: "API 数据接入", desc: "对接主流社交媒体 API", metric: "15+ 平台" },
      { name: "用户行为追踪", desc: "记录传播路径与时序", metric: "毫秒级" },
      { name: "数据清洗管道", desc: "去重、标准化、格式转换", metric: "99.2% 纯净度" },
    ],
    tech: ["Scrapy", "Kafka", "Redis", "PostgreSQL", "Elasticsearch"],
    color: "#f59e0b",
    stats: { processed: "2.8M", daily: "50K", latency: "< 100ms" }
  },
  {
    icon: Network,
    title: "图构建层",
    description: "基于传播路径构建异构信息网络",
    features: [
      { name: "用户-新闻二部图", desc: "用户与新闻的交互关系", metric: "1.2M 边" },
      { name: "传播级联图", desc: "信息传播的时序结构", metric: "动态更新" },
      { name: "来源关系图", desc: "信息源之间的引用关系", metric: "100K 节点" },
      { name: "语义相似图", desc: "基于内容的相似性连接", metric: "KNN-10" },
    ],
    tech: ["NetworkX", "DGL", "Neo4j", "GraphQL", "Apache Spark"],
    color: "#06b6d4",
    stats: { nodes: "500K", edges: "2.1M", types: "4" }
  },
  {
    icon: Layers,
    title: "特征提取层",
    description: "多模态特征提取与表示学习",
    features: [
      { name: "文本语义特征", desc: "BERT 编码器提取语义向量", metric: "768 维" },
      { name: "图结构特征", desc: "节点度、聚类系数等", metric: "32 维" },
      { name: "时序传播特征", desc: "传播速度、峰值时间", metric: "16 维" },
      { name: "用户画像特征", desc: "账号年龄、活跃度等", metric: "48 维" },
    ],
    tech: ["BERT", "Transformers", "NumPy", "Pandas", "scikit-learn"],
    color: "#a855f7",
    stats: { dimension: "864", embeddings: "768", features: "96" }
  },
  {
    icon: Brain,
    title: "推理层",
    description: "图神经网络模型进行分类预测",
    features: [
      { name: "图注意力网络", desc: "GAT 多头注意力机制", metric: "8 头" },
      { name: "消息传递机制", desc: "聚合邻居节点信息", metric: "3 层" },
      { name: "异构图学习", desc: "处理多类型节点和边", metric: "R-GCN" },
      { name: "节点分类任务", desc: "输出真假概率分布", metric: "Softmax" },
    ],
    tech: ["PyTorch", "PyG", "TensorRT", "ONNX", "CUDA"],
    color: "#22c55e",
    stats: { accuracy: "94.6%", latency: "48ms", params: "12.8M" }
  },
]

const gnnFeatures = [
  {
    icon: GitBranch,
    title: "传播模式学习",
    description: "GNN 能够学习新闻在社交网络中的传播模式。真实新闻往往呈现自然的扩散结构，而虚假新闻常常表现出异常的病毒式传播或集中式爆发特征。",
    details: [
      "分析传播树的深度和广度",
      "识别异常的传播加速模式",
      "检测协同转发行为",
    ],
    metrics: { pattern: "98%", speed: "2.3x", accuracy: "96.2%" }
  },
  {
    icon: Cpu,
    title: "用户关系建模",
    description: "通过图结构捕捉用户之间的交互关系，识别可疑的协同传播行为。模型能够发现机器人账号网络和有组织的虚假信息传播团体。",
    details: [
      "用户社交网络分析",
      "机器人账号检测",
      "水军团体识别",
    ],
    metrics: { botDetect: "94%", cluster: "89%", network: "92%" }
  },
  {
    icon: Zap,
    title: "跨域知识迁移",
    description: "利用图神经网络的归纳学习能力，将已知领域的检测知识迁移到新领域。即使面对新出现的话题，模型也能利用结构化知识进行有效判断。",
    details: [
      "领域自适应学习",
      "零样本检测能力",
      "持续学习更新",
    ],
    metrics: { transfer: "87%", zeroShot: "81%", adapt: "< 1h" }
  },
]

const modelArchitecture = {
  encoder: {
    name: "文本编码器",
    type: "BERT-base-chinese",
    params: "110M",
    output: "768 维语义向量",
    layers: 12,
    heads: 12,
    vocab: "21128",
  },
  gnn: {
    name: "图神经网络",
    type: "GAT + GraphSAGE",
    layers: 3,
    heads: 8,
    hidden: 256,
    dropout: 0.5,
    aggregator: "mean",
  },
  classifier: {
    name: "分类器",
    type: "MLP",
    layers: [256, 128, 64, 2],
    activation: "ReLU + Softmax",
    regularization: "L2 + Dropout",
  },
}

const trainingConfig = {
  optimizer: "AdamW",
  learningRate: "2e-5",
  batchSize: 32,
  epochs: 100,
  earlyStopping: 10,
  scheduler: "CosineAnnealing",
  warmup: "5%",
}

const codeExamples = {
  model: `# GNN 假新闻检测模型定义
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GATConv, SAGEConv
from torch_geometric.nn import global_mean_pool, global_max_pool

class FakeNewsGNN(nn.Module):
    """基于图注意力网络的假新闻检测模型"""
    
    def __init__(self, text_dim=768, hidden_dim=256, num_classes=2):
        super().__init__()
        
        # 文本特征投影
        self.text_proj = nn.Sequential(
            nn.Linear(text_dim, hidden_dim),
            nn.LayerNorm(hidden_dim),
            nn.ReLU(),
            nn.Dropout(0.3)
        )
        
        # 多层图注意力网络
        self.gat1 = GATConv(hidden_dim, hidden_dim, heads=8, dropout=0.5)
        self.gat2 = GATConv(hidden_dim * 8, hidden_dim, heads=4, dropout=0.5)
        self.gat3 = GATConv(hidden_dim * 4, hidden_dim, heads=1, dropout=0.5)
        
        # 层归一化
        self.norm1 = nn.LayerNorm(hidden_dim * 8)
        self.norm2 = nn.LayerNorm(hidden_dim * 4)
        self.norm3 = nn.LayerNorm(hidden_dim)
        
        # 图级别池化 + 分类器
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim * 2, 128),  # concat mean & max pooling
            nn.ReLU(),
            nn.Dropout(0.5),
            nn.Linear(128, 64),
            nn.ReLU(),
            nn.Linear(64, num_classes)
        )
    
    def forward(self, x, edge_index, batch):
        # 文本特征投影
        x = self.text_proj(x)
        
        # 图注意力层 + 残差连接
        h1 = F.elu(self.norm1(self.gat1(x, edge_index)))
        h2 = F.elu(self.norm2(self.gat2(h1, edge_index)))
        h3 = self.norm3(self.gat3(h2, edge_index))
        
        # 双池化策略
        x_mean = global_mean_pool(h3, batch)
        x_max = global_max_pool(h3, batch)
        x = torch.cat([x_mean, x_max], dim=-1)
        
        # 分类
        return self.classifier(x)`,
  training: `# 模型训练流程
from torch_geometric.loader import DataLoader
from transformers import get_cosine_schedule_with_warmup

def train_model(model, train_data, val_data, config):
    """训练假新闻检测模型"""
    
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    model = model.to(device)
    
    # 数据加载器
    train_loader = DataLoader(train_data, batch_size=config.batch_size, shuffle=True)
    val_loader = DataLoader(val_data, batch_size=config.batch_size)
    
    # 优化器和学习率调度
    optimizer = torch.optim.AdamW(model.parameters(), lr=config.lr, weight_decay=0.01)
    total_steps = len(train_loader) * config.epochs
    scheduler = get_cosine_schedule_with_warmup(
        optimizer, 
        num_warmup_steps=int(total_steps * 0.05),
        num_training_steps=total_steps
    )
    
    # 损失函数
    criterion = nn.CrossEntropyLoss(weight=torch.tensor([1.0, 2.0]).to(device))
    
    best_val_f1 = 0
    patience = 0
    
    for epoch in range(config.epochs):
        # 训练阶段
        model.train()
        train_loss = 0
        
        for batch in train_loader:
            batch = batch.to(device)
            optimizer.zero_grad()
            
            logits = model(batch.x, batch.edge_index, batch.batch)
            loss = criterion(logits, batch.y)
            
            loss.backward()
            torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
            optimizer.step()
            scheduler.step()
            
            train_loss += loss.item()
        
        # 验证阶段
        val_metrics = evaluate(model, val_loader, device)
        
        print(f"Epoch {epoch+1}: Loss={train_loss/len(train_loader):.4f}, "
              f"Val_Acc={val_metrics['accuracy']:.2%}, Val_F1={val_metrics['f1']:.4f}")
        
        # 早停机制
        if val_metrics['f1'] > best_val_f1:
            best_val_f1 = val_metrics['f1']
            torch.save(model.state_dict(), 'best_model.pt')
            patience = 0
        else:
            patience += 1
            if patience >= config.early_stopping:
                print("Early stopping!")
                break
    
    return model`,
  inference: `# 模型推理接口
import torch
from transformers import BertTokenizer, BertModel
from torch_geometric.data import Data

class FakeNewsDetector:
    """假新闻检测推理接口"""
    
    def __init__(self, model_path, device='cuda'):
        self.device = torch.device(device if torch.cuda.is_available() else 'cpu')
        
        # 加载文本编码器
        self.tokenizer = BertTokenizer.from_pretrained('bert-base-chinese')
        self.bert = BertModel.from_pretrained('bert-base-chinese').to(self.device)
        self.bert.eval()
        
        # 加载 GNN 模型
        self.model = FakeNewsGNN().to(self.device)
        self.model.load_state_dict(torch.load(model_path))
        self.model.eval()
        
        # 图构建器
        self.graph_builder = PropagationGraphBuilder()
    
    @torch.no_grad()
    def predict(self, news_text, propagation_data=None):
        """
        预测新闻真伪
        
        Args:
            news_text: 新闻文本内容
            propagation_data: 传播数据（可选）
        
        Returns:
            dict: 包含预测结果和置信度
        """
        # 文本特征提取
        inputs = self.tokenizer(news_text, return_tensors='pt', 
                               max_length=512, truncation=True, padding=True)
        inputs = {k: v.to(self.device) for k, v in inputs.items()}
        text_features = self.bert(**inputs).last_hidden_state[:, 0]  # [CLS] token
        
        # 构建传播图
        if propagation_data:
            graph = self.graph_builder.build(news_text, propagation_data)
        else:
            graph = self.graph_builder.build_minimal(news_text)
        
        graph = graph.to(self.device)
        graph.x = text_features.expand(graph.num_nodes, -1)
        
        # 模型推理
        logits = self.model(graph.x, graph.edge_index, graph.batch)
        probs = torch.softmax(logits, dim=-1)
        
        pred_label = probs.argmax(dim=-1).item()
        confidence = probs.max().item()
        
        return {
            'label': 'fake' if pred_label == 1 else 'real',
            'confidence': confidence,
            'probabilities': {
                'real': probs[0, 0].item(),
                'fake': probs[0, 1].item()
            },
            'features': {
                'text_embedding_norm': text_features.norm().item(),
                'graph_nodes': graph.num_nodes,
                'graph_edges': graph.num_edges
            }
        }

# 使用示例
detector = FakeNewsDetector('models/best_model.pt')
result = detector.predict("某地发现罕见病例，专家建议立即转发...")
print(f"检测结果: {result['label']}, 置信度: {result['confidence']:.2%}")`
}

// GNN 消息传递动画组件
function GNNAnimation() {
  const [step, setStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const steps = [
    { name: "初始化", desc: "节点初始特征" },
    { name: "第1层聚合", desc: "收集1-hop邻居" },
    { name: "第2层聚合", desc: "收集2-hop邻居" },
    { name: "第3层聚合", desc: "全局信息融合" },
    { name: "池化输出", desc: "图级别表示" },
  ]
  
  useEffect(() => {
    if (!isPlaying) return
    
    const interval = setInterval(() => {
      setStep(s => (s + 1) % steps.length)
    }, 2000)
    
    return () => clearInterval(interval)
  }, [isPlaying, steps.length])
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = canvas.width
    const height = canvas.height
    
    // 清空画布
    ctx.clearRect(0, 0, width, height)
    
    // 节点位置
    const nodes = [
      { x: width/2, y: height/2, type: 'center', label: '新闻' },
      { x: width/2 - 80, y: height/2 - 60, type: 'user', label: 'U1' },
      { x: width/2 + 80, y: height/2 - 60, type: 'user', label: 'U2' },
      { x: width/2 - 100, y: height/2 + 40, type: 'user', label: 'U3' },
      { x: width/2 + 100, y: height/2 + 40, type: 'user', label: 'U4' },
      { x: width/2, y: height/2 + 80, type: 'source', label: '来源' },
      { x: width/2 - 140, y: height/2 - 20, type: 'outer', label: 'U5' },
      { x: width/2 + 140, y: height/2 - 20, type: 'outer', label: 'U6' },
    ]
    
    const edges = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 6], [2, 7], [1, 3], [2, 4]
    ]
    
    // 绘制边
    edges.forEach(([from, to]) => {
      const fromNode = nodes[from]
      const toNode = nodes[to]
      
      ctx.beginPath()
      ctx.moveTo(fromNode.x, fromNode.y)
      ctx.lineTo(toNode.x, toNode.y)
      
      // 根据步骤设置边的样式
      if (step === 0) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)'
      } else if (step >= 1 && (from === 0 || to === 0)) {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.8)'
      } else if (step >= 2) {
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'
      } else {
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.2)'
      }
      
      ctx.lineWidth = 2
      ctx.stroke()
    })
    
    // 消息传递动画
    if (step >= 1 && step <= 3) {
      const progress = (Date.now() % 2000) / 2000
      const activeEdges = step === 1 
        ? edges.filter(([from, to]) => from === 0 || to === 0)
        : step === 2 
          ? edges.filter(([from, to]) => from !== 0 && to !== 0)
          : edges
      
      activeEdges.forEach(([from, to]) => {
        const fromNode = nodes[from]
        const toNode = nodes[to]
        
        const x = fromNode.x + (toNode.x - fromNode.x) * progress
        const y = fromNode.y + (toNode.y - fromNode.y) * progress
        
        ctx.beginPath()
        ctx.arc(x, y, 4, 0, Math.PI * 2)
        ctx.fillStyle = step === 1 ? '#a855f7' : step === 2 ? '#06b6d4' : '#22c55e'
        ctx.fill()
      })
    }
    
    // 绘制节点
    nodes.forEach((node, i) => {
      const radius = node.type === 'center' ? 24 : node.type === 'outer' ? 14 : 18
      
      // 节点光晕
      if (step >= 1 && (i === 0 || (step >= 2 && node.type === 'user'))) {
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius + 8, 0, Math.PI * 2)
        ctx.fillStyle = node.type === 'center' 
          ? 'rgba(168, 85, 247, 0.2)' 
          : 'rgba(6, 182, 212, 0.2)'
        ctx.fill()
      }
      
      // 节点本体
      ctx.beginPath()
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
      
      if (node.type === 'center') {
        ctx.fillStyle = '#a855f7'
      } else if (node.type === 'source') {
        ctx.fillStyle = '#f59e0b'
      } else if (node.type === 'outer') {
        ctx.fillStyle = '#64748b'
      } else {
        ctx.fillStyle = '#06b6d4'
      }
      ctx.fill()
      
      // 节点标签
      ctx.fillStyle = '#fff'
      ctx.font = node.type === 'center' ? 'bold 10px sans-serif' : '9px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(node.label, node.x, node.y)
    })
    
    // 池化效果
    if (step === 4) {
      ctx.beginPath()
      ctx.arc(width/2, height/2, 60, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)'
      ctx.lineWidth = 3
      ctx.setLineDash([5, 5])
      ctx.stroke()
      ctx.setLineDash([])
    }
    
  }, [step])
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 p-0"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setStep(0)}
            className="h-8 w-8 p-0"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          步骤 {step + 1}/5: <span className="text-foreground">{steps[step].name}</span>
        </div>
      </div>
      
      <div className="relative bg-secondary/30 rounded-lg overflow-hidden">
        <canvas 
          ref={canvasRef}
          width={360}
          height={240}
          className="w-full"
        />
      </div>
      
      {/* 步骤指示器 */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={i} className="flex-1">
            <div 
              className={`h-1.5 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-secondary'
              }`}
            />
            <p className={`text-[10px] mt-1 text-center ${
              i === step ? 'text-foreground' : 'text-muted-foreground'
            }`}>
              {s.name}
            </p>
          </div>
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        {steps[step].desc}
      </p>
    </div>
  )
}

// 模型训练进度组件
function TrainingProgress() {
  const [epoch, setEpoch] = useState(0)
  const [isTraining, setIsTraining] = useState(false)
  const [metrics, setMetrics] = useState({
    loss: 0.8,
    accuracy: 0.65,
    valLoss: 0.85,
    valAccuracy: 0.62
  })
  
  useEffect(() => {
    if (!isTraining) return
    
    const interval = setInterval(() => {
      setEpoch(e => {
        if (e >= 100) {
          setIsTraining(false)
          return 100
        }
        return e + 1
      })
      
      setMetrics(m => ({
        loss: Math.max(0.1, m.loss - 0.007 + Math.random() * 0.002),
        accuracy: Math.min(0.98, m.accuracy + 0.003 + Math.random() * 0.001),
        valLoss: Math.max(0.15, m.valLoss - 0.006 + Math.random() * 0.003),
        valAccuracy: Math.min(0.96, m.valAccuracy + 0.0028 + Math.random() * 0.001)
      }))
    }, 100)
    
    return () => clearInterval(interval)
  }, [isTraining])
  
  const startTraining = () => {
    setEpoch(0)
    setMetrics({ loss: 0.8, accuracy: 0.65, valLoss: 0.85, valAccuracy: 0.62 })
    setIsTraining(true)
  }
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base text-foreground flex items-center gap-2">
            <LineChart className="w-4 h-4 text-primary" />
            训练模拟
          </CardTitle>
          <Button 
            size="sm" 
            onClick={startTraining}
            disabled={isTraining}
            className="h-7"
          >
            {isTraining ? (
              <>
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse mr-2" />
                训练中...
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                开始训练
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 进度条 */}
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Epoch {epoch}/100</span>
            <span>{epoch}%</span>
          </div>
          <Progress value={epoch} className="h-2" />
        </div>
        
        {/* 指标 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">训练损失</p>
            <p className="text-lg font-mono text-foreground">{metrics.loss.toFixed(4)}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">训练准确率</p>
            <p className="text-lg font-mono text-accent">{(metrics.accuracy * 100).toFixed(2)}%</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">验证损失</p>
            <p className="text-lg font-mono text-foreground">{metrics.valLoss.toFixed(4)}</p>
          </div>
          <div className="p-3 rounded-lg bg-secondary/50">
            <p className="text-xs text-muted-foreground mb-1">验证准确率</p>
            <p className="text-lg font-mono text-primary">{(metrics.valAccuracy * 100).toFixed(2)}%</p>
          </div>
        </div>
        
        {/* 训练配置 */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
            <Settings2 className="w-3 h-3" />
            训练配置
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">优化器</span>
              <span className="text-foreground font-mono">{trainingConfig.optimizer}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">学习率</span>
              <span className="text-foreground font-mono">{trainingConfig.learningRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">批大小</span>
              <span className="text-foreground font-mono">{trainingConfig.batchSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">调度器</span>
              <span className="text-foreground font-mono">{trainingConfig.scheduler}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ArchitectureSection() {
  const [selectedLayer, setSelectedLayer] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState("architecture")
  const [selectedCodeTab, setSelectedCodeTab] = useState<"model" | "training" | "inference">("model")

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary border border-border mb-6">
          <TabsTrigger value="architecture" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            系统架构
          </TabsTrigger>
          <TabsTrigger value="model" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            模型详情
          </TabsTrigger>
          <TabsTrigger value="training" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            训练流程
          </TabsTrigger>
          <TabsTrigger value="code" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            代码示例
          </TabsTrigger>
        </TabsList>

        <TabsContent value="architecture" className="space-y-8">
          {/* 数据流水线 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-primary" />
              端到端数据流水线
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              从原始数据采集到最终预测输出的完整处理流程
            </p>
            
            {/* 流水线可视化 */}
            <div className="relative mb-8">
              <div className="flex items-center justify-between overflow-x-auto pb-4">
                {architectureLayers.map((layer, i) => (
                  <div key={i} className="flex items-center">
                    <div 
                      className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all cursor-pointer min-w-[140px] ${
                        selectedLayer === i 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 bg-card/50'
                      }`}
                      onClick={() => setSelectedLayer(selectedLayer === i ? null : i)}
                    >
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-3"
                        style={{ backgroundColor: `${layer.color}20` }}
                      >
                        <layer.icon className="w-7 h-7" style={{ color: layer.color }} />
                      </div>
                      <span className="text-sm font-medium text-foreground text-center">{layer.title}</span>
                      <span className="text-xs text-muted-foreground mt-1">Layer {i + 1}</span>
                    </div>
                    {i < architectureLayers.length - 1 && (
                      <div className="flex items-center px-2">
                        <ArrowRight className="w-6 h-6 text-primary/50" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* 选中层详情 */}
            {selectedLayer !== null && (
              <Card className="bg-card/50 backdrop-blur border-border animate-in slide-in-from-top-2">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 功能列表 */}
                    <div className="lg:col-span-2 space-y-4">
                      <h4 className="font-semibold text-foreground flex items-center gap-2">
                        <CircleDot className="w-4 h-4" style={{ color: architectureLayers[selectedLayer].color }} />
                        {architectureLayers[selectedLayer].title} - 核心功能
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {architectureLayers[selectedLayer].features.map((feature, j) => (
                          <div key={j} className="p-3 rounded-lg bg-secondary/50 border border-border">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-medium text-foreground">{feature.name}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{feature.desc}</p>
                              </div>
                              <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                                {feature.metric}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* 统计和技术栈 */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border border-border" style={{ borderColor: `${architectureLayers[selectedLayer].color}40` }}>
                        <h5 className="text-sm font-medium text-foreground mb-3">关键指标</h5>
                        <div className="space-y-2">
                          {Object.entries(architectureLayers[selectedLayer].stats).map(([key, value], i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-muted-foreground capitalize">{key}</span>
                              <span className="text-foreground font-mono">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">技术栈</p>
                        <div className="flex flex-wrap gap-1.5">
                          {architectureLayers[selectedLayer].tech.map((t, j) => (
                            <Badge key={j} variant="outline" className="text-xs">
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* GNN 核心优势 */}
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              图神经网络核心优势
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gnnFeatures.map((feature, i) => (
                <Card key={i} className="bg-card/50 backdrop-blur border-border group hover:border-primary/50 transition-all">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
                    
                    <ul className="space-y-1.5 mb-4">
                      {feature.details.map((detail, j) => (
                        <li key={j} className="text-xs text-muted-foreground flex items-center gap-2">
                          <ChevronRight className="w-3 h-3 text-primary" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    
                    <div className="pt-3 border-t border-border">
                      <div className="grid grid-cols-3 gap-2">
                        {Object.entries(feature.metrics).map(([key, value], j) => (
                          <div key={j} className="text-center">
                            <p className="text-sm font-semibold text-primary">{value}</p>
                            <p className="text-[10px] text-muted-foreground capitalize">{key}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* GNN 工作原理 */}
          <Card className="bg-card/50 backdrop-blur border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 lg:p-8 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Network className="w-5 h-5 text-primary" />
                    消息传递机制
                  </h3>
                  <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                    <div className="p-3 rounded-lg bg-secondary/50 border-l-2 border-primary">
                      <span className="text-foreground font-medium">1. 邻居聚合 (Aggregate)</span>
                      <p className="mt-1">每个节点收集其邻居节点的特征信息，使用注意力机制动态计算邻居重要性权重。</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border-l-2 border-accent">
                      <span className="text-foreground font-medium">2. 特征更新 (Update)</span>
                      <p className="mt-1">将聚合的邻居信息与节点自身特征结合，通过神经网络层更新节点表示。</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border-l-2 border-chart-4">
                      <span className="text-foreground font-medium">3. 多层堆叠 (Stack)</span>
                      <p className="mt-1">重复聚合-更新过程多层，使节点能够捕获更大感受野范围内的图结构信息。</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 border-l-2 border-chart-3">
                      <span className="text-foreground font-medium">4. 图级读出 (Readout)</span>
                      <p className="mt-1">通过池化操作将所有节点嵌入聚合为图级别表示，用于下游分类任务。</p>
                    </div>
                  </div>
                </div>
                <div className="bg-secondary/30 p-6 lg:p-8 flex items-center justify-center">
                  <GNNAnimation />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="model" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 模型架构图 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-primary" />
                  模型架构
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 输入层 */}
                  <div className="p-4 rounded-lg bg-chart-4/10 border border-chart-4/30">
                    <div className="flex items-center gap-3 mb-3">
                      <FileCode className="w-5 h-5 text-chart-4" />
                      <div>
                        <h4 className="font-semibold text-foreground">{modelArchitecture.encoder.name}</h4>
                        <p className="text-xs text-muted-foreground">{modelArchitecture.encoder.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">层数</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.encoder.layers}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">注意力头</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.encoder.heads}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">词表大小</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.encoder.vocab}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  {/* GNN 层 */}
                  <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Network className="w-5 h-5 text-primary" />
                      <div>
                        <h4 className="font-semibold text-foreground">{modelArchitecture.gnn.name}</h4>
                        <p className="text-xs text-muted-foreground">{modelArchitecture.gnn.type}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">层数</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.gnn.layers}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">注意力头</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.gnn.heads}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">隐藏维度</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.gnn.hidden}</p>
                      </div>
                      <div className="p-2 rounded bg-secondary/50">
                        <p className="text-xs text-muted-foreground">Dropout</p>
                        <p className="text-sm font-mono text-foreground">{modelArchitecture.gnn.dropout}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                  
                  {/* 分类器 */}
                  <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-3 mb-3">
                      <Target className="w-5 h-5 text-accent" />
                      <div>
                        <h4 className="font-semibold text-foreground">{modelArchitecture.classifier.name}</h4>
                        <p className="text-xs text-muted-foreground">{modelArchitecture.classifier.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      {modelArchitecture.classifier.layers.map((dim, i) => (
                        <div key={i} className="flex items-center">
                          <div className="px-3 py-1.5 rounded bg-secondary/50 text-sm font-mono text-foreground">
                            {dim}
                          </div>
                          {i < modelArchitecture.classifier.layers.length - 1 && (
                            <ArrowRight className="w-4 h-4 text-muted-foreground mx-1" />
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      {modelArchitecture.classifier.activation}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* 训练模拟 */}
            <TrainingProgress />
          </div>
          
          {/* 模型性能指标 */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-foreground text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                模型性能评估
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "准确率", value: "94.6%", desc: "Accuracy", color: "#a855f7" },
                  { name: "精确率", value: "93.2%", desc: "Precision", color: "#06b6d4" },
                  { name: "召回率", value: "95.1%", desc: "Recall", color: "#22c55e" },
                  { name: "F1 分数", value: "94.1%", desc: "F1-Score", color: "#f59e0b" },
                ].map((metric, i) => (
                  <div key={i} className="p-4 rounded-lg bg-secondary/50 text-center">
                    <p className="text-xs text-muted-foreground mb-1">{metric.desc}</p>
                    <p className="text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                    <p className="text-sm text-foreground mt-1">{metric.name}</p>
                  </div>
                ))}
              </div>
              
              {/* 混淆矩阵 */}
              <div className="mt-6 p-4 rounded-lg bg-secondary/30">
                <h4 className="text-sm font-medium text-foreground mb-4 flex items-center gap-2">
                  <Binary className="w-4 h-4 text-primary" />
                  混淆矩阵
                </h4>
                <div className="flex items-center justify-center">
                  <div className="inline-grid grid-cols-3 gap-1 text-center">
                    <div />
                    <div className="text-xs text-muted-foreground pb-2">预测: 真实</div>
                    <div className="text-xs text-muted-foreground pb-2">预测: 虚假</div>
                    
                    <div className="text-xs text-muted-foreground pr-2 flex items-center justify-end">实际: 真实</div>
                    <div className="w-20 h-14 rounded bg-accent/20 flex items-center justify-center">
                      <div>
                        <p className="text-lg font-bold text-accent">4,521</p>
                        <p className="text-[10px] text-muted-foreground">TP</p>
                      </div>
                    </div>
                    <div className="w-20 h-14 rounded bg-destructive/10 flex items-center justify-center">
                      <div>
                        <p className="text-lg font-bold text-destructive/70">234</p>
                        <p className="text-[10px] text-muted-foreground">FN</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground pr-2 flex items-center justify-end">实际: 虚假</div>
                    <div className="w-20 h-14 rounded bg-destructive/10 flex items-center justify-center">
                      <div>
                        <p className="text-lg font-bold text-destructive/70">189</p>
                        <p className="text-[10px] text-muted-foreground">FP</p>
                      </div>
                    </div>
                    <div className="w-20 h-14 rounded bg-accent/20 flex items-center justify-center">
                      <div>
                        <p className="text-lg font-bold text-accent">1,856</p>
                        <p className="text-[10px] text-muted-foreground">TN</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Workflow className="w-5 h-5 text-primary" />
            训练流程
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { icon: Database, title: "数据准备", desc: "加载并预处理训练数据", status: "done" },
              { icon: Network, title: "图构建", desc: "构建传播图结构", status: "done" },
              { icon: Layers, title: "特征提取", desc: "BERT编码文本特征", status: "done" },
              { icon: Brain, title: "模型训练", desc: "GNN迭代优化", status: "active" },
              { icon: Target, title: "模型评估", desc: "验证集性能测试", status: "pending" },
            ].map((step, i) => (
              <Card key={i} className={`bg-card/50 backdrop-blur border-border ${
                step.status === 'active' ? 'ring-2 ring-primary' : ''
              }`}>
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                    step.status === 'done' ? 'bg-accent/20' :
                    step.status === 'active' ? 'bg-primary/20 animate-pulse' :
                    'bg-secondary'
                  }`}>
                    {step.status === 'done' ? (
                      <Check className="w-6 h-6 text-accent" />
                    ) : (
                      <step.icon className={`w-6 h-6 ${
                        step.status === 'active' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    )}
                  </div>
                  <h4 className="font-medium text-foreground text-sm">{step.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{step.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* 训练配置详情 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-foreground">超参数配置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(trainingConfig).map(([key, value], i) => (
                    <div key={i} className="flex justify-between p-3 rounded-lg bg-secondary/50">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="text-sm font-mono text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-foreground">数据集统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "训练集", count: "45,000", ratio: "70%" },
                    { name: "验证集", count: "9,000", ratio: "14%" },
                    { name: "测试集", count: "10,000", ratio: "16%" },
                  ].map((set, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{set.name}</span>
                        <span className="text-foreground">{set.count} ({set.ratio})</span>
                      </div>
                      <Progress value={parseInt(set.ratio)} className="h-2" />
                    </div>
                  ))}
                  <div className="pt-3 border-t border-border grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">真实新闻</span>
                      <span className="text-accent">38,400 (60%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">虚假新闻</span>
                      <span className="text-destructive">25,600 (40%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="code" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <Code2 className="w-5 h-5 text-primary" />
              代码实现
            </h3>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["model", "training", "inference"] as const).map((tab) => (
                <Button
                  key={tab}
                  variant={selectedCodeTab === tab ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedCodeTab(tab)}
                  className={`rounded-none ${selectedCodeTab === tab ? "bg-primary" : ""}`}
                >
                  {tab === "model" ? "模型定义" : tab === "training" ? "训练代码" : "推理接口"}
                </Button>
              ))}
            </div>
          </div>
          
          <Card className="bg-card/80 backdrop-blur border-border overflow-hidden">
            <CardContent className="p-0">
              <div className="flex items-center justify-between px-4 py-2 bg-secondary/50 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-destructive/60" />
                    <span className="w-3 h-3 rounded-full bg-chart-4/60" />
                    <span className="w-3 h-3 rounded-full bg-accent/60" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">
                    {selectedCodeTab === "model" ? "fake_news_gnn.py" : 
                     selectedCodeTab === "training" ? "train.py" : "inference.py"}
                  </span>
                </div>
                <Badge variant="secondary" className="text-xs">Python</Badge>
              </div>
              <div className="overflow-x-auto">
                <pre className="p-4 text-sm leading-relaxed">
                  <code className="text-muted-foreground">
                    {codeExamples[selectedCodeTab].split('\n').map((line, i) => (
                      <div key={i} className="flex">
                        <span className="w-8 shrink-0 text-muted-foreground/50 select-none text-right pr-4">
                          {i + 1}
                        </span>
                        <span className={
                          line.startsWith('#') || line.includes('"""') ? 'text-muted-foreground' :
                          line.includes('def ') || line.includes('class ') ? 'text-primary' :
                          line.includes('import ') || line.includes('from ') ? 'text-accent' :
                          line.includes('self.') ? 'text-chart-4' :
                          line.includes('return ') ? 'text-chart-3' :
                          'text-foreground'
                        }>
                          {line || ' '}
                        </span>
                      </div>
                    ))}
                  </code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
