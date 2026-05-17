"""数据预处理脚本"""
import torch
from torch_geometric.data import Data
import numpy as np
import pandas as pd
import networkx as nx
from sklearn.preprocessing import LabelEncoder, StandardScaler


class DataPreprocessor:
    def __init__(self):
        self.label_encoder = LabelEncoder()
        self.scaler = StandardScaler()
    
    def load_data(self, news_file, user_file, edge_file):
        """加载数据"""
        print("加载数据...")
        
        # 加载新闻数据
        news_df = pd.read_csv(news_file)
        
        # 加载用户数据
        user_df = pd.read_csv(user_file)
        
        # 加载边数据
        edge_df = pd.read_csv(edge_file)
        
        print(f"数据加载完成，新闻数: {len(news_df)}, 用户数: {len(user_df)}, 边数: {len(edge_df)}")
        
        return news_df, user_df, edge_df
    
    def preprocess_features(self, news_df, user_df):
        """预处理特征"""
        print("预处理特征...")
        
        # 处理新闻特征
        news_features = []
        for _, row in news_df.iterrows():
            # 提取新闻特征：长度、关键词数量、情感得分等
            content_length = len(str(row['content']))
            keyword_count = len(str(row['keywords']).split(',')) if pd.notna(row['keywords']) else 0
            sentiment_score = row.get('sentiment_score', 0)
            
            news_features.append([content_length, keyword_count, sentiment_score])
        
        # 处理用户特征
        user_features = []
        for _, row in user_df.iterrows():
            # 提取用户特征：关注数、粉丝数、活跃度等
            followers = row.get('followers', 0)
            following = row.get('following', 0)
            activity = row.get('activity', 0)
            
            user_features.append([followers, following, activity])
        
        # 标准化特征
        news_features = self.scaler.fit_transform(news_features)
        user_features = self.scaler.fit_transform(user_features)
        
        return news_features, user_features
    
    def build_graph(self, news_df, user_df, edge_df, news_features, user_features):
        """构建图数据"""
        print("构建图数据...")
        
        # 创建节点映射
        node_id_map = {}
        node_features = []
        node_labels = []
        
        # 添加新闻节点
        for i, (_, row) in enumerate(news_df.iterrows()):
            node_id = f"news_{i}"
            node_id_map[node_id] = len(node_id_map)
            node_features.append(news_features[i])
            node_labels.append(1 if row['label'] == 'fake' else 0)  # 1表示假新闻，0表示真实新闻
        
        # 添加用户节点
        for i, (_, row) in enumerate(user_df.iterrows()):
            node_id = f"user_{i}"
            node_id_map[node_id] = len(node_id_map)
            node_features.append(user_features[i])
            node_labels.append(2)  # 2表示用户节点
        
        # 构建边
        edges = []
        for _, row in edge_df.iterrows():
            source_id = f"{row['source_type']}_{row['source_id']}"
            target_id = f"{row['target_type']}_{row['target_id']}"
            
            if source_id in node_id_map and target_id in node_id_map:
                edges.append([node_id_map[source_id], node_id_map[target_id]])
        
        # 转换为PyTorch Geometric格式
        edge_index = torch.tensor(edges, dtype=torch.long).t().contiguous()
        x = torch.tensor(node_features, dtype=torch.float)
        y = torch.tensor(node_labels, dtype=torch.long)
        
        # 创建训练、验证、测试掩码
        num_nodes = len(node_id_map)
        train_mask = torch.zeros(num_nodes, dtype=torch.bool)
        val_mask = torch.zeros(num_nodes, dtype=torch.bool)
        test_mask = torch.zeros(num_nodes, dtype=torch.bool)
        
        # 为新闻节点分配掩码
        news_count = len(news_df)
        train_mask[:int(news_count * 0.6)] = True
        val_mask[int(news_count * 0.6):int(news_count * 0.8)] = True
        test_mask[int(news_count * 0.8):news_count] = True
        
        # 创建数据对象
        data = Data(
            x=x,
            edge_index=edge_index,
            y=y,
            train_mask=train_mask,
            val_mask=val_mask,
            test_mask=test_mask
        )
        
        print(f"图构建完成，节点数: {num_nodes}, 边数: {len(edges)}")
        
        return data
    
    def save_data(self, data, path='./data/graph_data.pt'):
        """保存数据"""
        torch.save(data, path)
        print(f"数据保存成功: {path}")
    
    def load_data_from_file(self, path='./data/graph_data.pt'):
        """从文件加载数据"""
        data = torch.load(path)
        print(f"数据加载成功: {path}")
        return data


def main():
    """主函数"""
    preprocessor = DataPreprocessor()
    
    # 加载数据
    news_df, user_df, edge_df = preprocessor.load_data(
        '../data/news.csv',
        '../data/users.csv',
        '../data/edges.csv'
    )
    
    # 预处理特征
    news_features, user_features = preprocessor.preprocess_features(news_df, user_df)
    
    # 构建图
    data = preprocessor.build_graph(news_df, user_df, edge_df, news_features, user_features)
    
    # 保存数据
    preprocessor.save_data(data)


if __name__ == "__main__":
    main()
