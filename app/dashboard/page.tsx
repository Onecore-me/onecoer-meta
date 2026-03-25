'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">O</span>
            </div>
            <span className="text-xl font-bold">OneCore</span>
          </Link>
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.username} className="w-10 h-10 rounded-full" />
            <span className="text-slate-300">{user.username}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm transition-colors"
            >
              退出
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">欢迎回来，{user.username}！</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="bg-surface rounded-2xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">快速操作</h2>
            <div className="space-y-3">
              <Link href="/profile" className="block p-4 bg-card hover:bg-slate-700 rounded-xl transition-colors">
                <span className="text-2xl mb-2 block">👤</span>
                <span className="font-medium">编辑个人资料</span>
              </Link>
              <Link href="/platforms" className="block p-4 bg-card hover:bg-slate-700 rounded-xl transition-colors">
                <span className="text-2xl mb-2 block">🔗</span>
                <span className="font-medium">管理平台账号</span>
              </Link>
              <Link href="/works" className="block p-4 bg-card hover:bg-slate-700 rounded-xl transition-colors">
                <span className="text-2xl mb-2 block">📚</span>
                <span className="font-medium">作品管理</span>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="bg-surface rounded-2xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">数据概览</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-card rounded-xl">
                <span className="text-slate-400">总粉丝</span>
                <span className="text-2xl font-bold text-indigo-400">0</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-card rounded-xl">
                <span className="text-slate-400">连接平台</span>
                <span className="text-2xl font-bold text-purple-400">0</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-card rounded-xl">
                <span className="text-slate-400">作品数</span>
                <span className="text-2xl font-bold text-amber-400">0</span>
              </div>
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-surface rounded-2xl border border-slate-700 p-6">
            <h2 className="text-xl font-semibold mb-4">AI 助手</h2>
            <p className="text-slate-400 mb-4">获取运营建议、生成内容创意</p>
            <Link href="/ai" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl font-medium">
              <span>🤖</span>
              <span>开始对话</span>
            </Link>
          </div>
        </div>

        {/* Getting Started */}
        <div className="mt-8 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/30 p-8">
          <h2 className="text-2xl font-bold mb-4">🚀 开始使用</h2>
          <p className="text-slate-300 mb-6">
            完成以下步骤，创建你的第一个全网身份主页
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-surface rounded-xl">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center mb-3 text-white font-bold">1</div>
              <h3 className="font-semibold mb-2">完善资料</h3>
              <p className="text-sm text-slate-400">设置头像、昵称和简介</p>
            </div>
            <div className="p-4 bg-surface rounded-xl">
              <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center mb-3 text-white font-bold">2</div>
              <h3 className="font-semibold mb-2">连接平台</h3>
              <p className="text-sm text-slate-400">添加你的社交媒体账号</p>
            </div>
            <div className="p-4 bg-surface rounded-xl">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center mb-3 text-white font-bold">3</div>
              <h3 className="font-semibold mb-2">分享主页</h3>
              <p className="text-sm text-slate-400">获取你的专属 OneCore 链接</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
