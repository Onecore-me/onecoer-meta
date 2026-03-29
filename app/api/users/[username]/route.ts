import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        platforms: { where: { status: 'active' } },
        works: { where: {}, orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }] }
      }
    })

    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 })
    }

    const totalFollowers = user.platforms.reduce(
      (sum: number, p: { followers?: number | null }) => sum + (p.followers ?? 0),
      0
    )

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio,
        isVerified: user.isVerified,
        verifyLevel: user.verifyLevel,
        stats: {
          followers: totalFollowers,
          platforms: user.platforms.length,
          works: user.works.length
        }
      },
      platforms: user.platforms,
      works: user.works
    })
  } catch (error) {
    console.error('User API error:', error)
    return NextResponse.json({ error: '服务器错误' }, { status: 500 })
  }
}
