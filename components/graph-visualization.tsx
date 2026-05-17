"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  Filter,
  Eye,
  EyeOff
} from "lucide-react"

interface Node {
  id: string
  x: number
  y: number
  vx: number
  vy: number
  label: string
  type: "news" | "user" | "source"
  isFake?: boolean
  size: number
  timestamp?: number
  engagement?: number
}

interface Edge {
  source: string
  target: string
  strength: number
  type: "share" | "comment" | "follow" | "publish"
}

const COLORS = {
  news: { real: "#22c55e", fake: "#ef4444", neutral: "#a855f7" },
  user: "#06b6d4",
  source: "#f59e0b",
  edge: {
    share: "rgba(168, 85, 247, 0.3)",
    comment: "rgba(6, 182, 212, 0.3)",
    follow: "rgba(34, 197, 94, 0.3)",
    publish: "rgba(245, 158, 11, 0.4)",
  },
  edgeHighlight: "rgba(255, 255, 255, 0.8)",
}

const NEWS_TITLES = [
  "专家确认：新型疫苗即将上市",
  "网传某地发生重大事故 [待核实]",
  "央行发布最新利率政策",
  "科学家发现治愈方法 [存疑]",
  "政府公布新经济政策",
  "震惊！这个习惯危害健康",
  "国际合作协议正式签署",
  "紧急扩散！重要通知",
]

function generateInitialData(): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // 创建新闻节点
  for (let i = 0; i < 8; i++) {
    const isFake = i === 1 || i === 3 || i === 5 || i === 7
    nodes.push({
      id: `news-${i}`,
      x: 200 + Math.random() * 400,
      y: 150 + Math.random() * 300,
      vx: 0,
      vy: 0,
      label: NEWS_TITLES[i],
      type: "news",
      isFake: i < 6 ? isFake : undefined,
      size: 18 + Math.random() * 8,
      timestamp: Date.now() - Math.random() * 86400000 * 7,
      engagement: Math.floor(Math.random() * 10000),
    })
  }

  // 创建用户节点
  for (let i = 0; i < 20; i++) {
    nodes.push({
      id: `user-${i}`,
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 400,
      vx: 0,
      vy: 0,
      label: `用户 ${String.fromCharCode(65 + (i % 26))}${i + 1}`,
      type: "user",
      size: 8 + Math.random() * 6,
    })
  }

  // 创建信息源节点
  const sourceNames = ["官方媒体", "社交平台", "个人博客", "新闻网站", "论坛"]
  for (let i = 0; i < 5; i++) {
    nodes.push({
      id: `source-${i}`,
      x: 150 + Math.random() * 500,
      y: 100 + Math.random() * 400,
      vx: 0,
      vy: 0,
      label: sourceNames[i],
      type: "source",
      size: 14,
    })
  }

  // 创建边
  const edgeTypes: Edge["type"][] = ["share", "comment", "follow", "publish"]
  
  nodes.forEach((node) => {
    if (node.type === "user") {
      // 用户分享/评论新闻
      const newsNodes = nodes.filter((n) => n.type === "news")
      const numConnections = 1 + Math.floor(Math.random() * 3)
      const shuffled = [...newsNodes].sort(() => Math.random() - 0.5)
      
      for (let i = 0; i < numConnections && i < shuffled.length; i++) {
        edges.push({
          source: node.id,
          target: shuffled[i].id,
          strength: 0.3 + Math.random() * 0.7,
          type: Math.random() > 0.5 ? "share" : "comment",
        })
      }

      // 用户之间的关注关系
      if (Math.random() > 0.7) {
        const otherUsers = nodes.filter((n) => n.type === "user" && n.id !== node.id)
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)]
        if (randomUser) {
          edges.push({
            source: node.id,
            target: randomUser.id,
            strength: 0.2,
            type: "follow",
          })
        }
      }
    }

    if (node.type === "news") {
      // 新闻来源关系
      const sourceNodes = nodes.filter((n) => n.type === "source")
      const randomSource = sourceNodes[Math.floor(Math.random() * sourceNodes.length)]
      edges.push({
        source: randomSource.id,
        target: node.id,
        strength: 0.6 + Math.random() * 0.4,
        type: "publish",
      })
    }
  })

  return { nodes, edges }
}

export function GraphVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [data, setData] = useState<{ nodes: Node[]; edges: Edge[] }>({ nodes: [], edges: [] })
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 500 })
  const [isPlaying, setIsPlaying] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [showLabels, setShowLabels] = useState(true)
  const [filterType, setFilterType] = useState<"all" | "news" | "user" | "source">("all")
  const [forceStrength, setForceStrength] = useState([50])

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/graph/');
        if (response.ok) {
          const data = await response.json();
          setData(data);
        } else {
          // 如果API调用失败，使用模拟数据
          setData(generateInitialData());
        }
      } catch (error) {
        // 如果网络错误，使用模拟数据
        setData(generateInitialData());
      }
    };
    
    fetchGraphData();
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current?.parentElement) {
        const rect = canvasRef.current.parentElement.getBoundingClientRect()
        setDimensions({ width: rect.width, height: Math.min(rect.height, 500) })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const applyForces = useCallback((nodes: Node[], edges: Edge[], width: number, height: number, strength: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const strengthFactor = strength / 50

    nodes.forEach((node) => {
      // 中心引力
      node.vx += (centerX - node.x) * 0.001 * strengthFactor
      node.vy += (centerY - node.y) * 0.001 * strengthFactor

      // 节点斥力
      nodes.forEach((other) => {
        if (node.id !== other.id) {
          const dx = node.x - other.x
          const dy = node.y - other.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const force = (400 * strengthFactor) / (dist * dist)
          node.vx += (dx / dist) * force
          node.vy += (dy / dist) * force
        }
      })
    })

    // 边的引力
    edges.forEach((edge) => {
      const source = nodes.find((n) => n.id === edge.source)
      const target = nodes.find((n) => n.id === edge.target)
      if (source && target) {
        const dx = target.x - source.x
        const dy = target.y - source.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        const force = (dist - 80) * 0.008 * edge.strength * strengthFactor
        source.vx += (dx / dist) * force
        target.vx -= (dx / dist) * force
        source.vy += (dy / dist) * force
        target.vy -= (dy / dist) * force
      }
    })

    // 更新位置
    nodes.forEach((node) => {
      node.vx *= 0.92
      node.vy *= 0.92
      node.x += node.vx
      node.y += node.vy
      // 边界约束
      const margin = 40
      node.x = Math.max(margin, Math.min(width - margin, node.x))
      node.y = Math.max(margin, Math.min(height - margin, node.y))
    })

    return nodes
  }, [])

  useEffect(() => {
    if (!canvasRef.current || data.nodes.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { width, height } = dimensions
    canvas.width = width * 2
    canvas.height = height * 2
    ctx.scale(2, 2)

    let nodes = [...data.nodes]

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      
      // 应用缩放
      ctx.translate(width / 2, height / 2)
      ctx.scale(zoom, zoom)
      ctx.translate(-width / 2, -height / 2)

      if (isPlaying) {
        nodes = applyForces(nodes, data.edges, width, height, forceStrength[0])
      }

      // 过滤节点
      const visibleNodes = filterType === "all" 
        ? nodes 
        : nodes.filter(n => n.type === filterType)
      const visibleNodeIds = new Set(visibleNodes.map(n => n.id))

      // 绘制边
      data.edges.forEach((edge) => {
        if (!visibleNodeIds.has(edge.source) && !visibleNodeIds.has(edge.target)) return
        
        const source = nodes.find((n) => n.id === edge.source)
        const target = nodes.find((n) => n.id === edge.target)
        if (source && target) {
          const isHighlighted = selectedNode && 
            (selectedNode.id === source.id || selectedNode.id === target.id)
          const isHovered = hoveredNode && 
            (hoveredNode.id === source.id || hoveredNode.id === target.id)

          ctx.beginPath()
          ctx.moveTo(source.x, source.y)
          ctx.lineTo(target.x, target.y)
          ctx.strokeStyle = isHighlighted || isHovered
            ? COLORS.edgeHighlight
            : COLORS.edge[edge.type]
          ctx.lineWidth = (isHighlighted || isHovered ? 2 : 1) * edge.strength
          ctx.stroke()
        }
      })

      // 绘制节点
      visibleNodes.forEach((node) => {
        const isSelected = selectedNode?.id === node.id
        const isHovered = hoveredNode?.id === node.id
        const nodeSize = node.size * (isSelected || isHovered ? 1.3 : 1)

        // 发光效果
        if (isSelected || isHovered) {
          ctx.beginPath()
          ctx.arc(node.x, node.y, nodeSize * 2, 0, Math.PI * 2)
          let glowColor = COLORS.user
          if (node.type === "news") {
            glowColor = node.isFake === true ? COLORS.news.fake : node.isFake === false ? COLORS.news.real : COLORS.news.neutral
          } else if (node.type === "source") {
            glowColor = COLORS.source
          }
          const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, nodeSize * 2)
          gradient.addColorStop(0, glowColor + "60")
          gradient.addColorStop(1, "transparent")
          ctx.fillStyle = gradient
          ctx.fill()
        }

        ctx.beginPath()
        ctx.arc(node.x, node.y, nodeSize, 0, Math.PI * 2)

        let color = COLORS.user
        if (node.type === "news") {
          color = node.isFake === true ? COLORS.news.fake : node.isFake === false ? COLORS.news.real : COLORS.news.neutral
        } else if (node.type === "source") {
          color = COLORS.source
        }

        ctx.fillStyle = color
        ctx.fill()

        if (isSelected) {
          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 3
          ctx.stroke()
        } else if (isHovered) {
          ctx.strokeStyle = "#fff"
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // 绘制标签
        if (showLabels && node.type !== "user") {
          ctx.font = "10px sans-serif"
          ctx.fillStyle = "#fff"
          ctx.textAlign = "center"
          const labelText = node.label.length > 12 ? node.label.slice(0, 12) + "..." : node.label
          ctx.fillText(labelText, node.x, node.y + nodeSize + 14)
        }
      })

      ctx.restore()

      setData((prev) => ({ ...prev, nodes }))
      animationRef.current = requestAnimationFrame(render)
    }

    render()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, data.edges.length, hoveredNode, selectedNode, isPlaying, zoom, showLabels, filterType, forceStrength, applyForces])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - dimensions.width / 2) / zoom + dimensions.width / 2
    const y = (e.clientY - rect.top - dimensions.height / 2) / zoom + dimensions.height / 2

    const found = data.nodes.find((node) => {
      const dx = node.x - x
      const dy = node.y - y
      return Math.sqrt(dx * dx + dy * dy) < node.size * 1.5
    })

    setHoveredNode(found || null)
  }

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - dimensions.width / 2) / zoom + dimensions.width / 2
    const y = (e.clientY - rect.top - dimensions.height / 2) / zoom + dimensions.height / 2

    const found = data.nodes.find((node) => {
      const dx = node.x - x
      const dy = node.y - y
      return Math.sqrt(dx * dx + dy * dy) < node.size * 1.5
    })

    setSelectedNode(found === selectedNode ? null : found || null)
  }

  const resetGraph = () => {
    setData(generateInitialData())
    setSelectedNode(null)
    setZoom(1)
  }

  const getConnectedInfo = (node: Node) => {
    const connected = data.edges.filter(e => e.source === node.id || e.target === node.id)
    const shares = connected.filter(e => e.type === "share").length
    const comments = connected.filter(e => e.type === "comment").length
    return { total: connected.length, shares, comments }
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-border bg-card/50 backdrop-blur">
      {/* 工具栏 */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-secondary/80 backdrop-blur"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={resetGraph}
            className="bg-secondary/80 backdrop-blur"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setZoom(z => Math.min(2, z + 0.2))}
            className="bg-secondary/80 backdrop-blur"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setZoom(z => Math.max(0.5, z - 0.2))}
            className="bg-secondary/80 backdrop-blur"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowLabels(!showLabels)}
            className="bg-secondary/80 backdrop-blur"
          >
            {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "news", "user", "source"] as const).map((type) => (
            <Button
              key={type}
              variant={filterType === type ? "default" : "secondary"}
              size="sm"
              onClick={() => setFilterType(type)}
              className={filterType === type ? "bg-primary" : "bg-secondary/80 backdrop-blur"}
            >
              {type === "all" ? "全部" : type === "news" ? "新闻" : type === "user" ? "用户" : "来源"}
            </Button>
          ))}
        </div>
      </div>

      {/* 力度调节 */}
      <div className="absolute bottom-20 left-4 z-20 flex items-center gap-2 bg-secondary/80 backdrop-blur rounded-lg px-3 py-2">
        <span className="text-xs text-muted-foreground">力度</span>
        <Slider
          value={forceStrength}
          onValueChange={setForceStrength}
          min={10}
          max={100}
          step={10}
          className="w-24"
        />
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-[500px] cursor-crosshair"
        style={{ width: dimensions.width, height: 500 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredNode(null)}
        onClick={handleClick}
      />

      {/* 悬停提示 */}
      {hoveredNode && !selectedNode && (
        <div
          className="absolute bg-popover/95 backdrop-blur border border-border rounded-lg px-3 py-2 text-sm pointer-events-none z-10 max-w-[200px]"
          style={{
            left: Math.min(hoveredNode.x * zoom + (dimensions.width * (1 - zoom)) / 2 + 15, dimensions.width - 180),
            top: Math.min(hoveredNode.y * zoom + (500 * (1 - zoom)) / 2 - 10, 500 - 80),
          }}
        >
          <p className="font-medium text-foreground truncate">{hoveredNode.label}</p>
          <p className="text-muted-foreground text-xs">
            类型: {hoveredNode.type === "news" ? "新闻" : hoveredNode.type === "user" ? "用户" : "信息源"}
          </p>
          {hoveredNode.type === "news" && hoveredNode.isFake !== undefined && (
            <Badge variant={hoveredNode.isFake ? "destructive" : "default"} className="mt-1 text-xs">
              {hoveredNode.isFake ? "疑似虚假" : "已验证真实"}
            </Badge>
          )}
        </div>
      )}

      {/* 选中节点详情面板 */}
      {selectedNode && (
        <div className="absolute top-16 right-4 bg-popover/95 backdrop-blur border border-border rounded-lg p-4 z-20 w-64">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-foreground">{selectedNode.label}</p>
              <p className="text-xs text-muted-foreground">
                {selectedNode.type === "news" ? "新闻节点" : selectedNode.type === "user" ? "用户节点" : "信息源节点"}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSelectedNode(null)}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>

          {selectedNode.type === "news" && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">检测状态</span>
                <Badge variant={selectedNode.isFake === true ? "destructive" : selectedNode.isFake === false ? "default" : "secondary"}>
                  {selectedNode.isFake === true ? "虚假" : selectedNode.isFake === false ? "真实" : "待检测"}
                </Badge>
              </div>
              {selectedNode.engagement && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">互动量</span>
                  <span className="text-foreground">{selectedNode.engagement.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">关联节点</span>
                <span className="text-foreground">{getConnectedInfo(selectedNode).total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">转发数</span>
                <span className="text-foreground">{getConnectedInfo(selectedNode).shares}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">评论数</span>
                <span className="text-foreground">{getConnectedInfo(selectedNode).comments}</span>
              </div>
            </div>
          )}

          {selectedNode.type === "user" && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">关联节点</span>
                <span className="text-foreground">{getConnectedInfo(selectedNode).total}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">分享行为</span>
                <span className="text-foreground">{getConnectedInfo(selectedNode).shares}</span>
              </div>
            </div>
          )}

          {selectedNode.type === "source" && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">发布新闻</span>
                <span className="text-foreground">
                  {data.edges.filter(e => e.source === selectedNode.id && e.type === "publish").length}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 图例 */}
      <div className="absolute bottom-4 left-4 flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-muted-foreground">虚假新闻</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-muted-foreground">真实新闻</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#a855f7]" />
          <span className="text-muted-foreground">待检测</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#06b6d4]" />
          <span className="text-muted-foreground">用户</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="text-muted-foreground">信息源</span>
        </div>
      </div>

      {/* 统计信息 */}
      <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-secondary/80 backdrop-blur rounded-lg px-3 py-2">
        <span>节点: {data.nodes.length}</span>
        <span className="mx-2">|</span>
        <span>边: {data.edges.length}</span>
        <span className="mx-2">|</span>
        <span>缩放: {(zoom * 100).toFixed(0)}%</span>
      </div>
    </div>
  )
}
