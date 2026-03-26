'use client'

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
