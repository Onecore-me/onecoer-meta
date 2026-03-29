'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Plus, Trash2, ExternalLink, Image as ImageIcon } from 'lucide-react'

const WORK_TYPES = [
  { value: 'video', label: '视频', emoji: '🎬' },
  { value: 'article', label: '图文', emoji: '📝' },
  { value: 'course', label: '课程', emoji: '📚' },
  { value: 'novel', label: '小说', emoji: '📖' },
  { value: 'other', label: '其他', emoji: '📌' },
]

const PLATFORMS = [
  { value: 'douyin', label: '抖音' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'bilibili', label: 'B站' },
  { value: 'weibo', label: '微博' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'zhihu', label: '知乎' },
  { value: 'wechat', label: '微信公众号' },
  { value: 'other', label: '其他' },
]

interface Work {
  id: string
  type: string
  title: string
  summary?: string
  cover?: string
  url: string
  platform: string
  tags: string
  views: number
  isPinned: boolean
  createdAt: string
}

export default function WorksPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [works, setWorks] = useState<Work[]>([])
  const [loadingWorks, setLoadingWorks] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [form, setForm] = useState({
    type: 'article',
    title: '',
    summary: '',
    cover: '',
    url: '',
    platform: 'xiaohongshu',
    tags: '',
    views: '',
  })

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) fetchWorks()
  }, [user])

  const fetchWorks = async () => {
    const token = localStorage.getItem('token')
    const res = await fetch('/api/works', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setWorks(data)
    }
    setLoadingWorks(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem('token')
    try {
      const res = await fetch('/api/works', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: form.type,
          title: form.title,
          summary: form.summary,
          cover: form.cover,
          url: form.url,
          platform: form.platform,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
          views: parseInt(form.views) || 0,
        })
      })
      if (res.ok) {
        setForm({ type: 'article', title: '', summary: '', cover: '', url: '', platform: 'xiaohongshu', tags: '', views: '' })
        setShowForm(false)
        fetchWorks()
      }
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该作品？')) return
    setDeleting(id)
    const token = localStorage.getItem('token')
    await fetch(`/api/works?id=${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setDeleting(null)
    fetchWorks()
  }

  const getTypeInfo = (value: string) =>
    WORK_TYPES.find(t => t.value === value) || WORK_TYPES[WORK_TYPES.length - 1]

  const getPlatformLabel = (value: string) =>
    PLATFORMS.find(p => p.value === value)?.label || value

  const totalViews = works.reduce((sum, w) => sum + w.views, 0)

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
            <h1 className="text-3xl font-bold">作品管理</h1>
            <p className="text-slate-400 mt-1">共 {works.length} 件作品 · 总浏览 {totalViews.toLocaleString()}</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all shadow-lg shadow-indigo-500/20"
          >
            <Plus size={18} />
            添加作品
          </button>
        </div>

        {showForm && (
          <div className="bg-surface rounded-2xl border border-slate-700 p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">添加作品</h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">作品标题</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="作品标题"
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">作品类型</label>
                <select
                  value={form.type}
                  onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {WORK_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">发布平台</label>
                <select
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {PLATFORMS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">浏览量（选填）</label>
                <input
                  type="number"
                  value={form.views}
                  onChange={e => setForm({ ...form, views: e.target.value })}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">作品链接</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">封面图 URL（选填）</label>
                <input
                  type="url"
                  value={form.cover}
                  onChange={e => setForm({ ...form, cover: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">简介（选填）</label>
                <textarea
                  value={form.summary}
                  onChange={e => setForm({ ...form, summary: e.target.value })}
                  rows={3}
                  placeholder="简单描述这个作品..."
                  className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1">标签（用逗号分隔，选填）</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="如：教程, 生活方式, 开箱"
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
                  {saving ? '添加中...' : '添加作品'}
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

        {loadingWorks ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface rounded-2xl border border-slate-700 p-6 shimmer h-28" />
            ))}
          </div>
        ) : works.length === 0 ? (
          <div className="bg-surface rounded-2xl border border-slate-700 p-16 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">还没有添加任何作品</h3>
            <p className="text-slate-400 mb-6">添加你的图文、视频、课程等内容到主页展示</p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all"
            >
              <Plus size={18} />
              添加第一个作品
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {works.map(w => {
              const typeInfo = getTypeInfo(w.type)
              const tags = (() => { try { return JSON.parse(w.tags) } catch { return [] } })()
              return (
                <div key={w.id} className="bg-surface rounded-2xl border border-slate-700 p-6">
                  <div className="flex items-start gap-4">
                    {w.cover ? (
                      <img src={w.cover} alt={w.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-card flex items-center justify-center text-3xl shrink-0">
                        {typeInfo.emoji}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                          {typeInfo.emoji} {typeInfo.label}
                        </span>
                        <span className="text-xs text-slate-500">{getPlatformLabel(w.platform)}</span>
                        {w.isPinned && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">置顶</span>}
                      </div>
                      <h3 className="font-semibold text-lg truncate">{w.title}</h3>
                      {w.summary && <p className="text-slate-400 text-sm mt-1 line-clamp-2">{w.summary}</p>}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {tags.map((tag: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-2">
                      <div>
                        <div className="text-lg font-bold text-amber-400">{w.views.toLocaleString()}</div>
                        <div className="text-xs text-slate-500">浏览</div>
                      </div>
                      <div className="flex flex-col gap-1">
                        {w.url && (
                          <a href={w.url} target="_blank" rel="noopener noreferrer"
                            className="p-2 bg-card hover:bg-slate-700 rounded-lg transition-colors">
                            <ExternalLink size={14} className="text-slate-400" />
                          </a>
                        )}
                        <button
                          onClick={() => handleDelete(w.id)}
                          disabled={deleting === w.id}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
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
