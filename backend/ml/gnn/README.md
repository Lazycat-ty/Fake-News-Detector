# 图神经网络模型训练指南

本指南提供了图神经网络模型的训练流程和配置说明。

## 目录结构

```
ml/gnn/
├── model.py          # 模型定义
├── train.py          # 训练脚本
├── preprocess.py     # 数据预处理脚本
└── README.md         # 训练指南
```

## 环境要求

- Python 3.10+
- PyTorch 2.1.0+
- PyTorch Geometric 2.4.0+
- NumPy
- Pandas
- scikit-learn
- NetworkX

## 数据准备

### 数据集格式

训练模型需要以下三个CSV文件：

1. **news.csv**：新闻数据
   ```csv
   id,content,keywords,sentiment_score,label
   1,这是一条新闻内容,关键词1,关键词2,0.5,fake
   2,这是另一条新闻内容,关键词3,0.8,real
   ```

2. **users.csv**：用户数据
   ```csv
   id,followers,following,activity
   1,1000,500,0.8
   2,500,200,0.5
   ```

3. **edges.csv**：边数据（传播关系）
   ```csv
   source_type,source_id,target_type,target_id
   news,1,user,1
   user,1,user,2
   user,2,news,2
   ```

### 数据预处理

使用`preprocess.py`脚本进行数据预处理：

```bash
# Linux/Mac
python preprocess.py

# Windows
python preprocess.py
```

预处理步骤：
1. 加载CSV数据文件
2. 提取新闻和用户特征
3. 标准化特征数据
4. 构建图结构
5. 生成训练、验证和测试掩码
6. 保存处理后的数据

## 模型训练

使用`train.py`脚本训练模型：

```bash
# Linux/Mac
python train.py

# Windows
python train.py
```

训练参数：
- `dataset_name`：数据集名称（默认：'Cora'，用于测试）
- `hidden_channels`：隐藏层通道数（默认：64）
- `lr`：学习率（默认：0.01）
- `weight_decay`：权重衰减（默认：5e-4）
- `epochs`：训练轮数（默认：100）

训练流程：
1. 加载数据集
2. 初始化模型
3. 训练模型（使用Adam优化器和交叉熵损失函数）
4. 测试模型性能
5. 保存训练好的模型

## 模型评估

训练完成后，模型会自动进行测试并输出准确率。你也可以使用以下代码手动评估模型：

```python
from train import ModelTrainer

trainer = ModelTrainer()
trainer.initialize_model()
trainer.load_model('./models/gnn_model.pt')
accuracy = trainer.test()
print(f"模型准确率: {accuracy:.4f}")
```

## 自定义配置

### 数据集配置

如果你想使用自己的数据集，需要：
1. 按照上述格式准备CSV文件
2. 修改`preprocess.py`中的文件路径
3. 运行预处理脚本生成图数据
4. 修改`train.py`中的数据集加载逻辑，使用自定义数据

### 模型配置

你可以修改`model.py`中的模型结构：
- 调整图卷积层的数量和通道数
- 尝试不同的图神经网络层（如GAT、GraphSAGE等）
- 添加正则化或 dropout 层

### 训练配置

你可以修改`train.py`中的训练参数：
- 调整学习率和权重衰减
- 增加训练轮数
- 使用不同的优化器（如SGD、RMSprop等）

## 模型部署

训练完成后，模型会保存在`./models/gnn_model.pt`。你可以将此模型文件复制到后端服务的模型路径中，替换默认的演示模型。

```bash
# 复制模型到后端服务
cp ./models/gnn_model.pt ../../app/models/
```

然后重启后端服务，系统将使用训练好的模型进行假新闻检测。

## 注意事项

1. **数据质量**：模型性能很大程度上取决于数据质量，确保你的数据集包含足够的真实和假新闻样本。

2. **特征工程**：你可以根据实际情况添加更多特征，如：
   - 新闻发布时间
   - 来源可信度
   - 用户历史行为
   - 传播速度和模式

3. **模型选择**：对于不同规模的数据集，可能需要选择不同的图神经网络架构。

4. **超参数调优**：建议使用网格搜索或随机搜索来找到最佳超参数组合。

5. **计算资源**：训练大型图神经网络可能需要GPU加速，特别是当数据集较大时。

## 示例：使用自定义数据集训练

1. 准备数据集文件：`news.csv`、`users.csv`、`edges.csv`
2. 运行数据预处理：`python preprocess.py`
3. 修改`train.py`，使用自定义数据：
   ```python
   # 在train.py中添加
   from preprocess import DataPreprocessor
   
   # 加载自定义数据
   preprocessor = DataPreprocessor()
   data = preprocessor.load_data_from_file('./data/graph_data.pt')
   ```
4. 运行训练：`python train.py`
5. 部署模型：`cp ./models/gnn_model.pt ../../app/models/`

## 故障排除

1. **数据加载错误**：确保CSV文件格式正确，并且文件路径存在。

2. **内存不足**：对于大型数据集，可能需要减少批处理大小或使用更高效的存储格式。

3. **训练速度慢**：考虑使用GPU加速，或者减少模型复杂度。

4. **模型性能差**：检查数据集质量，调整模型结构和超参数，或者尝试数据增强。

## 参考资源

- [PyTorch Geometric 文档](https://pytorch-geometric.readthedocs.io/)
- [图神经网络入门](https://towardsdatascience.com/graph-neural-networks-a-beginners-guide-5562c1d12376)
- [假新闻检测研究](https://arxiv.org/abs/2011.03327)
