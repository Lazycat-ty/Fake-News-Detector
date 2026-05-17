from typing import List, Optional
from sqlalchemy.orm import Session
from app.schemas.graph import GraphResponse, Node, Edge, NodeResponse
import random
import time


class GraphService:
    async def get_graph_data(self, db: Session) -> GraphResponse:
        """获取传播图谱数据"""
        # 生成节点数据
        nodes = self._generate_nodes()
        
        # 生成边数据
        edges = self._generate_edges(nodes)
        
        return GraphResponse(nodes=nodes, edges=edges)
    
    async def get_node_detail(self, node_id: str, db: Session) -> NodeResponse:
        """获取节点详情"""
        # 生成节点数据
        nodes = self._generate_nodes()
        
        # 生成边数据
        edges = self._generate_edges(nodes)
        
        # 找到指定节点
        node = next((n for n in nodes if n.id == node_id), None)
        if not node:
            return None
        
        # 计算节点连接数
        connections = len([e for e in edges if e.source == node_id or e.target == node_id])
        
        # 计算分享数和评论数
        shares = len([e for e in edges if (e.source == node_id or e.target == node_id) and e.type == "share"])
        comments = len([e for e in edges if (e.source == node_id or e.target == node_id) and e.type == "comment"])
        
        return NodeResponse(
            node=node,
            connections=connections,
            shares=shares,
            comments=comments
        )
    
    def _generate_nodes(self) -> List[Node]:
        """生成节点数据"""
        nodes = []
        
        # 生成新闻节点
        news_titles = [
            "专家确认：新型疫苗即将上市",
            "网传某地发生重大事故 [待核实]",
            "央行发布最新利率政策",
            "科学家发现治愈方法 [存疑]",
            "政府公布新经济政策",
            "震惊！这个习惯危害健康",
            "国际合作协议正式签署",
            "紧急扩散！重要通知"
        ]
        
        for i in range(8):
            is_fake = i == 1 or i == 3 or i == 5 or i == 7
            nodes.append(Node(
                id=f"news-{i}",
                x=200 + random.random() * 400,
                y=150 + random.random() * 300,
                vx=0,
                vy=0,
                label=news_titles[i],
                type="news",
                isFake=is_fake if i < 6 else None,
                size=18 + random.random() * 8,
                timestamp=int(time.time() * 1000) - int(random.random() * 86400000 * 7),
                engagement=random.randint(100, 10000)
            ))
        
        # 生成用户节点
        for i in range(20):
            nodes.append(Node(
                id=f"user-{i}",
                x=100 + random.random() * 600,
                y=100 + random.random() * 400,
                vx=0,
                vy=0,
                label=f"用户 {chr(65 + (i % 26))}{i + 1}",
                type="user",
                size=8 + random.random() * 6
            ))
        
        # 生成信息源节点
        source_names = ["官方媒体", "社交平台", "个人博客", "新闻网站", "论坛"]
        for i in range(5):
            nodes.append(Node(
                id=f"source-{i}",
                x=150 + random.random() * 500,
                y=100 + random.random() * 400,
                vx=0,
                vy=0,
                label=source_names[i],
                type="source",
                size=14
            ))
        
        return nodes
    
    def _generate_edges(self, nodes: List[Node]) -> List[Edge]:
        """生成边数据"""
        edges = []
        edge_types = ["share", "comment", "follow", "publish"]
        
        for node in nodes:
            if node.type == "user":
                # 用户分享/评论新闻
                news_nodes = [n for n in nodes if n.type == "news"]
                num_connections = 1 + random.randint(0, 2)
                shuffled = random.sample(news_nodes, min(num_connections, len(news_nodes)))
                
                for target_node in shuffled:
                    edges.append(Edge(
                        source=node.id,
                        target=target_node.id,
                        strength=0.3 + random.random() * 0.7,
                        type="share" if random.random() > 0.5 else "comment"
                    ))
                
                # 用户之间的关注关系
                if random.random() > 0.7:
                    other_users = [n for n in nodes if n.type == "user" and n.id != node.id]
                    if other_users:
                        random_user = random.choice(other_users)
                        edges.append(Edge(
                            source=node.id,
                            target=random_user.id,
                            strength=0.2,
                            type="follow"
                        ))
            
            if node.type == "news":
                # 新闻来源关系
                source_nodes = [n for n in nodes if n.type == "source"]
                if source_nodes:
                    random_source = random.choice(source_nodes)
                    edges.append(Edge(
                        source=random_source.id,
                        target=node.id,
                        strength=0.6 + random.random() * 0.4,
                        type="publish"
                    ))
        
        return edges
