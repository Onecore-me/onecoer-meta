'use client'

import { Mail, MessageCircle, Globe, Copy, Check } from 'lucide-react'
import { useState } from 'react'

export default function ContactSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const contacts = [
    { type: 'email', label: '邮箱', value: 'hello@onecore.app', icon: Mail },
    { type: 'wechat', label: '微信', value: 'onecore_lab', icon: MessageCircle },
    { type: 'website', label: '网站', value: 'https://onecore.app', icon: Globe },
  ]

  return (
    <div className="bg-surface rounded-2xl border border-slate-700 p-6">
      <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
        <span>📞</span> 联系方式
      </h2>
      <div className="space-y-4">
        {contacts.map((contact) => (
          <div key={contact.type} className="flex items-center justify-between p-4 bg-card/50 rounded-xl hover:bg-card transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <contact.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm text-slate-400">{contact.label}</div>
                <div className="font-medium">{contact.value}</div>
              </div>
            </div>
            <button onClick={() => copyToClipboard(contact.value, contact.type)} className="p-2 hover:bg-surface rounded-lg transition-colors">
              {copied === contact.type ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5 text-slate-400" />}
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
        <p className="text-sm text-center">💡 商务合作、品牌联名，欢迎扫码添加助手微信</p>
      </div>
    </div>
  )
}
