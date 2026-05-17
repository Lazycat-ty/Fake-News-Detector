"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { 
  Sparkles,
  ArrowRight,
  Network
} from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-lg text-foreground">Fake News Detector</span>
              <Badge variant="secondary" className="text-xs hidden sm:inline-flex">Beta</Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/80 border border-border text-sm backdrop-blur">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">基于图神经网络的智能检测技术</span>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">New</Badge>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground leading-tight text-balance">
              让虚假信息<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary">无所遁形</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-pretty">
              利用图神经网络分析新闻传播网络结构，结合用户行为特征与信息源可信度，
              实现高精度假新闻自动识别与预警
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 h-12 text-base"
                asChild
              >
                <Link href="/demo">
                  立即体验
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
