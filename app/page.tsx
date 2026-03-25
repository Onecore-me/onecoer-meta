'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import Navbar from '@/components/Navbar'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        
        <Navbar />
        
        <main className="container mx-auto px-4 py-20 max-w-6xl relative">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              你的全网身份中枢
            </h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              聚合展示你的所有社交媒体账号、作品集和联系方式。一个链接，让世界认识完整的你。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register" className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/30">
                立即开始
              </Link>
              <Link href="/login" className="px-8 py-4 bg-surface hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold text-lg transition-all">
                登录账号
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-surface/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🔗</div>
              <h3 className="text-xl font-bold mb-2">平台聚合</h3>
              <p className="text-slate-400">一站式展示抖音、小红书、B站等20+平台账号</p>
            </div>
            <div className="bg-surface/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold mb-2">AI 助手</h3>
              <p className="text-slate-400">智能分析数据、生成内容、制定运营策略</p>
            </div>
            <div className="bg-surface/50 backdrop-blur border border-slate-700 rounded-2xl p-8 text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h3 className="text-xl font-bold mb-2">实名认证</h3>
              <p className="text-slate-400">建立网络信任，让合作更放心</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
