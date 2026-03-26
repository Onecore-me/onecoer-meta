#!/bin/bash
set -e

cd /workspace/onecore

# Create component files
cat > components/Navbar.tsx << 'NAVTYPESCRIPT'
'use client'

import { Menu, X, User, Settings, LogOut } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-xl font-bold text-white">O</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              OneCore
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-300 hover:text-white transition-colors">首页</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">探索</a>
            <a href="#" className="text-slate-300 hover:text-white transition-colors">创建主页</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:block px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg font-medium transition-all">
              创建主页
            </button>
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan" alt="Profile" className="w-full h-full rounded-full bg-surface" />
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-card rounded-lg transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col gap-2">
              <a href="#" className="px-4 py-2 hover:bg-card rounded-lg">首页</a>
              <a href="#" className="px-4 py-2 hover:bg-card rounded-lg">探索</a>
              <a href="#" className="px-4 py-2 hover:bg-card rounded-lg">创建主页</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
NAVBEAR

cat > components/ProfileCard.tsx << 'PROFILETYPESCRIPT'
import { Shield, Award, Users } from 'lucide-react'

interface User {
  name: string
  username: string
  avatar: string
  bio: string
  isVerified: boolean
  verifyLevel: string
  stats: {
    followers: number
    works: number
    platforms: number
  }
}

export default function ProfileCard({ user }: { user: User }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface to-card border border-slate-700 p-8">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-2xl object-cover ring-4 ring-primary/30" />
          {user.isVerified && (
            <div className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
              <Shield className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            {user.verifyLevel === 'advanced' && (
              <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium flex items-center gap-1">
                <Award size={14} /> 实名认证
              </span>
            )}
          </div>
          <p className="text-slate-400 mb-4">@{user.username}</p>
          <p className="text-lg mb-6">{user.bio}</p>
          <div className="flex justify-center md:justify-start gap-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{(user.stats.followers / 1000).toFixed(1)}K</div>
              <div className="text-sm text-slate-400">粉丝</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{user.stats.works}</div>
              <div className="text-sm text-slate-400">作品</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{user.stats.platforms}</div>
              <div className="text-sm text-slate-400">平台</div>
            </div>
          </div>
        </div>
        <button className="px-6 py-3 bg-primary hover:bg-primary/90 rounded-xl font-medium transition-all shadow-lg shadow-primary/30">
          编辑资料
        </button>
      </div>
    </div>
  )
}
PROFILETYPESCRIPT

cat > components/PlatformLinks.tsx << 'PLATFORMTYPESCRIPT'
import { CheckCircle, ExternalLink, AlertCircle } from 'lucide-react'

const platformIcons: Record<string, string> = {
  douyin: '🎵',
  xiaohongshu: '📕',
  bilibili: '📺',
  weibo: '📡',
  youtube: '▶️',
  github: '💻',
}

const platformColors: Record<string, string> = {
  douyin: 'hover:border-pink-500 hover:bg-pink-500/10',
  xiaohongshu: 'hover:border-red-500 hover:bg-red-500/10',
  bilibili: 'hover:border-blue-500 hover:bg-blue-500/10',
  weibo: 'hover:border-orange-500 hover:bg-orange-500/10',
  youtube: 'hover:border-red-600 hover:bg-red-600/10',
  github: 'hover:border-slate-400 hover:bg-slate-400/10',
}

interface Platform {
  id: string
  platform: string
  name: string
  handle: string
  followers: number
  isConnected: boolean
}

export default function PlatformLinks({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="bg-surface rounded-2xl border border-slate-700 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📱</span> 平台账号
        </h2>
        <button className="text-primary hover:text-primary/80 text-sm font-medium transition-colors">
          + 添加平台
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {platforms.map((p) => (
          <a
            key={p.id}
            href="#"
            className={`group relative p-4 rounded-xl border border-slate-700 bg-card/50 transition-all ${platformColors[p.platform] || ''}`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{platformIcons[p.platform] || '🌐'}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-xs text-slate-400 truncate">{p.handle}</div>
              </div>
              {p.isConnected ? (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              )}
            </div>
            <div className="text-sm text-slate-400">
              {(p.followers / 1000).toFixed(1)}K 粉丝
            </div>
            <ExternalLink className="absolute top-2 right-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
          </a>
        ))}
      </div>
    </div>
  )
}
PLATFORMTYPESCRIPT

cat > components/WorksSection.tsx << 'WORKSTYPESCRIPT'
import { Eye, ExternalLink } from 'lucide-react'

const typeIcons: Record<string, string> = {
  video: '📹',
  article: '📝',
  novel: '📚',
  course: '🎓',
}

interface Work {
  id: string
  type: string
  title: string
  platform: string
  summary: string
  url: string
  cover: string
  views: number
}

export default function WorksSection({ works }: { works: Work[] }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📚</span> 作品展示
        </h2>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium">全部</button>
          <button className="px-4 py-2 bg-surface text-slate-400 rounded-lg text-sm">图文</button>
          <button className="px-4 py-2 bg-surface text-slate-400 rounded-lg text-sm">视频</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {works.map((work) => (
          <a
            key={work.id}
            href={work.url}
            className="group bg-surface rounded-2xl border border-slate-700 overflow-hidden hover:border-primary/50 transition-all"
          >
            <div className="relative aspect-video">
              <img src={work.cover} alt={work.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute top-3 left-3 px-3 py-1 bg-black/50 backdrop-blur rounded-full text-sm flex items-center gap-1">
                <span>{typeIcons[work.type]}</span>
                <span className="capitalize">{work.platform}</span>
              </div>
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-sm text-slate-300">
                <Eye size={14} />
                {work.views.toLocaleString()}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">{work.title}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">{work.summary}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
WORKSTYPESCRIPT

cat > components/AIChatWidget.tsx << 'AICHATTYPESCRIPT'
'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const quickQuestions = [
  '分析我的账号健康度',
  '帮我想10个爆款标题',
  '制定本周内容计划',
  '对比竞品数据',
]

export default function AIChatWidget() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '你好！我是你的AI运营助手。我可以帮你分析账号数据、生成内容创意、制定运营策略。有什么我可以帮你的？' }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        '根据你的账号数据，我建议优化发布时间的分布，周末下午3-5点效果最好。',
        '我帮你分析了最近的爆款内容，发现生活类、干货类视频互动率最高。',
        '好的，我来帮你制定一个内容日历...',
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <div className="bg-surface rounded-2xl border border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-700 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold">AI 运营助手</h3>
          <p className="text-xs text-emerald-400">在线</p>
        </div>
      </div>
      
      <div className="h-80 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-card'}`}>
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-card rounded-2xl px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
              <span className="text-sm text-slate-400">思考中...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-slate-700">
        <div className="flex flex-wrap gap-2 mb-3">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="px-3 py-1 bg-card hover:bg-primary/20 rounded-full text-xs transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入你的问题..."
            className="flex-1 bg-card rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-3 bg-primary hover:bg-primary/90 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
AICHATTYPESCRIPT

cat > components/ContactSection.tsx << 'CONTACTTYPESCRIPT'
import { Mail, MessageCircle, Globe, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const contacts = [
    { type: 'email', label: '邮箱', value: 'hello@onecore.app', icon: Mail },
    { type: 'wechat', label: '微信', value: 'onecore_lab', icon: MessageCircle },
    { type: 'website', label: '网站', value: 'https://onecore.app', icon: Globe },
  ]

  return (
    <div className="bg-surface rounded-2xl border border-slate-700 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>📞</span> 联系方式
      </h2>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div
            key={contact.type}
            className="flex items-center justify-between p-4 bg-card/50 rounded-xl hover:bg-card transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <contact.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-slate-400">{contact.label}</div>
                <div className="font-medium">{contact.value}</div>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(contact.value, contact.type)}
              className="p-2 hover:bg-surface rounded-lg transition-colors"
            >
              {copied === contact.type ? (
                <Check className="w-5 h-5 text-emerald-500" />
              ) : (
                <Copy className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <p className="text-sm text-center">
          💡 商务合作、品牌联名，欢迎扫码添加助手微信
        </p>
      </div>
    </div>
  )
}
CONTACTTYPESCRIPT

cat > lib/utils.ts << 'UTILSTYPESCRIPT'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  const intervals = [
    { label: '年', seconds: 31536000 },
    { label: '月', seconds: 2592000 },
    { label: '天', seconds: 86400 },
    { label: '小时', seconds: 3600 },
    { label: '分钟', seconds: 60 },
  ]
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count}${interval.label}前`
    }
  }
  return '刚刚'
}
UTILSTYPESCRIPT

echo "Components created successfully!"
