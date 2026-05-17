"""测试训练脚本"""
import os
import sys

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from train import ModelTrainer


def test_trainer():
    """测试训练器"""
    print("测试ModelTrainer...")
    
    # 创建训练器实例
    trainer = ModelTrainer(
        dataset_name='Cora',
        hidden_channels=32,
        lr=0.01,
        weight_decay=5e-4,
        epochs=10
    )
    
    try:
        # 测试数据集加载
        print("测试数据集加载...")
        trainer.load_dataset()
        print("数据集加载成功")
        
        # 测试模型初始化
        print("测试模型初始化...")
        trainer.initialize_model()
        print("模型初始化成功")
        
        # 测试训练
        print("测试模型训练...")
        trainer.train()
        print("模型训练成功")
        
        # 测试测试
        print("测试模型测试...")
        accuracy = trainer.test()
        print(f"模型测试成功，准确率: {accuracy:.4f}")
        
        # 测试保存模型
        print("测试模型保存...")
        trainer.save_model('./test_model.pt')
        print("模型保存成功")
        
        print("所有测试通过！")
        return True
    except Exception as e:
        print(f"测试失败: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    test_trainer()
