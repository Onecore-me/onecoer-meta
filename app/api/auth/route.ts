import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// SECURITY: In production, JWT_SECRET MUST be set in environment variables.
// Using a known fallback here only for local development without .env configured.
const JWT_SECRET = process.env.JWT_SECRET || 'onecore-dev-secret-do-not-use-in-production'

// Input validation helpers
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254
}

function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_-]{2,30}$/.test(username)
}

function isValidPassword(password: string): boolean {
  return password.length >= 6 && password.length <= 128
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const { type, email, password, username } = body as Record<string, string>

  if (type === 'register') {
    // Validate required fields
    if (!email || !password || !username) {
      return NextResponse.json({ error: '邮箱、密码和用户名均为必填项' }, { status: 400 })
    }
    // Input validation
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: '请输入有效的邮箱地址' }, { status: 400 })
    }
    if (!isValidUsername(username)) {
      return NextResponse.json({ error: '用户名需为2-30位字母、数字、下划线或连字符' }, { status: 400 })
    }
    if (!isValidPassword(password)) {
      return NextResponse.json({ error: '密码长度需为6-128位' }, { status: 400 })
    }

    // Check email uniqueness
    const existingEmail = await prisma.user.findUnique({ where: { email } })
    if (existingEmail) {
      return NextResponse.json({ error: '该邮箱已被注册' }, { status: 409 })
    }

    // Check username uniqueness
    const existingUsername = await prisma.user.findUnique({ where: { username } })
    if (existingUsername) {
      return NextResponse.json({ error: '用户名已被占用' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`
      }
    })

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    return NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username, avatar: user.avatar },
      token
    })
  }

  if (type === 'login') {
    if (!email || !password) {
      return NextResponse.json({ error: '邮箱和密码为必填项' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: '邮箱或密码错误' }, { status: 401 })
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' })

    return NextResponse.json({
      user: { id: user.id, email: user.email, username: user.username, avatar: user.avatar },
      token
    })
  }

  return NextResponse.json({ error: '无效的请求类型' }, { status: 400 })
}

export async function GET(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: '未登录' }, { status: 401 })
  }

  let decoded: { userId: string }
  try {
    decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
  } catch {
    return NextResponse.json({ error: '无效的登录状态' }, { status: 401 })
  }

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
}

