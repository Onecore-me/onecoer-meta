'use client'

import { useState, useEffect } from 'react'
import { Loader2, ExternalLink } from 'lucide-react'

const PLATFORM_LABELS: Record<string, { label: string; emoji: string; color: string }> = {
  douyin: { label: '抖音', emoji: '🎵', color: '#FE2C55' },
  xiaohongshu: { label: '小红书', emoji: '📕', color: '#FF2442' },
  bilibili: { label: 'B站', emoji: '📺', color: '#00A1D6' },
  weibo: { label: '微博', emoji: '🌐', color: '#E6162D' },
  youtube: { label: 'YouTube', emoji: '▶️', color: '#FF0000' },
  zhihu: { label: '知乎', emoji: '💬', color: '#0066FF' },
  jike: { label: '即刻', emoji: '⚡', color: '#FFD00B' },
  twitter: { label: 'X (Twitter)', emoji: '🐦', color: '#1DA1F2' },
  instagram: { label: 'Instagram', emoji: '📷', color: '#E4405F' },
  github: { label: 'GitHub', emoji: '💻', color: '#333333' },
  wechat: { label: '微信', emoji: '💚', color: '#07C160' },
  custom: { label: '自定义', emoji: '🔗', color: '#8B5CF6' },
}

const WORK_TYPE_LABELS: Record<string, { label: string; emoji: string }> = {
  video: { label: '视频', emoji: '🎬' },
  article: { label: '图文', emoji: '📝' },
  course: { label: '课程', emoji: '📚' },
  novel: { label: '小说', emoji: '📖' },
  other: { label: '其他', emoji: '📌' },
}

export default function PublicProfilePage({ params }: { params: { username: string } }) {
  const { username } = params
  const [userData, setUserData] = useState<any>(null)
  const [platforms, setPlatforms] = useState<any[]>([])
  const [works, setWorks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(r => {
        if (r.status === 404) { setNotFound(true); setLoading(false); return null }
        return r.json()
      })
      .then(data => {
        if (!data) return
        setUserData(data.user)
        setPlatforms(data.platforms || [])
        setWorks(data.works || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [username])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    )
  }

  if (notFound || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">未找到该用户</h1>
          <p className="text-slate-400">用户 "{username}" 不存在</p>
        </div>
      </div>
    )
  }

  const totalFollowers = platforms.reduce((sum: number, p: any) => sum + (p.followers ?? 0), 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10" />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-indigo-500/20 to-transparent" />
        <div className="container mx-auto px-4 pt-16 pb-8 max-w-4xl relative">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="relative">
              <img
                src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`}
                alt={userData.username}
                className="w-28 h-28 rounded-full border-4 border-indigo-500/50 shadow-xl shadow-indigo-500/20"
              />
              {userData.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
              )}
            </div>
            <h1 className="text-3xl font-bold mt-4">{userData.username}</h1>
            {userData.bio && <p className="text-slate-400 mt-2 max-w-md">{userData.bio}</p>}

            {/* Stats */}
            <div className="flex items-center gap-8 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{totalFollowers.toLocaleString()}</div>
                <div className="text-xs text-slate-500">总粉丝</div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{platforms.length}</div>
                <div className="text-xs text-slate-500">平台</div>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-400">{works.length}</div>
                <div className="text-xs text-slate-500">作品</div>
              </div>
            </div>
          </div>

          {/* Platform Links */}
          {platforms.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-center">📱 平台账号</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {platforms.map((p: any) => {
                  const info = PLATFORM_LABELS[p.platform] || { label: p.platform, emoji: '🔗', color: '#8B5CF6' }
                  return (
                    <a
                      key={p.id}
                      href={p.url || '#'}
                      target={p.url ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="bg-surface border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all group"
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: info.color + '22' }}
                      >
                        {info.emoji}
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-sm">{info.label}</div>
                        <div className="text-xs text-slate-500">{p.followers?.toLocaleString() || 0} 粉丝</div>
                      </div>
                      {p.url && <ExternalLink size={12} className="text-slate-600 group-hover:text-indigo-400" />}
                    </a>
                  )
                })}
              </div>
            </div>
          )}

          {/* Works */}
          {works.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xl font-semibold mb-4 text-center">📚 精选作品</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {works.map((w: any) => {
                  const typeInfo = WORK_TYPE_LABELS[w.type] || { label: w.type, emoji: '📌' }
                  const tags = (() => { try { return JSON.parse(w.tags) } catch { return [] } })()
                  return (
                    <a
                      key={w.id}
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-surface border border-slate-700 rounded-xl p-4 flex gap-4 hover:border-indigo-500/50 transition-all group"
                    >
                      {w.cover ? (
                        <img src={w.cover} alt={w.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-card flex items-center justify-center text-2xl shrink-0">
                          {typeInfo.emoji}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400">{typeInfo.label}</span>
                        </div>
                        <h3 className="font-medium truncate group-hover:text-indigo-400 transition-colors">{w.title}</h3>
                        {w.summary && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{w.summary}</p>}
                        {tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {tags.slice(0, 3).map((tag: string, i: number) => (
                              <span key={i} className="text-xs px-1.5 py-0.5 rounded-full bg-slate-700 text-slate-500">#{tag}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-500 text-sm">
        由 <span className="text-indigo-400 font-medium">OneCore</span> 驱动 · 你的全网身份中枢
      </footer>
    </div>
  )
}
