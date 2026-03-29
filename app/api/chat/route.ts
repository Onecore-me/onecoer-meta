import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'onecore-dev-secret-do-not-use-in-production'

// Supported AI backends
const AI_PROVIDERS: Record<string, { baseUrl: string; model: string; apiKey: string }> = {
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  siliconflow: {
    baseUrl: 'https://api.siliconflow.cn/v1',
    model: process.env.SILICONFLOW_MODEL || 'Qwen/Qwen2.5-7B-Instruct',
    apiKey: process.env.SILICONFLOW_API_KEY || '',
  },
  dashscope: {
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    model: process.env.DASHSCOPE_MODEL || 'qwen-plus',
    apiKey: process.env.DASHSCOPE_API_KEY || '',
  },
}

function getProviderConfig(): { baseUrl: string; model: string; apiKey: string } | null {
  const provider = process.env.AI_PROVIDER
  if (provider && AI_PROVIDERS[provider]) {
    const cfg = AI_PROVIDERS[provider]
    if (cfg.apiKey) return cfg
  }
  // Auto-detect first available
  for (const [, cfg] of Object.entries(AI_PROVIDERS)) {
    if (cfg.apiKey) return cfg
  }
  return null
}

const SYSTEM_PROMPT = `你叫 OneCore AI，是 OneCore 元栈平台的智能运营助手。OneCore 是一个个人品牌聚合平台（Slogan：你的全网身份中枢），帮助创作者聚合展示全网20+平台账号、作品集和联系方式。

你的能力范围：
1. **账号健康分析**：分析用户的平台账号数据，给出优化建议
2. **内容创意生成**：帮用户想爆款标题、选题方向、内容策划
3. **运营策略制定**：制定阶段性运营计划、时间表、目标设定
4. **竞品对比分析**：分析不同平台的特点，帮助选择最适合的平台
5. **粉丝增长建议**：给出实际的涨粉技巧和策略

请用专业、友好、鼓励的语气回答。适当使用 emoji 增加活力。回答控制在200字以内，重点突出。`

export async function POST(request: NextRequest) {
  // Auth check
  const token = request.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: '请先登录' }, { status: 401 })
  }
  try {
    jwt.verify(token, JWT_SECRET)
  } catch {
    return NextResponse.json({ error: '无效的登录状态' }, { status: 401 })
  }

  // Parse body
  let body: { messages?: Array<{ role: string; content: string }>; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '请求格式错误' }, { status: 400 })
  }

  const userMessage = body.message || body.messages?.[body.messages.length - 1]?.content
  if (!userMessage?.trim()) {
    return NextResponse.json({ error: '消息不能为空' }, { status: 400 })
  }

  // Check message length
  if (userMessage.length > 1000) {
    return NextResponse.json({ error: '消息不能超过1000字' }, { status: 400 })
  }

  // Check AI config
  const aiConfig = getProviderConfig()
  if (!aiConfig) {
    // Graceful fallback — return a helpful offline message
    const offlineResponses = [
      '🔧 AI 功能正在配置中，请联系管理员设置 AI API Key（支持 OpenAI / SiliconFlow / 阿里通义）。',
      '⚡ AI 助手暂时离线，稍后即可使用。目前支持 OpenAI、SiliconFlow、阿里通义千问等 API。',
      '📋 AI 服务未配置，请在环境变量中设置 AI_PROVIDER 和对应的 API Key。',
    ]
    const response = offlineResponses[Math.floor(Math.random() * offlineResponses.length)]
    return NextResponse.json({
      role: 'assistant',
      content: response,
      usage: null,
    })
  }

  // Build messages for AI API
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(body.messages || []).filter(
      (m: { role: string; content: string }) => m.role === 'user' || m.role === 'assistant'
    ),
    { role: 'user', content: userMessage },
  ]

  try {
    const aiRes = await fetch(`${aiConfig.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${aiConfig.apiKey}`,
      },
      body: JSON.stringify({
        model: aiConfig.model,
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(15000),
    })

    if (!aiRes.ok) {
      const errText = await aiRes.text()
      console.error('AI API error:', aiRes.status, errText)
      return NextResponse.json(
        { error: 'AI 服务暂时不可用，请稍后重试' },
        { status: 502 }
      )
    }

    const aiData = await aiRes.json()
    const reply = aiData.choices?.[0]?.message?.content || '抱歉，我暂时无法回复。'
    const usage = aiData.usage ? {
      prompt_tokens: aiData.usage.prompt_tokens,
      completion_tokens: aiData.usage.completion_tokens,
    } : null

    return NextResponse.json({ role: 'assistant', content: reply, usage })
  } catch (err: any) {
    if (err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'AI 响应超时，请重试' }, { status: 504 })
    }
    console.error('AI chat error:', err)
    return NextResponse.json({ error: 'AI 服务异常' }, { status: 500 })
  }
}
