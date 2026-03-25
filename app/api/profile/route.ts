import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'onecore-secret-key-change-in-production'

export async function PUT(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const data = await request.json()
    
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        username: data.username,
        bio: data.bio,
        avatar: data.avatar
      }
    })
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      bio: user.bio
    })
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}
