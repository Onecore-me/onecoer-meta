'use client'

import { useState } from 'react'
import ProfileCard from '@/components/ProfileCard'
import PlatformLinks from '@/components/PlatformLinks'
import WorksSection from '@/components/WorksSection'
import AIChatWidget from '@/components/AIChatWidget'
import ContactSection from '@/components/ContactSection'
import Navbar from '@/components/Navbar'

// Mock user data
const mockUser = {
  name: '张三',
  username: 'zhangsan',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan',
  bio: '全栈开发者 | AI爱好者 | 内容创作者',
  isVerified: true,
  verifyLevel: 'advanced',
  stats: {
    followers: 128500,
    works: 89,
    platforms: 12,
  },
}

const mockPlatforms = [
  { id: '1', platform: 'douyin', name: '抖音', handle: '@zhangsan', followers: 45000, isConnected: true },
  { id: '2', platform: 'xiaohongshu', name: '小红书', handle: 'zhangsan', followers: 23000, isConnected: true },
  { id: '3', platform: 'bilibili', name: 'B站', handle: 'zhangsan', followers: 18500, isConnected: true },
  { id: '4', platform: 'weibo', name: '微博', handle: '@zhangsanofficial', followers: 12000, isConnected: true },
  { id: '5', platform: 'youtube', name: 'YouTube', handle: 'Zhang San', followers: 28000, isConnected: true },
  { id: '6', platform: 'github', name: 'GitHub', handle: 'zhangsan', followers: 3000, isConnected: true },
]

const mockWorks = [
  { id: '1', type: 'video', title: '从零搭建AI助手开发环境', platform: 'bilibili', summary: '详细讲解如何配置Node.js、Next.js和OpenAI API', url: '#', cover: 'https://picsum.photos/seed/vid1/400/225', views: 12500 },
  { id: '2', type: 'article', title: '2024年最值得学习的5个开源项目', platform: 'xiaohongshu', summary: '精选5个优质开源项目，适合各阶段开发者', url: '#', cover: 'https://picsum.photos/seed/art1/400/225', views: 8900 },
  { id: '3', type: 'video', title: 'ChatGPT插件开发实战教程', platform: 'douyin', summary: '手把手教你开发ChatGPT插件，实现自动化办公', url: '#', cover: 'https://picsum.photos/seed/vid2/400/225', views: 15600 },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState<'home' | 'works' | 'ai'>('home')

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Section */}
        <div className="mb-8">
          <ProfileCard user={mockUser} />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'home'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-surface text-slate-300 hover:bg-card'
            }`}
          >
            📱 平台账号
          </button>
          <button
            onClick={() => setActiveTab('works')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'works'
                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                : 'bg-surface text-slate-300 hover:bg-card'
            }`}
          >
            📚 作品展示
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'ai'
                ? 'bg-secondary text-white shadow-lg shadow-secondary/30'
                : 'bg-surface text-slate-300 hover:bg-card'
            }`}
          >
            🤖 AI 助手
          </button>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'home' && (
              <>
                <PlatformLinks platforms={mockPlatforms} />
                <ContactSection />
              </>
            )}
            {activeTab === 'works' && (
              <WorksSection works={mockWorks} />
            )}
            {activeTab === 'ai' && (
              <AIChatWidget />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">📊 数据概览</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">总粉丝</span>
                  <span className="text-xl font-bold text-primary">{(mockUser.stats.followers / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">作品数</span>
                  <span className="text-xl font-bold text-secondary">{mockUser.stats.works}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">平台数</span>
                  <span className="text-xl font-bold text-accent">{mockUser.stats.platforms}</span>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-xl p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4">🔥 热门作品</h3>
              <div className="space-y-3">
                {mockWorks.slice(0, 2).map((work) => (
                  <div key={work.id} className="flex gap-3 items-start">
                    <img src={work.cover} alt={work.title} className="w-16 h-12 rounded object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{work.title}</p>
                      <p className="text-xs text-slate-400">{work.views.toLocaleString()} 阅读</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-slate-500">
          <p>© 2024 OneCore. 你的全网身份中枢</p>
        </div>
      </footer>
    </div>
  )
}
