'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Plus, Trash2, ExternalLink } from 'lucide-react'

const PLATFORM_OPTIONS = [
  { value: 'douyin', label: '抖音', emoji: '🎵', color: '#FE2C55' },
  { value: 'xiaohongshu', label: '小红书', emoji: '📕', color: '#FF2442' },
  { value: 'bilibili', label: 'B站', emoji: '📺', color: '#00A1D6' },
  { value: 'weibo', label: '微博', emoji: '🌐', color: '#E6162D' },
  { value: 'youtube', label: 'YouTube', emoji: '▶️', color: '#FF0000' },
  { value: 'zhihu', label: '知乎', emoji: '💬', color: '#0066FF' },
  { value: 'jike', label: '即刻', emoji: '⚡', color: '#FFD00B' },
  { value: 'twitter', label: 'X (Twitter)', emoji: '🐦', color: '#1DA1F2' },
  { value: 'instagram', label: 'Instagram', emoji: '📷', color: '#E4405F' },
  { value: 'github', label: 'GitHub', emoji: '💻', color: '#333333' },
  { value: 'wechat', label: '微信', emoji: '💚', color: '#07C160' },
  { value: 'custom', label: '自定义', emoji: '🔗', color: '#8B5CF6' },
]

interface Platform {
  id: string
  platform: string
  handle: string
  displayName?: string
  followers: number
  avatar?: string
  url?: string
}

export default function PlatformsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loadingPlatforms, setLoadingPlatforms] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [form, setForm] = useState({
    platform: 'douyin',
    handle: '',
    displayName: '',
    followers: '',
    url: '',
  })

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) fetchPlatforms()
  }, [user])

  const fetchPlatforms = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/platforms', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setPlatforms(data)
    }
    setLoadingPlatforms(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/platforms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          platform: form.platform,
          handle: form.handle,
          displayName: form.displayName || form.handle,
          followers: parseInt(form.followers) || 0,
          url: form.url
        })
      })
      if (res.ok) {
        setForm({ platform: 'douyin', handle: '', displayName: '', followers: '', url: '' })
        setShowForm(false)
        fetchPlatforms()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该平台账号？')) return
    setDeleting(id)
    const token = localStorage.getItem('token')
    await fetch(`/api/platforms?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setDeleting(null)
    fetchPlatforms()
  }

  const getPlatformInfo = (value: string) =>
    PLATFORM_OPTIONS.find(p => p.value === value) || PLATFORM_OPTIONS[PLATFORM_OPTIONS.length - 1]

  const totalFollowers = platforms.reduce((sum, p) => sum + p.followers, 0)

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-surface border-b border-slate-700">
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

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">平台账号管理</h1>
            <p className="text-slate-400 mt-1">已连接 {platforms.length} 个平台 · 共 {totalFollowers.toLocaleString()} 粉丝</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            添加平台
          </button>
        </div>

        {showForm && (
          <div className="bg-surface rounded-2xl border border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">添加平台账号</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">选择平台</label>
                <select
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PLATFORM_OPTIONS.map(p => (
                    <option key={p.value} value={p.value}>{p.emoji} {p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">账号 ID / Handle</label>
                <input
                  type="text"
                  value={form.handle}
                  onChange={e => setForm({ ...form, handle: e.target.value })}
                  required
                  placeholder="@username 或 ID"
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">显示名称（选填）</label>
                <input
                  type="text"
                  value={form.displayName}
                  onChange={e => setForm({ ...form, displayName: e.target.value })}
                  placeholder="如：抖音号"
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">粉丝数（选填）</label>
                <input
                  type="number"
                  value={form.followers}
                  onChange={e => setForm({ ...form, followers: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">主页链接（选填）</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-5 h-5 animate-spin" />}
                  {saving ? '添加中...' : '添加账号'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        )}

        {loadingPlatforms ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface rounded-2xl border border-slate-700 p-6 shimmer h-24" />
            ))}
          </div>
        ) : platforms.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-slate-700 p-16 text-center">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-semibold mb-2">还没有连接任何平台</h3>
            <p className="text-slate-400 mb-6">添加你的第一个社交媒体账号，开始聚合展示</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all"
            >
              <Plus size={18} />
              添加第一个平台
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {platforms.map(p => {
              const info = getPlatformInfo(p.platform)
              return (
                <div key={p.id} className="bg-surface rounded-2xl border border-slate-700 p-6 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: info.color + '22', border: `1px solid ${info.color}44` }}
                  >
                    {info.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{p.displayName || p.handle}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">{info.label}</span>
                    </div>
                    <p className="text-slate-400 text-sm">@{p.handle}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-indigo-400">{p.followers.toLocaleString()}</div>
                    <div className="text-xs text-slate-500">粉丝</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.url && (
                      <a href={p.url} target="_blank" rel="noopener noreferrer"
                        className="p-2 bg-card hover:bg-slate-700 rounded-lg transition-colors">
                        <ExternalLink size={16} className="text-slate-400" />
                      </a>
                    )}
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-red-400" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
