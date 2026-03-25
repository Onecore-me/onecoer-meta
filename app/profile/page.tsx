'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2, Camera } from 'lucide-react'

export default function ProfilePage() {
  const { user, loading, updateProfile, logout } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [bio, setBio] = useState('')
  const [avatar, setAvatar] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
    if (user) {
      setUsername(user.username || '')
      setBio(user.bio || '')
      setAvatar(user.avatar || '')
    }
  }, [user, loading, router])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      await updateProfile({ username, bio, avatar })
      setMessage('保存成功！')
    } catch (e: any) {
      setMessage(e.message || '保存失败')
    }
    setSaving(false)
  }

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
            返回仪表盘
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">编辑个人资料</h1>

        <div className="bg-surface rounded-2xl border border-slate-700 p-8 space-y-6">
          {message && (
            <div className={`p-4 rounded-xl ${message.includes('成功') ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
              {message}
            </div>
          )}

          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">头像</label>
            <div className="flex items-center gap-4">
              <div className="relative">
                <img src={avatar} alt="avatar" className="w-24 h-24 rounded-full object-cover" />
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-500 rounded-full hover:bg-indigo-600">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="输入头像 URL"
                className="flex-1 px-4 py-2 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="你的用户名"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">简介</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 bg-card border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="介绍一下你自己..."
            />
          </div>

          {/* Email (readonly) */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">邮箱</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving && <Loader2 className="w-5 h-5 animate-spin" />}
              {saving ? '保存中...' : '保存更改'}
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl transition-colors"
            >
              退出登录
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
