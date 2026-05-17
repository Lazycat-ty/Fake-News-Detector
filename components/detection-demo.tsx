"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { 
  AlertTriangle, 
  CheckCircle, 
  Brain, 
  Network, 
  FileSearch, 
  Shield,
  History,
  Trash2,
  Copy,
  ExternalLink,
  Info,
  TrendingUp,
  Users,
  Clock,
  Share2,
  Download,
  FileText,
  BarChart3,
  Check,
  MessageCircle,
  Link2,
  Mail,
  Printer,
  X
} from "lucide-react"

const SAMPLE_NEWS = [
  {
    title: "科学家发现新型超导材料",
    content: "中国科学院物理研究所团队在实验室条件下成功合成了一种新型高温超导材料。该研究成果已发表在《Nature》期刊上，研究表明该材料在-70°C条件下展现出零电阻特性，有望推动超导技术的商业化应用。",
    expected: "real",
  },
  {
    title: "紧急扩散！喝热水能治百病",
    content: "最新研究表明，每天喝8杯热水可以治愈包括癌症在内的所有疾病！某著名专家称这是被医药公司隐藏了多年的秘密，现在终于公开了！请立即转发给你的亲朋好友，救人一命胜造七级浮屠！",
    expected: "fake",
  },
  {
    title: "央行发布最新货币政策",
    content: "中国人民银行今日发布公告，宣布将继续实施稳健的货币政策，保持流动性合理充裕。央行表示，将综合运用多种货币政策工具，保持货币信贷总量适度、节奏平稳，保持流动性合理充裕。",
    expected: "real",
  },
  {
    title: "震惊！这个习惯正在毁掉你",
    content: "你绝对想不到，每天玩手机超过1小时，大脑就会萎缩30%！美国某大学教授亲口证实，现在转发此文章，可以免费获得价值9999元的护脑秘方！不转不是中国人！",
    expected: "fake",
  },
]

interface AnalysisResult {
  score: number
  label: "fake" | "real" | "uncertain"
  confidence: number
  features: {
    name: string
    value: number
    weight: number
    description: string
    indicator: "positive" | "negative" | "neutral"
  }[]
  graphFeatures: {
    propagationPattern: string
    propagationScore: number
    sourceCredibility: number
    userEngagement: string
    engagementScore: number
    botProbability: number
  }
  keywords: string[]
  riskFactors: string[]
  timestamp: number
}

interface HistoryItem {
  id: string
  content: string
  result: AnalysisResult
  timestamp: number
}

function analyzeNews(content: string): Promise<AnalysisResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const hasSensationalWords = /紧急|震惊|扩散|转发|治愈|百病|秘密|立即|绝对|一定|必须|不转不是/.test(content)
      const hasCredibleSource = /央行|研究院|科学院|研究所|大学|发布公告|研究表明|发表在|期刊/.test(content)
      const hasExaggeration = /100%|所有|一切|永远|绝对|必定|肯定/.test(content)
      const hasEmotionalAppeal = /震惊|不敢相信|太可怕|救人|浮屠|免费|价值.*元/.test(content)
      const contentLength = content.length
      const hasLogicalStructure = content.includes("。") && content.split("。").length > 2

      let score = 50

      // 负面因素
      if (hasSensationalWords) score -= 25
      if (hasExaggeration) score -= 15
      if (hasEmotionalAppeal) score -= 20
      
      // 正面因素
      if (hasCredibleSource) score += 20
      if (contentLength > 150) score += 10
      if (hasLogicalStructure) score += 10

      // 添加随机性
      score = Math.max(5, Math.min(95, score + (Math.random() * 10 - 5)))

      const features = [
        {
          name: "内容可信度",
          value: hasCredibleSource ? 0.78 + Math.random() * 0.15 : 0.22 + Math.random() * 0.2,
          weight: 0.25,
          description: hasCredibleSource ? "包含可追溯的权威来源引用" : "缺乏可验证的信息来源",
          indicator: hasCredibleSource ? "positive" as const : "negative" as const,
        },
        {
          name: "情感倾向分析",
          value: hasSensationalWords || hasEmotionalAppeal ? 0.18 + Math.random() * 0.15 : 0.75 + Math.random() * 0.15,
          weight: 0.2,
          description: hasSensationalWords ? "存在煽动性、夸张性用语" : "语言表达客观中立",
          indicator: hasSensationalWords ? "negative" as const : "positive" as const,
        },
        {
          name: "逻辑一致性",
          value: hasLogicalStructure && !hasExaggeration ? 0.72 + Math.random() * 0.2 : 0.35 + Math.random() * 0.2,
          weight: 0.2,
          description: hasLogicalStructure ? "内容结构清晰，逻辑通顺" : "存在逻辑跳跃或自相矛盾",
          indicator: hasLogicalStructure ? "positive" as const : "neutral" as const,
        },
        {
          name: "来源信誉评估",
          value: hasCredibleSource ? 0.82 + Math.random() * 0.1 : 0.28 + Math.random() * 0.15,
          weight: 0.2,
          description: hasCredibleSource ? "来源机构具有较高公信力" : "来源模糊或无法验证",
          indicator: hasCredibleSource ? "positive" as const : "negative" as const,
        },
        {
          name: "传播特征分析",
          value: score > 50 ? 0.65 + Math.random() * 0.2 : 0.3 + Math.random() * 0.2,
          weight: 0.15,
          description: score > 50 ? "传播模式符合自然扩散规律" : "传播模式存在异常特征",
          indicator: score > 50 ? "positive" as const : "negative" as const,
        },
      ]

      const riskFactors: string[] = []
      if (hasSensationalWords) riskFactors.push("包含煽动性词汇")
      if (hasExaggeration) riskFactors.push("存在绝对化表述")
      if (hasEmotionalAppeal) riskFactors.push("情感操控倾向")
      if (!hasCredibleSource) riskFactors.push("缺乏权威来源")
      if (contentLength < 100) riskFactors.push("内容过于简短")

      const keywords: string[] = []
      const keywordPatterns = [
        /研究|科学|实验|发现|证实/g,
        /政策|公告|发布|宣布/g,
        /紧急|震惊|扩散|转发/g,
      ]
      keywordPatterns.forEach(pattern => {
        const matches = content.match(pattern)
        if (matches) keywords.push(...matches.slice(0, 3))
      })

      resolve({
        score,
        label: score > 65 ? "real" : score < 40 ? "fake" : "uncertain",
        confidence: Math.abs(score - 50) * 2,
        features,
        graphFeatures: {
          propagationPattern: score > 50 ? "自然扩散模式" : "异常病毒式传播",
          propagationScore: score > 50 ? 75 + Math.random() * 20 : 20 + Math.random() * 30,
          sourceCredibility: hasCredibleSource ? 80 + Math.random() * 15 : 20 + Math.random() * 25,
          userEngagement: score > 50 ? "正常用户主导" : "可疑账号参与度高",
          engagementScore: score > 50 ? 70 + Math.random() * 25 : 25 + Math.random() * 30,
          botProbability: score > 50 ? 5 + Math.random() * 15 : 45 + Math.random() * 40,
        },
        keywords: [...new Set(keywords)].slice(0, 5),
        riskFactors,
        timestamp: Date.now(),
      })
    }, 2500)
  })
}

export function DetectionDemo() {
  const [content, setContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [step, setStep] = useState(0)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeResultTab, setActiveResultTab] = useState("overview")
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [activeReportTab, setActiveReportTab] = useState("summary")
  const progressRef = useRef<number>(0)

  // 加载历史记录
  useEffect(() => {
    const saved = localStorage.getItem("detection-history")
    if (saved) {
      try {
        setHistory(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
  }, [])

  // 保存历史记录
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem("detection-history", JSON.stringify(history.slice(0, 10)))
    }
  }, [history])

  const handleAnalyze = async () => {
    if (!content.trim()) return

    setIsAnalyzing(true)
    setResult(null)
    setStep(1)
    progressRef.current = 0

    // 模拟进度
    const progressInterval = setInterval(() => {
      progressRef.current = Math.min(progressRef.current + Math.random() * 15, 90)
    }, 200)

    await new Promise((r) => setTimeout(r, 800))
    setStep(2)
    await new Promise((r) => setTimeout(r, 800))
    setStep(3)
    await new Promise((r) => setTimeout(r, 600))
    setStep(4)

    const analysisResult = await analyzeNews(content)
    
    clearInterval(progressInterval)
    progressRef.current = 100

    setResult(analysisResult)
    setIsAnalyzing(false)
    setStep(0)
    setActiveResultTab("overview")

    // 添加到历史
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      content: content.slice(0, 100) + (content.length > 100 ? "..." : ""),
      result: analysisResult,
      timestamp: Date.now(),
    }
    setHistory(prev => [historyItem, ...prev.slice(0, 9)])
  }

  const loadSample = (index: number) => {
    setContent(SAMPLE_NEWS[index].title + "\n\n" + SAMPLE_NEWS[index].content)
    setResult(null)
  }

  const loadFromHistory = (item: HistoryItem) => {
    setContent(item.content)
    setResult(item.result)
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("detection-history")
  }

  const copyResult = () => {
    if (!result) return
    const text = `检测结果: ${result.label === "fake" ? "疑似虚假" : result.label === "real" ? "可信度较高" : "需进一步验证"}\n置信度: ${result.confidence.toFixed(1)}%\n可信度评分: ${result.score.toFixed(1)}%`
    navigator.clipboard.writeText(text)
  }

  const getStepProgress = () => {
    if (!isAnalyzing) return 0
    return progressRef.current
  }

  // 生成详细报告文本
  const generateReportText = () => {
    if (!result) return ""
    const labelText = result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需要进一步验证"
    const date = new Date(result.timestamp).toLocaleString("zh-CN")
    
    let report = `====== Fake News Detector 检测报告 ======\n`
    report += `生成时间: ${date}\n`
    report += `报告编号: RPT-${result.timestamp}\n\n`
    report += `【检测结论】\n`
    report += `判定结果: ${labelText}\n`
    report += `置信度: ${result.confidence.toFixed(1)}%\n`
    report += `可信度评分: ${result.score.toFixed(1)}/100\n\n`
    report += `【检测内容】\n${content.slice(0, 200)}${content.length > 200 ? '...' : ''}\n\n`
    report += `【特征分析】\n`
    result.features.forEach(f => {
      report += `- ${f.name}: ${(f.value * 100).toFixed(0)}% (${f.description})\n`
    })
    report += `\n【图谱分析】\n`
    report += `- 传播模式: ${result.graphFeatures.propagationPattern}\n`
    report += `- 来源信誉: ${result.graphFeatures.sourceCredibility.toFixed(0)}%\n`
    report += `- 用户参与: ${result.graphFeatures.userEngagement}\n`
    report += `- 机器人概率: ${result.graphFeatures.botProbability.toFixed(0)}%\n\n`
    if (result.riskFactors.length > 0) {
      report += `【风险因素】\n`
      result.riskFactors.forEach(r => {
        report += `- ${r}\n`
      })
    }
    report += `\n====== 报告结束 ======\n`
    report += `由 Fake News Detector 系统自动生成`
    
    return report
  }

  // 下载报告
  const downloadReport = (format: "txt" | "json") => {
    if (!result) return
    
    let content: string
    let filename: string
    let mimeType: string
    
    if (format === "txt") {
      content = generateReportText()
      filename = `detection-report-${result.timestamp}.txt`
      mimeType = "text/plain"
    } else {
      const reportData = {
        reportId: `RPT-${result.timestamp}`,
        generatedAt: new Date(result.timestamp).toISOString(),
        content: content.slice(0, 500),
        result: {
          label: result.label,
          labelText: result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需要进一步验证",
          confidence: result.confidence,
          score: result.score,
        },
        features: result.features,
        graphFeatures: result.graphFeatures,
        keywords: result.keywords,
        riskFactors: result.riskFactors,
      }
      content = JSON.stringify(reportData, null, 2)
      filename = `detection-report-${result.timestamp}.json`
      mimeType = "application/json"
    }
    
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // 打印报告
  const printReport = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow || !result) return
    
    const labelText = result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需要进一步验证"
    const labelColor = result.label === "fake" ? "#ef4444" : result.label === "real" ? "#10b981" : "#8b5cf6"
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fake News Detector 检测报告</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          h1 { color: #1f2937; border-bottom: 2px solid #8b5cf6; padding-bottom: 10px; }
          h2 { color: #374151; margin-top: 24px; font-size: 16px; }
          .meta { color: #6b7280; font-size: 14px; margin-bottom: 24px; }
          .result-box { padding: 20px; border-radius: 8px; margin: 20px 0; }
          .result-label { font-size: 24px; font-weight: bold; margin-bottom: 8px; }
          .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .card { padding: 16px; background: #f9fafb; border-radius: 8px; }
          .card-title { font-size: 12px; color: #6b7280; margin-bottom: 4px; }
          .card-value { font-size: 18px; font-weight: 600; color: #1f2937; }
          .feature-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .risk-tag { display: inline-block; background: #fef2f2; color: #dc2626; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin: 2px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <h1>Fake News Detector 检测报告</h1>
        <div class="meta">
          报告编号: RPT-${result.timestamp}<br>
          生成时间: ${new Date(result.timestamp).toLocaleString("zh-CN")}
        </div>
        
        <div class="result-box" style="background: ${labelColor}15; border: 1px solid ${labelColor}50;">
          <div class="result-label" style="color: ${labelColor};">${labelText}</div>
          <div style="color: #374151;">
            置信度: ${result.confidence.toFixed(1)}% | 可信度评分: ${result.score.toFixed(1)}/100
          </div>
        </div>
        
        <h2>检测内容</h2>
        <div style="background: #f9fafb; padding: 16px; border-radius: 8px; color: #374151;">
          ${content.slice(0, 300)}${content.length > 300 ? '...' : ''}
        </div>
        
        <h2>特征分析</h2>
        <div>
          ${result.features.map(f => `
            <div class="feature-item">
              <span>${f.name}</span>
              <span style="font-weight: 600;">${(f.value * 100).toFixed(0)}%</span>
            </div>
          `).join('')}
        </div>
        
        <h2>图谱分析</h2>
        <div class="grid">
          <div class="card">
            <div class="card-title">传播模式</div>
            <div class="card-value">${result.graphFeatures.propagationPattern}</div>
          </div>
          <div class="card">
            <div class="card-title">来源信誉</div>
            <div class="card-value">${result.graphFeatures.sourceCredibility.toFixed(0)}%</div>
          </div>
          <div class="card">
            <div class="card-title">用户参与</div>
            <div class="card-value">${result.graphFeatures.userEngagement}</div>
          </div>
          <div class="card">
            <div class="card-title">机器人概率</div>
            <div class="card-value">${result.graphFeatures.botProbability.toFixed(0)}%</div>
          </div>
        </div>
        
        ${result.riskFactors.length > 0 ? `
          <h2>风险因素</h2>
          <div>
            ${result.riskFactors.map(r => `<span class="risk-tag">${r}</span>`).join('')}
          </div>
        ` : ''}
        
        <div class="footer">
          本报告由 Fake News Detector 系统基于图神经网络技术自动生成，仅供参考。
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // 复制分享链接
  const copyShareLink = () => {
    if (!result) return
    const shareData = encodeURIComponent(JSON.stringify({
      label: result.label,
      score: result.score.toFixed(1),
      confidence: result.confidence.toFixed(1),
    }))
    const shareUrl = `${window.location.origin}?share=${shareData}`
    navigator.clipboard.writeText(shareUrl)
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  // 分享到社交平台
  const shareToSocial = (platform: string) => {
    if (!result) return
    const labelText = result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需进一步验证"
    const shareText = `我使用 Fake News Detector 检测了一条新闻，结果显示：${labelText}（置信度 ${result.confidence.toFixed(1)}%）`
    const shareUrl = window.location.origin
    
    let url = ""
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case "weibo":
        url = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        break
      case "email":
        url = `mailto:?subject=${encodeURIComponent("Fake News Detector 检测结果")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`
        break
    }
    
    if (url) {
      window.open(url, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 输入区域 */}
        <div className="space-y-4">
          <Card className="bg-card/50 backdrop-blur border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileSearch className="w-5 h-5 text-primary" />
                新闻内容检测
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="在此输入或粘贴需要检测的新闻内容...&#10;&#10;支持输入新闻标题和正文，系统将自动分析文本特征、传播模式和来源可信度。"
                className="min-h-[200px] bg-input border-border text-foreground placeholder:text-muted-foreground resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">选择示例新闻:</span>
                  <span className="text-xs text-muted-foreground">{content.length} 字</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_NEWS.map((news, i) => (
                    <button
                      key={i}
                      onClick={() => loadSample(i)}
                      className={`text-xs px-2.5 py-1.5 rounded-md transition-colors ${
                        news.expected === "fake" 
                          ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/20" 
                          : "bg-accent/10 text-accent hover:bg-accent/20 border border-accent/20"
                      }`}
                    >
                      {news.title.slice(0, 12)}...
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !content.trim()}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner className="w-4 h-4 mr-2" />
                    正在分析中...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    开始智能检测
                  </>
                )}
              </Button>

              {/* 分析进度 */}
              {isAnalyzing && (
                <div className="space-y-3 pt-2 p-4 rounded-lg bg-secondary/50 border border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground font-medium">分析进度</span>
                    <span className="text-muted-foreground">{Math.round(getStepProgress())}%</span>
                  </div>
                  <Progress value={getStepProgress()} className="h-2" />
                  
                  <div className="space-y-2 mt-3">
                    {[
                      { step: 1, label: "文本特征提取", desc: "分析语义、情感、关键词" },
                      { step: 2, label: "构建传播图谱", desc: "建立用户-新闻-来源关系图" },
                      { step: 3, label: "图神经网络推理", desc: "消息传递与节点嵌入" },
                      { step: 4, label: "生成检测报告", desc: "综合评估与风险分析" },
                    ].map((item) => (
                      <div 
                        key={item.step}
                        className={`flex items-start gap-3 ${step >= item.step ? "text-primary" : "text-muted-foreground"}`}
                      >
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          step > item.step 
                            ? "bg-primary text-primary-foreground" 
                            : step === item.step 
                              ? "bg-primary/20 text-primary border border-primary animate-pulse" 
                              : "bg-secondary text-muted-foreground"
                        }`}>
                          {step > item.step ? "✓" : item.step}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs opacity-70">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 检测历史 */}
          {history.length > 0 && (
            <Card className="bg-card/50 backdrop-blur border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-foreground text-base">
                    <History className="w-4 h-4 text-primary" />
                    检测历史
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearHistory} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {history.slice(0, 5).map((item) => (
                  <button
                    key={item.id}
                    onClick={() => loadFromHistory(item)}
                    className="w-full text-left p-2 rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-3"
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      item.result.label === "fake" ? "bg-destructive" : item.result.label === "real" ? "bg-accent" : "bg-primary"
                    }`} />
                    <span className="text-sm text-foreground flex-1 truncate">{item.content}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* 结果区域 */}
        <Card className="bg-card/50 backdrop-blur border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-primary" />
                检测结果
              </CardTitle>
              {result && (
                <Button variant="ghost" size="sm" onClick={copyResult} className="text-muted-foreground">
                  <Copy className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                {/* 主要结果 */}
                <div
                  className={`p-4 rounded-lg border ${
                    result.label === "fake"
                      ? "bg-destructive/10 border-destructive/50"
                      : result.label === "real"
                        ? "bg-accent/10 border-accent/50"
                        : "bg-primary/10 border-primary/50"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {result.label === "fake" ? (
                      <div className="w-14 h-14 rounded-full bg-destructive/20 flex items-center justify-center">
                        <AlertTriangle className="w-7 h-7 text-destructive" />
                      </div>
                    ) : result.label === "real" ? (
                      <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center">
                        <CheckCircle className="w-7 h-7 text-accent" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                        <Info className="w-7 h-7 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-xl font-bold text-foreground">
                        {result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需要进一步验证"}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          置信度: <span className="text-foreground font-medium">{result.confidence.toFixed(1)}%</span>
                        </span>
                        <span className="text-sm text-muted-foreground">
                          评分: <span className="text-foreground font-medium">{result.score.toFixed(1)}/100</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 关键词和风险因素 */}
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((keyword, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                  {result.riskFactors.map((factor, i) => (
                    <Badge key={i} variant="destructive" className="text-xs">
                      {factor}
                    </Badge>
                  ))}
                </div>

                {/* 详细结果标签页 */}
                <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="mt-4">
                  <TabsList className="w-full bg-secondary border border-border">
                    <TabsTrigger value="overview" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                      特征分析
                    </TabsTrigger>
                    <TabsTrigger value="graph" className="flex-1 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs">
                      图谱分析
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="mt-4 space-y-3">
                    {result.features.map((feature, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground flex items-center gap-2">
                            {feature.name}
                            <span className={`w-2 h-2 rounded-full ${
                              feature.indicator === "positive" ? "bg-accent" : 
                              feature.indicator === "negative" ? "bg-destructive" : "bg-primary"
                            }`} />
                          </span>
                          <span className="text-foreground font-medium">{(feature.value * 100).toFixed(0)}%</span>
                        </div>
                        <Progress
                          value={feature.value * 100}
                          className={`h-2 ${
                            feature.indicator === "positive" ? "[&>div]:bg-accent" : 
                            feature.indicator === "negative" ? "[&>div]:bg-destructive" : ""
                          }`}
                        />
                        <p className="text-xs text-muted-foreground">{feature.description}</p>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="graph" className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Share2 className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">传播模式</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{result.graphFeatures.propagationPattern}</p>
                        <div className="mt-2">
                          <Progress value={result.graphFeatures.propagationScore} className="h-1.5" />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">来源信誉</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{result.graphFeatures.sourceCredibility.toFixed(0)}%</p>
                        <div className="mt-2">
                          <Progress value={result.graphFeatures.sourceCredibility} className="h-1.5" />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">用户参与</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{result.graphFeatures.userEngagement}</p>
                        <div className="mt-2">
                          <Progress value={result.graphFeatures.engagementScore} className="h-1.5" />
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span className="text-xs text-muted-foreground">机器人概率</span>
                        </div>
                        <p className={`text-sm font-medium ${result.graphFeatures.botProbability > 50 ? "text-destructive" : "text-foreground"}`}>
                          {result.graphFeatures.botProbability.toFixed(0)}%
                        </p>
                        <div className="mt-2">
                          <Progress 
                            value={result.graphFeatures.botProbability} 
                            className={`h-1.5 ${result.graphFeatures.botProbability > 50 ? "[&>div]:bg-destructive" : ""}`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <Network className="w-4 h-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">GNN 分析说明</p>
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            图神经网络通过分析新闻在社交网络中的传播路径、用户交互模式和信息源关系，
                            识别出与虚假信息传播相关的异常模式。上述指标基于多层图注意力网络的节点嵌入计算得出。
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                {/* 操作按钮 */}
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-border"
                    onClick={() => setShowReportDialog(true)}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    查看详细报告
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-border"
                    onClick={() => setShowShareDialog(true)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享结果
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
                <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
                  <Network className="w-10 h-10 opacity-30" />
                </div>
                <p className="text-center font-medium text-foreground">等待检测</p>
                <p className="text-center text-sm mt-2 max-w-[280px]">
                  输入新闻内容后点击检测按钮，系统将使用图神经网络分析新闻的真实性
                </p>
                <div className="mt-6 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Brain className="w-4 h-4" />
                    <span>深度学习</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Network className="w-4 h-4" />
                    <span>图神经网络</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    <span>多维分析</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 详细报告弹窗 */}
      <Dialog open={showReportDialog} onOpenChange={setShowReportDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <FileText className="w-5 h-5 text-primary" />
              检测报告详情
            </DialogTitle>
          </DialogHeader>
          
          {result && (
            <div className="flex-1 overflow-y-auto space-y-6 pr-2">
              {/* 报告头部 */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
                <div>
                  <p className="text-xs text-muted-foreground">报告编号</p>
                  <p className="text-sm font-mono text-foreground">RPT-{result.timestamp}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">生成时间</p>
                  <p className="text-sm text-foreground">{new Date(result.timestamp).toLocaleString("zh-CN")}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => downloadReport("txt")} className="border-border">
                    <Download className="w-4 h-4 mr-1" />
                    TXT
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => downloadReport("json")} className="border-border">
                    <Download className="w-4 h-4 mr-1" />
                    JSON
                  </Button>
                  <Button variant="outline" size="sm" onClick={printReport} className="border-border">
                    <Printer className="w-4 h-4 mr-1" />
                    打印
                  </Button>
                </div>
              </div>

              {/* 报告标签页 */}
              <Tabs value={activeReportTab} onValueChange={setActiveReportTab}>
                <TabsList className="bg-secondary border border-border">
                  <TabsTrigger value="summary" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    摘要
                  </TabsTrigger>
                  <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    特征详情
                  </TabsTrigger>
                  <TabsTrigger value="graph" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    图谱详情
                  </TabsTrigger>
                  <TabsTrigger value="raw" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    原始数据
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="mt-4 space-y-4">
                  {/* 检测结论 */}
                  <div className={`p-6 rounded-lg border ${
                    result.label === "fake"
                      ? "bg-destructive/10 border-destructive/50"
                      : result.label === "real"
                        ? "bg-accent/10 border-accent/50"
                        : "bg-primary/10 border-primary/50"
                  }`}>
                    <div className="flex items-center gap-6">
                      {result.label === "fake" ? (
                        <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center">
                          <AlertTriangle className="w-10 h-10 text-destructive" />
                        </div>
                      ) : result.label === "real" ? (
                        <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-accent" />
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                          <Info className="w-10 h-10 text-primary" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-2xl font-bold text-foreground">
                          {result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需要进一步验证"}
                        </p>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <div>
                            <p className="text-xs text-muted-foreground">置信度</p>
                            <p className="text-xl font-bold text-foreground">{result.confidence.toFixed(1)}%</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">可信度评分</p>
                            <p className="text-xl font-bold text-foreground">{result.score.toFixed(1)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">风险等级</p>
                            <p className={`text-xl font-bold ${
                              result.label === "fake" ? "text-destructive" : result.label === "real" ? "text-accent" : "text-primary"
                            }`}>
                              {result.label === "fake" ? "高风险" : result.label === "real" ? "低风险" : "中等风险"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 检测内容 */}
                  <div>
                    <h3 className="text-sm font-medium text-foreground mb-2">检测内容</h3>
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                    </div>
                  </div>

                  {/* 关键词和风险因素 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">提取关键词</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.keywords.length > 0 ? result.keywords.map((keyword, i) => (
                          <Badge key={i} variant="secondary">{keyword}</Badge>
                        )) : (
                          <span className="text-sm text-muted-foreground">未提取到关键词</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-foreground mb-2">风险因素</h3>
                      <div className="flex flex-wrap gap-2">
                        {result.riskFactors.length > 0 ? result.riskFactors.map((factor, i) => (
                          <Badge key={i} variant="destructive">{factor}</Badge>
                        )) : (
                          <span className="text-sm text-muted-foreground">未发现明显风险因素</span>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="features" className="mt-4 space-y-4">
                  <div className="space-y-4">
                    {result.features.map((feature, i) => (
                      <div key={i} className="p-4 rounded-lg bg-secondary/50 border border-border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${
                              feature.indicator === "positive" ? "bg-accent" : 
                              feature.indicator === "negative" ? "bg-destructive" : "bg-primary"
                            }`} />
                            <span className="font-medium text-foreground">{feature.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">权重: {(feature.weight * 100).toFixed(0)}%</span>
                            <span className="text-lg font-bold text-foreground">{(feature.value * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <Progress
                          value={feature.value * 100}
                          className={`h-3 mb-3 ${
                            feature.indicator === "positive" ? "[&>div]:bg-accent" : 
                            feature.indicator === "negative" ? "[&>div]:bg-destructive" : ""
                          }`}
                        />
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${
                              feature.indicator === "positive" 
                                ? "bg-accent/20 text-accent" 
                                : feature.indicator === "negative"
                                  ? "bg-destructive/20 text-destructive"
                                  : "bg-primary/20 text-primary"
                            }`}>
                              {feature.indicator === "positive" ? "正面指标" : feature.indicator === "negative" ? "负面指标" : "中性指标"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              贡献评分: {(feature.value * feature.weight * 100).toFixed(1)} 分
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="text-sm font-medium text-foreground mb-2">特征分析说明</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      特征分析基于自然语言处理技术，从内容可信度、情感倾向、逻辑一致性、来源信誉和传播特征五个维度进行综合评估。
                      每个特征的权重根据历史数据和模型训练结果动态调整，最终综合得出可信度评分。
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="graph" className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Share2 className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">传播模式分析</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">模式类型</span>
                          <span className="text-sm font-medium text-foreground">{result.graphFeatures.propagationPattern}</span>
                        </div>
                        <Progress value={result.graphFeatures.propagationScore} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {result.graphFeatures.propagationScore > 60 
                            ? "传播路径呈现自然的多级扩散，符合真实信息传播特征。"
                            : "传播呈现异常的爆发式增长，存在人为操控或机器人传播的可能。"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">来源信誉评估</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">信誉评分</span>
                          <span className="text-sm font-medium text-foreground">{result.graphFeatures.sourceCredibility.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.graphFeatures.sourceCredibility} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {result.graphFeatures.sourceCredibility > 60
                            ? "信息来源具有较高的历史可信度和权威性。"
                            : "信息来源可信度较低，缺乏权威背书或历史记录不佳。"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">用户参与分析</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">参与类型</span>
                          <span className="text-sm font-medium text-foreground">{result.graphFeatures.userEngagement}</span>
                        </div>
                        <Progress value={result.graphFeatures.engagementScore} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {result.graphFeatures.engagementScore > 60
                            ? "参与用户主要为正常活跃账号，互动模式自然。"
                            : "存在大量新注册或低活跃度账号参与，互动模式异常。"
                          }
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-lg bg-secondary/50 border border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        <span className="font-medium text-foreground">机器人检测</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">机器人概率</span>
                          <span className={`text-sm font-medium ${result.graphFeatures.botProbability > 50 ? "text-destructive" : "text-foreground"}`}>
                            {result.graphFeatures.botProbability.toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={result.graphFeatures.botProbability} 
                          className={`h-2 ${result.graphFeatures.botProbability > 50 ? "[&>div]:bg-destructive" : ""}`}
                        />
                        <p className="text-xs text-muted-foreground">
                          {result.graphFeatures.botProbability < 30
                            ? "传播网络中机器人账号占比极低，为正常传播。"
                            : result.graphFeatures.botProbability < 60
                              ? "检测到部分可疑账号，需进一步关注。"
                              : "存在大量机器人账号参与传播，高度可疑。"
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="text-sm font-medium text-foreground mb-2">图神经网络分析原理</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      系统使用图注意力网络（GAT）对社交媒体传播图谱进行建模。节点包括新闻、用户和信息源，
                      边表示传播、评论和引用关系。通过多层消息传递机制，模型学习每个节点的嵌入表示，
                      最终通过分类器判断新闻的真实性。传播模式、来源信誉和用户参与等指标均从节点嵌入中提取。
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="raw" className="mt-4">
                  <div className="p-4 rounded-lg bg-secondary/50 border border-border font-mono text-xs overflow-auto max-h-[400px]">
                    <pre className="text-muted-foreground whitespace-pre-wrap">
{JSON.stringify({
  reportId: `RPT-${result.timestamp}`,
  timestamp: result.timestamp,
  isoTime: new Date(result.timestamp).toISOString(),
  detection: {
    label: result.label,
    score: result.score,
    confidence: result.confidence,
  },
  content: {
    text: content.slice(0, 200) + (content.length > 200 ? '...' : ''),
    length: content.length,
    keywords: result.keywords,
  },
  features: result.features.map(f => ({
    name: f.name,
    value: f.value,
    weight: f.weight,
    indicator: f.indicator,
  })),
  graphAnalysis: result.graphFeatures,
  riskFactors: result.riskFactors,
  modelInfo: {
    version: "2.1.0",
    architecture: "GAT-BiLSTM",
    lastUpdate: "2024-01-15",
  }
}, null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 分享结果弹窗 */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-foreground">
              <Share2 className="w-5 h-5 text-primary" />
              分享检测结果
            </DialogTitle>
          </DialogHeader>
          
          {result && (
            <div className="space-y-6">
              {/* 分享预览卡片 */}
              <div className={`p-4 rounded-lg border ${
                result.label === "fake"
                  ? "bg-destructive/10 border-destructive/30"
                  : result.label === "real"
                    ? "bg-accent/10 border-accent/30"
                    : "bg-primary/10 border-primary/30"
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  {result.label === "fake" ? (
                    <AlertTriangle className="w-8 h-8 text-destructive" />
                  ) : result.label === "real" ? (
                    <CheckCircle className="w-8 h-8 text-accent" />
                  ) : (
                    <Info className="w-8 h-8 text-primary" />
                  )}
                  <div>
                    <p className="font-bold text-foreground">
                      {result.label === "fake" ? "疑似虚假新闻" : result.label === "real" ? "可信度较高" : "需进一步验证"}
                    </p>
                    <p className="text-sm text-muted-foreground">置信度 {result.confidence.toFixed(1)}%</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {content.slice(0, 80)}{content.length > 80 ? '...' : ''}
                </p>
              </div>

              {/* 复制链接 */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">复制分享链接</h4>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border text-sm text-muted-foreground truncate">
                    {window.location.origin}/?share=...
                  </div>
                  <Button onClick={copyShareLink} variant="outline" className="border-border">
                    {copySuccess ? <Check className="w-4 h-4 text-accent" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                {copySuccess && (
                  <p className="text-xs text-accent mt-2">链接已复制到剪贴板</p>
                )}
              </div>

              {/* 社交平台分享 */}
              <div>
                <h4 className="text-sm font-medium text-foreground mb-3">分享到社交平台</h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => shareToSocial("weibo")}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <MessageCircle className="w-6 h-6 text-foreground" />
                    <span className="text-xs text-muted-foreground">微博</span>
                  </button>
                  <button
                    onClick={() => shareToSocial("email")}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <Mail className="w-6 h-6 text-foreground" />
                    <span className="text-xs text-muted-foreground">邮件</span>
                  </button>
                  <button
                    onClick={copyShareLink}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <Link2 className="w-6 h-6 text-foreground" />
                    <span className="text-xs text-muted-foreground">复制链接</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
