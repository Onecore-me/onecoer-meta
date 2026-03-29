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
  
  const works = await prisma.work.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } })
  return NextResponse.json(works)
}

export async function POST(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  try {
    const data = await request.json()
    const work = await prisma.work.create({
      data: {
        userId,
        type: data.type,
        title: data.title,
        summary: data.summary,
        cover: data.cover,
        url: data.url,
        platform: data.platform,
        tags: JSON.stringify(data.tags || []),
        views: data.views || 0
      }
    })
    return NextResponse.json(work)
  } catch (error) {
    return NextResponse.json({ error: '创建失败' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  const userId = await getUserId(request)
  if (!userId) return NextResponse.json({ error: '未登录' }, { status: 401 })
  
  try {
    const { id, ...data } = await request.json()
    if (data.tags) data.tags = JSON.stringify(data.tags)
    const work = await prisma.work.update({
      where: { id, userId },
      data
    })
    return NextResponse.json(work)
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
  
  await prisma.work.delete({ where: { id, userId } })
  return NextResponse.json({ success: true })
}
