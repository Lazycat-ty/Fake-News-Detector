"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { GraphVisualization } from "@/components/graph-visualization"
import { DetectionDemo } from "@/components/detection-demo"
import { StatsDashboard } from "@/components/stats-dashboard"
import { ArchitectureSection } from "@/components/architecture-section"
import {
  Network, 
  Shield, 
  BarChart3, 
  Layers,
  ArrowLeft
} from "lucide-react"

export default function DemoPage() {
  const [activeTab, setActiveTab] = useState("graph")

  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={goBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <span className="font-semibold text-lg text-foreground">Fake News Detector</span>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">Beta</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Section */}
      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <Badge variant="outline" className="mb-2">交互演示</Badge>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground">可视化探索</h2>
                <p className="text-muted-foreground mt-1">体验图神经网络检测流程的每个环节</p>
              </div>
              <TabsList className="bg-secondary border border-border h-auto p-1">
                <TabsTrigger 
                  value="graph" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-4"
                >
                  <Network className="w-4 h-4" />
                  <span className="hidden sm:inline">传播图谱</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="detect" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-4"
                >
                  <Shield className="w-4 h-4" />
                  <span className="hidden sm:inline">新闻检测</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="stats" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-4"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">数据统计</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="arch" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2 px-4"
                >
                  <Layers className="w-4 h-4" />
                  <span className="hidden sm:inline">技术架构</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="graph" className="mt-0">
              <div className="space-y-4">
                <Card className="bg-card/30 border-border p-4">
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span>提示:</span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      点击节点查看详情
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-accent" />
                      使用工具栏控制视图
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-chart-4" />
                      调节力度改变布局
                    </span>
                  </div>
                </Card>
                <GraphVisualization />
              </div>
            </TabsContent>

            <TabsContent value="detect" className="mt-0">
              <DetectionDemo />
            </TabsContent>

            <TabsContent value="stats" className="mt-0">
              <StatsDashboard />
            </TabsContent>

            <TabsContent value="arch" className="mt-0">
              <ArchitectureSection />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}
