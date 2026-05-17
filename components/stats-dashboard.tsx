"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Activity,
  Clock,
  Database,
  Cpu,
  RefreshCw,
  Download,
  Zap,
  Users,
  Globe,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Filter,
  BarChart3,
  PieChartIcon,
  LineChartIcon,
  Layers,
  Server,
  HardDrive,
  Wifi,
  ChevronRight,
  ExternalLink
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
} from "recharts"

// 数据生成函数
const generateAccuracyData = () => {
  const months = ["1月", "2月", "3月", "4月", "5月", "6月"]
  return months.map((month, i) => ({
    month,
    accuracy: 89.2 + i * 1.1 + Math.random() * 0.5,
    recall: 87.5 + i * 1.2 + Math.random() * 0.6,
    f1: 88.3 + i * 1.15 + Math.random() * 0.5,
    precision: 88.8 + i * 1.05 + Math.random() * 0.4,
  }))
}

const generateDetectionData = () => {
  const days = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
  return days.map((day) => ({
    day,
    fake: Math.floor(100 + Math.random() * 150),
    real: Math.floor(400 + Math.random() * 200),
    uncertain: Math.floor(50 + Math.random() * 80),
  }))
}

const generateHourlyData = () => {
  return Array.from({ length: 24 }, (_, i) => ({
    hour: `${i}:00`,
    count: Math.floor(200 + Math.sin(i / 3) * 150 + Math.random() * 100),
    fake: Math.floor(20 + Math.sin(i / 4) * 15 + Math.random() * 10),
  }))
}

const generateRealtimeData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    time: i,
    value: Math.floor(50 + Math.sin(i / 2) * 30 + Math.random() * 20),
  }))
}

const categoryData = [
  { name: "政治新闻", value: 32, color: "#a855f7", count: 4120 },
  { name: "健康医疗", value: 28, color: "#06b6d4", count: 3605 },
  { name: "科技财经", value: 18, color: "#22c55e", count: 2318 },
  { name: "社会民生", value: 14, color: "#f59e0b", count: 1803 },
  { name: "娱乐八卦", value: 8, color: "#ec4899", count: 1030 },
]

const platformData = [
  { name: "微博", value: 45, color: "#ef4444", icon: "weibo" },
  { name: "微信", value: 30, color: "#22c55e", icon: "wechat" },
  { name: "抖音", value: 15, color: "#000000", icon: "tiktok" },
  { name: "其他", value: 10, color: "#666666", icon: "other" },
]

const radarData = [
  { metric: "准确率", value: 94.6, fullMark: 100 },
  { metric: "召回率", value: 95.1, fullMark: 100 },
  { metric: "精确率", value: 93.2, fullMark: 100 },
  { metric: "F1分数", value: 94.1, fullMark: 100 },
  { metric: "AUC", value: 96.8, fullMark: 100 },
  { metric: "速度", value: 92.0, fullMark: 100 },
]

const generateRecentDetections = () => [
  { id: 1, title: "某地发现罕见病例，专家建议立即扩散...", result: "fake", time: "2分钟前", confidence: 89, source: "微博", category: "健康医疗" },
  { id: 2, title: "央行发布最新货币政策调整公告", result: "real", time: "5分钟前", confidence: 94, source: "微信", category: "科技财经" },
  { id: 3, title: "专家称某种饮食习惯可延长寿命50%", result: "uncertain", time: "8分钟前", confidence: 52, source: "抖音", category: "健康医疗" },
  { id: 4, title: "国际气候峰会达成历史性协议", result: "real", time: "12分钟前", confidence: 91, source: "微博", category: "政治新闻" },
  { id: 5, title: "紧急扩散！重要安全通知请转发", result: "fake", time: "15分钟前", confidence: 96, source: "微信", category: "社会民生" },
  { id: 6, title: "科技公司发布新一代AI产品", result: "real", time: "18分钟前", confidence: 88, source: "微博", category: "科技财经" },
  { id: 7, title: "某明星深夜发文引发热议", result: "uncertain", time: "22分钟前", confidence: 61, source: "微博", category: "娱乐八卦" },
  { id: 8, title: "重大发现：古墓出土罕见文物", result: "real", time: "25分钟前", confidence: 85, source: "微信", category: "社会民生" },
]

// 实时监控组件
function RealtimeMonitor() {
  const [data, setData] = useState(generateRealtimeData())
  const [currentValue, setCurrentValue] = useState(65)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newValue = Math.floor(50 + Math.sin(Date.now() / 1000) * 30 + Math.random() * 20)
        setCurrentValue(newValue)
        return [...prev.slice(1), { time: prev.length, value: newValue }]
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-accent animate-pulse" />
            实时检测流
          </CardTitle>
          <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
            <span className="w-1.5 h-1.5 rounded-full bg-accent mr-1.5 animate-pulse" />
            LIVE
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-4 mb-4">
          <div>
            <p className="text-3xl font-bold text-foreground">{currentValue}</p>
            <p className="text-xs text-muted-foreground">条/秒</p>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={60}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="realtimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#realtimeGradient)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* 实时指标 */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "真实", value: Math.floor(currentValue * 0.75), color: "text-accent" },
            { label: "虚假", value: Math.floor(currentValue * 0.15), color: "text-destructive" },
            { label: "待定", value: Math.floor(currentValue * 0.10), color: "text-primary" },
          ].map((item, i) => (
            <div key={i} className="text-center p-2 rounded-lg bg-secondary/50">
              <p className={`text-lg font-semibold ${item.color}`}>{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 地理分布组件
function GeographicDistribution() {
  const regions = [
    { name: "华北", value: 28, trend: "up" },
    { name: "华东", value: 35, trend: "up" },
    { name: "华南", value: 18, trend: "down" },
    { name: "西南", value: 12, trend: "up" },
    { name: "其他", value: 7, trend: "stable" },
  ]
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader className="pb-2">
        <CardTitle className="text-foreground text-base flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          地区分布
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {regions.map((region, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-foreground">{region.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{region.value}%</span>
                  {region.trend === "up" && <ArrowUpRight className="w-3 h-3 text-accent" />}
                  {region.trend === "down" && <ArrowDownRight className="w-3 h-3 text-destructive" />}
                </div>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${region.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 系统健康度组件
function SystemHealth() {
  const [health, setHealth] = useState({
    api: { status: "healthy", latency: 45, load: 32 },
    database: { status: "healthy", latency: 12, load: 58 },
    model: { status: "healthy", latency: 48, load: 67 },
    cache: { status: "healthy", latency: 2, load: 24 },
  })
  
  useEffect(() => {
    const interval = setInterval(() => {
      setHealth(prev => ({
        api: { ...prev.api, latency: 40 + Math.random() * 15, load: 28 + Math.random() * 10 },
        database: { ...prev.database, latency: 10 + Math.random() * 8, load: 55 + Math.random() * 10 },
        model: { ...prev.model, latency: 45 + Math.random() * 10, load: 65 + Math.random() * 8 },
        cache: { ...prev.cache, latency: 1 + Math.random() * 3, load: 20 + Math.random() * 10 },
      }))
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  const services = [
    { key: "api", name: "API 服务", icon: Server, ...health.api },
    { key: "database", name: "数据库", icon: Database, ...health.database },
    { key: "model", name: "模型服务", icon: Cpu, ...health.model },
    { key: "cache", name: "缓存服务", icon: HardDrive, ...health.cache },
  ]
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <Wifi className="w-4 h-4 text-accent" />
            系统健康度
          </CardTitle>
          <Badge variant="secondary" className="text-xs bg-accent/10 text-accent">
            全部正常
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {services.map((service, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-secondary/30">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                service.status === 'healthy' ? 'bg-accent/20' : 'bg-destructive/20'
              }`}>
                <service.icon className={`w-4 h-4 ${
                  service.status === 'healthy' ? 'text-accent' : 'text-destructive'
                }`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground">{service.name}</p>
                  <span className="text-xs text-muted-foreground">{service.latency.toFixed(0)}ms</span>
                </div>
                <div className="mt-1">
                  <Progress value={service.load} className="h-1" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground w-10 text-right">{service.load.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// 检测记录表格组件
function DetectionTable({ detections }: { detections: ReturnType<typeof generateRecentDetections> }) {
  const [filter, setFilter] = useState<"all" | "fake" | "real" | "uncertain">("all")
  
  const filteredDetections = detections.filter(d => 
    filter === "all" || d.result === filter
  )
  
  return (
    <Card className="bg-card/50 backdrop-blur border-border">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            检测记录
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border border-border overflow-hidden">
              {(["all", "fake", "real", "uncertain"] as const).map((f) => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setFilter(f)}
                  className={`h-7 px-2 rounded-none text-xs ${filter === f ? "bg-primary" : ""}`}
                >
                  {f === "all" ? "全部" : f === "fake" ? "虚假" : f === "real" ? "真实" : "待定"}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" className="h-7">
              <Filter className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {filteredDetections.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer group"
            >
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                item.result === "fake" ? "bg-destructive" : 
                item.result === "real" ? "bg-accent" : "bg-primary"
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {item.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {item.source}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] h-4 px-1">
                    {item.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <Badge 
                  variant={item.result === "fake" ? "destructive" : item.result === "real" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {item.result === "fake" ? "虚假" : item.result === "real" ? "真实" : "待定"}
                </Badge>
                <p className="text-xs text-muted-foreground mt-1">{item.confidence}%</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-3 text-muted-foreground hover:text-foreground">
          查看更多记录
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  )
}

export function StatsDashboard() {
  const [accuracyData, setAccuracyData] = useState(generateAccuracyData())
  const [detectionData, setDetectionData] = useState(generateDetectionData())
  const [hourlyData, setHourlyData] = useState(generateHourlyData())
  const [recentDetections, setRecentDetections] = useState(generateRecentDetections())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month">("week")
  const [activeTab, setActiveTab] = useState("overview")
  
  // 实时统计数据
  const [liveStats, setLiveStats] = useState({
    totalToday: 12847,
    fakeCount: 1234,
    realCount: 10613,
    uncertainCount: 1000,
    accuracy: 94.6,
    avgResponseTime: 48,
    activeUsers: 2341,
    qps: 156,
  })

  // 模拟实时数据更新
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/stats/overview');
        if (response.ok) {
          const data = await response.json();
          setLiveStats(data);
        }
      } catch (error) {
        // 如果API调用失败，使用模拟数据
        setLiveStats(prev => ({
          ...prev,
          totalToday: prev.totalToday + Math.floor(Math.random() * 8),
          fakeCount: prev.fakeCount + (Math.random() > 0.7 ? 1 : 0),
          realCount: prev.realCount + Math.floor(Math.random() * 6),
          uncertainCount: prev.uncertainCount + (Math.random() > 0.8 ? 1 : 0),
          activeUsers: Math.floor(2300 + Math.random() * 100),
          avgResponseTime: Math.floor(45 + Math.random() * 10),
          qps: Math.floor(150 + Math.random() * 20),
        }));
      }
    };

    // 初始获取数据
    fetchStats();

    // 定期更新数据
    const interval = setInterval(fetchStats, 5000);

    return () => clearInterval(interval);
  }, [])

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    await new Promise(r => setTimeout(r, 1000))
    setAccuracyData(generateAccuracyData())
    setDetectionData(generateDetectionData())
    setHourlyData(generateHourlyData())
    setRecentDetections(generateRecentDetections())
    setIsRefreshing(false)
  }, [])

  const stats = [
    {
      title: "检测准确率",
      value: `${liveStats.accuracy}%`,
      change: "+2.3%",
      trend: "up",
      icon: Shield,
      description: "相比上月",
      color: "#a855f7",
    },
    {
      title: "今日检测量",
      value: liveStats.totalToday.toLocaleString(),
      change: "+18.2%",
      trend: "up",
      icon: Activity,
      description: "相比昨日",
      color: "#06b6d4",
    },
    {
      title: "识别虚假新闻",
      value: liveStats.fakeCount.toLocaleString(),
      change: "-5.1%",
      trend: "down",
      icon: AlertTriangle,
      description: "相比上周",
      color: "#ef4444",
    },
    {
      title: "验证真实新闻",
      value: liveStats.realCount.toLocaleString(),
      change: "+22.4%",
      trend: "up",
      icon: CheckCircle,
      description: "相比上周",
      color: "#22c55e",
    },
  ]

  const systemStats = [
    { icon: Clock, label: "平均响应", value: `${liveStats.avgResponseTime}ms`, trend: "down" },
    { icon: Database, label: "数据规模", value: "2.8M+", trend: "up" },
    { icon: Zap, label: "QPS", value: liveStats.qps.toString(), trend: "up" },
    { icon: Users, label: "在线用户", value: liveStats.activeUsers.toLocaleString(), trend: "up" },
  ]

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <TabsList className="bg-secondary border border-border">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="w-4 h-4 mr-2" />
              数据概览
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <PieChartIcon className="w-4 h-4 mr-2" />
              深度分析
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Activity className="w-4 h-4 mr-2" />
              实时监控
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
              <span className="w-2 h-2 rounded-full bg-accent mr-2 animate-pulse" />
              实时数据
            </Badge>
            <div className="flex rounded-lg border border-border overflow-hidden">
              {(["day", "week", "month"] as const).map((period) => (
                <Button
                  key={period}
                  variant={selectedPeriod === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedPeriod(period)}
                  className={`rounded-none h-8 ${selectedPeriod === period ? "bg-primary" : ""}`}
                >
                  {period === "day" ? "今日" : period === "week" ? "本周" : "本月"}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isRefreshing} className="h-8">
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              刷新
            </Button>
            <Button variant="outline" size="sm" className="h-8">
              <Download className="w-4 h-4 mr-2" />
              导出
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6 mt-0">
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <Card key={i} className="bg-card/50 backdrop-blur border-border hover:border-primary/30 transition-colors group">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1 tabular-nums">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {stat.trend === "up" ? (
                          <TrendingUp className="w-3 h-3 text-accent" />
                        ) : (
                          <TrendingDown className="w-3 h-3 text-destructive" />
                        )}
                        <span className={stat.trend === "up" ? "text-accent text-xs" : "text-destructive text-xs"}>
                          {stat.change}
                        </span>
                        <span className="text-muted-foreground text-xs">{stat.description}</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl group-hover:scale-110 transition-transform" style={{ backgroundColor: `${stat.color}15` }}>
                      <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 系统状态条 */}
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardContent className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {systemStats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-secondary">
                      <stat.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-foreground tabular-nums">{stat.value}</p>
                        {stat.trend === "up" && <ArrowUpRight className="w-3 h-3 text-accent" />}
                        {stat.trend === "down" && <ArrowDownRight className="w-3 h-3 text-accent" />}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 图表区域 - 第一行 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 模型性能趋势 */}
            <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <LineChartIcon className="w-4 h-4 text-primary" />
                  模型性能趋势
                </CardTitle>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-1 rounded bg-primary" />
                    <span className="text-muted-foreground">准确率</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-1 rounded bg-accent" />
                    <span className="text-muted-foreground">召回率</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-1 rounded bg-chart-4" />
                    <span className="text-muted-foreground">F1</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={accuracyData}>
                    <defs>
                      <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} domain={[85, 100]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value: number) => [`${value.toFixed(1)}%`]}
                    />
                    <Line
                      type="monotone"
                      dataKey="accuracy"
                      stroke="#a855f7"
                      strokeWidth={2}
                      dot={{ fill: "#a855f7", r: 4 }}
                      name="准确率"
                    />
                    <Line
                      type="monotone"
                      dataKey="recall"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      dot={{ fill: "#06b6d4", r: 4 }}
                      name="召回率"
                    />
                    <Line
                      type="monotone"
                      dataKey="f1"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ fill: "#f59e0b", r: 4 }}
                      name="F1分数"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* 虚假新闻类别分布 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <PieChartIcon className="w-4 h-4 text-primary" />
                  类别分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={180}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value: number, name: string, entry) => [
                        `${value}% (${entry.payload.count.toLocaleString()}条)`,
                        entry.payload.name
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {categoryData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                      <span className="text-muted-foreground truncate">{item.name}</span>
                      <span className="text-foreground ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 图表区域 - 第二行 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 每日检测统计 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  每日检测统计
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={detectionData} barGap={2}>
                    <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="real" fill="#22c55e" radius={[4, 4, 0, 0]} name="真实新闻" stackId="a" />
                    <Bar dataKey="uncertain" fill="#a855f7" radius={[0, 0, 0, 0]} name="待定" stackId="a" />
                    <Bar dataKey="fake" fill="#ef4444" radius={[4, 4, 0, 0]} name="虚假新闻" stackId="a" />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded bg-[#22c55e]" />
                    <span className="text-muted-foreground">真实</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded bg-[#a855f7]" />
                    <span className="text-muted-foreground">待定</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded bg-[#ef4444]" />
                    <span className="text-muted-foreground">虚假</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 24小时检测趋势 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  24小时趋势
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <ComposedChart data={hourlyData}>
                    <defs>
                      <linearGradient id="hourlyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="hour" 
                      stroke="#666" 
                      fontSize={10} 
                      tickLine={false} 
                      axisLine={false}
                      interval={3}
                    />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(6, 182, 212, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#06b6d4"
                      strokeWidth={2}
                      fill="url(#hourlyGradient)"
                      name="总检测量"
                    />
                    <Line
                      type="monotone"
                      dataKey="fake"
                      stroke="#ef4444"
                      strokeWidth={2}
                      dot={false}
                      name="虚假新闻"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* 底部区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <DetectionTable detections={recentDetections} />
            </div>

            {/* 平台来源分布 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Globe className="w-4 h-4 text-primary" />
                  来源平台
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      innerRadius={35}
                      outerRadius={60}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value: number) => [`${value}%`, "占比"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-2">
                  {platformData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-foreground">{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 模型性能雷达图 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  综合性能评估
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(168, 85, 247, 0.2)" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#71717a', fontSize: 10 }} />
                    <Radar
                      name="性能指标"
                      dataKey="value"
                      stroke="#a855f7"
                      fill="#a855f7"
                      fillOpacity={0.3}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value: number) => [`${value}%`]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* 类别详细分析 */}
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  类别检测详情
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categoryData.map((category, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                          <span className="text-sm font-medium text-foreground">{category.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{category.count.toLocaleString()} 条</span>
                      </div>
                      <Progress value={category.value} className="h-2" />
                      <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                        <span>准确率: {(90 + Math.random() * 8).toFixed(1)}%</span>
                        <span>召回率: {(88 + Math.random() * 10).toFixed(1)}%</span>
                        <span>F1: {(89 + Math.random() * 9).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GeographicDistribution />
            
            {/* 检测置信度分布 */}
            <Card className="lg:col-span-2 bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-base flex items-center gap-2">
                  <Layers className="w-4 h-4 text-primary" />
                  置信度分布
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={[
                      { range: "50-60%", fake: 45, real: 30, uncertain: 120 },
                      { range: "60-70%", fake: 80, real: 65, uncertain: 85 },
                      { range: "70-80%", fake: 150, real: 180, uncertain: 40 },
                      { range: "80-90%", fake: 320, real: 450, uncertain: 15 },
                      { range: "90-100%", fake: 280, real: 680, uncertain: 5 },
                    ]}
                  >
                    <XAxis dataKey="range" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(18, 18, 24, 0.95)",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar dataKey="real" fill="#22c55e" name="真实" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="fake" fill="#ef4444" name="虚假" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="uncertain" fill="#a855f7" name="待定" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <RealtimeMonitor />
            <SystemHealth />
            <GeographicDistribution />
          </div>
          
          <DetectionTable detections={recentDetections} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
