'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-lg border-b border-slate-700">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-xl font-bold text-white">O</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              OneCore
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-slate-300 hover:text-white transition-colors">首页</Link>
            <Link href="#" className="text-slate-300 hover:text-white transition-colors">探索</Link>
            <Link href="#" className="text-slate-300 hover:text-white transition-colors">创建主页</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-all">
              登录
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 hover:bg-card rounded-lg transition-colors">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-700">
            <div className="flex flex-col gap-2">
              <Link href="/" className="px-4 py-2 hover:bg-card rounded-lg">首页</Link>
              <Link href="#" className="px-4 py-2 hover:bg-card rounded-lg">探索</Link>
              <Link href="/login" className="px-4 py-2 hover:bg-card rounded-lg text-indigo-400">登录</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
