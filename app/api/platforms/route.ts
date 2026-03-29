import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'onecore-dev-secret-do-not-use-in-production'

async function getUserId(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded.userId
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  const platforms = await prisma.platform.findMany({ where: { userId } })
  return NextResponse.json(platforms)
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  try {
    const data = await request.json()
    const platform = await prisma.platform.create({
      data: {
        userId,
        platform: data.platform,
        handle: data.handle,
        displayName: data.displayName,
        followers: data.followers || 0,
        avatar: data.avatar,
        url: data.url
      }
    })
    return NextResponse.json(platform)
  } catch (error) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  try {
    const { id, ...data } = await request.json()
    const platform = await prisma.platform.update({
      where: { id, userId },
      data
    })
    return NextResponse.json(platform)
  } catch {
    return NextResponse.json({ error: '更新失败' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: '缺少ID' }, { status: 400 })
  
  await prisma.platform.delete({ where: { id, userId } })
  return NextResponse.json({ success: true })
}
