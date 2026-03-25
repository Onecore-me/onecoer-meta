import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'onecore-secret-key-change-in-production'

export async function POST(request: NextRequest) {
  try {
    const { type, email, password, username } = await request.json()

    if (type === 'register') {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({ where: { email } })
      if (existingUser) {
        return NextResponse.json({ error: '用户已存在' }, { status: 400 })
      }
      
      // Hash password
      const passwordHash = await bcrypt.hash(password, 10)
      
      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          username: username || email.split('@')[0],
          passwordHash,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        }
      })
      
      // Create JWT token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
      
      return NextResponse.json({
        user: { id: user.id, email: user.email, username: user.username, avatar: user.avatar },
        token
      })
    }

    if (type === 'login') {
      const user = await prisma.user.findUnique({ where: { email } })
      if (!user) {
        return NextResponse.json({ error: '用户不存在' }, { status: 401 })
      }
      
      const isValid = await bcrypt.compare(password, user.passwordHash)
      if (!isValid) {
        return NextResponse.json({ error: '密码错误' }, { status: 401 })
      }
      
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })
      
      return NextResponse.json({
        user: { id: user.id, email: user.email, username: user.username, avatar: user.avatar },
        token
      })
    }

    return NextResponse.json({ error: '无效的请求类型' }, { status: 400 })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: '未登录' }, { status: 401 })
    }
    
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { platforms: true, works: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
        verifyLevel: user.verifyLevel,
        stats: {
          followers: user.platforms.reduce((sum: number, p: { followers?: number | null }) => sum + (p.followers ?? 0), 0),
          platforms: user.platforms.length,
          works: user.works.length
        }
      },
      platforms: user.platforms,
      works: user.works
    })
  } catch (error) {
    return NextResponse.json({ error: '无效的token' }, { status: 401 })
  }
}
