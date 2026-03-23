import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OneCore - 你的全网身份中枢',
  description: '聚合展示个人全网自媒体账号和联系方式，AI驱动的智能运营助手',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-background text-slate-50 antialiased">
        {children}
      </body>
    </html>
  )
}
