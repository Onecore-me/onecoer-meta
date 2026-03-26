'use client'

import { Shield, Award } from 'lucide-react'

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
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium flex items-center gap-1">
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
              <div className="text-2xl font-bold text-amber-500">{user.stats.platforms}</div>
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
