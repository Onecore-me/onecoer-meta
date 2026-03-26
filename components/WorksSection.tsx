'use client'

import { Eye } from 'lucide-react'

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
