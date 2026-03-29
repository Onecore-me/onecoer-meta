'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Send, Bot, User, Lightbulb, Zap, TrendingUp, FileText, AlertCircle } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  usage?: { prompt_tokens: number; completion_tokens: number } | null
}

const quickActions = [
  { icon: TrendingUp, label: '账号健康分析', prompt: '分析我的账号健康度，给出优化建议' },
  { icon: Zap, label: '爆款标题生成', prompt: '帮我想10个适合自媒体的爆款标题' },
  { icon: FileText, label: '内容策划', prompt: '帮我制定本周的内容发布计划' },
  { icon: Lightbulb, label: '平台选择建议', prompt: '我应该重点运营哪些平台？为什么？' },
]

export default function AIPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 你好！我是 OneCore AI 运营助手。\n\n我可以帮你：\n• 分析账号健康度\n• 生成爆款内容标题\n• 制定运营策略\n• 解答平台运营问题\n\n选择一个快捷问题，或直接输入你的问题！',
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return

    const userMsg: Message = { role: 'user', content: trimmed }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setError('')
    setIsLoading(true)

    // Build conversation history (last 10 turns)
    const history = messages.slice(-10).map(m => ({ role: m.role, content: m.content }))
    history.push(userMsg)

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ messages: history }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '发送失败，请重试')
        setMessages(prev => prev.filter(m => m !== userMsg))
      } else {
        setMessages(prev => [...prev, data as Message])
      }
    } catch {
      setError('网络错误，请检查连接后重试')
      setMessages(prev => prev.filter(m => m !== userMsg))
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-slate-700 shrink-0">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">O</span>
            </div>
            <span className="text-xl font-bold">OneCore</span>
          </Link>
          <Link href="/dashboard" className="text-slate-400 hover:text-white">
            ← 返回仪表盘
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-6 max-w-3xl flex flex-col">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            AI 运营助手
          </h1>
          <p className="text-slate-400 mt-1">智能分析 · 内容生成 · 运营策略</p>
        </div>

        {/* Quick Actions */}
        {messages.length === 1 && (
          <div className="grid grid-cols-2 gap-3 mb-6">
            {quickActions.map(({ icon: Icon, label, prompt }) => (
              <button
                key={label}
                onClick={() => sendMessage(prompt)}
                className="flex items-center gap-3 p-4 bg-surface hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/30 transition-colors">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <span className="font-medium text-sm">{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2" style={{ maxHeight: '55vh' }}>
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {msg.role === 'assistant' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                    : 'bg-surface border border-slate-700'
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.usage && (
                  <p className="text-xs text-slate-500 mt-2">
                    Tokens: {msg.usage.prompt_tokens + msg.usage.completion_tokens}
                  </p>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-surface border border-slate-700 rounded-2xl px-5 py-3 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                <span className="text-sm text-slate-400">AI 思考中...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0 bg-surface border border-slate-700 rounded-2xl p-4">
          <div className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage(input)
                }
              }}
              placeholder="输入你的问题，按 Enter 发送..."
              disabled={isLoading}
              maxLength={1000}
              className="flex-1 bg-card border border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all disabled:opacity-50 resize-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-xs text-slate-600 mt-2 text-right">{input.length}/1000</p>
        </div>
      </main>
    </div>
  )
}
