# OneCore 元栈 - 产品规范

## 1. Concept & Vision

**Slogan:** "你的全网身份中枢"

OneCore 是一个个人品牌聚合平台，帮助创作者、企业、公众人物将分散在20+平台的身份、内容、联系方式整合到一个入口。用户通过一个链接展示全网影响力，AI 助手帮助分析数据、生成内容、制定运营策略。

**核心理念：**
- 去中心化身份聚合 — 不替代平台，而是连接平台
- AI 驱动 — 不是静态展示，而是智能运营助手
- 实名可信 — 真实身份认证，建立网络信任

---

## 2. Design Language

### 色彩系统
```
Primary:     #6366F1 (Indigo - 智能、科技)
Secondary:   #8B5CF6 (Purple - 创意、个性)
Accent:      #F59E0B (Amber - 温暖、信任)
Success:     #10B981 (Emerald)
Warning:     #F59E0B (Amber)
Error:       #EF4444 (Red)

Background:  #0F172A (Slate 900 - 深色主题)
Surface:     #1E293B (Slate 800)
Card:        #334155 (Slate 700)
Text:        #F8FAFC (Slate 50)
TextMuted:   #94A3B8 (Slate 400)
```

### 字体
- 标题: Inter / SF Pro Display
- 正文: Inter / system-ui
- 代码: JetBrains Mono

### 动效
- 页面切换: 300ms ease-out
- 卡片悬停: scale(1.02), 200ms
- 加载: skeleton shimmer
- 成功反馈: confetti burst

---

## 3. Layout & Structure

### 首页 (个人主页)
```
┌─────────────────────────────────────┐
│  🎯 Hero Section                    │
│  头像 | 名称 | 认证标识 | 简介      │
│  粉丝总数 | 平台数 | 作品数          │
├─────────────────────────────────────┤
│  📱 平台账号聚合区                   │
│  [抖音] [小红书] [B站] [微博] ...   │
│  显示粉丝数、爆款内容预览             │
├─────────────────────────────────────┤
│  📚 作品展示区                      │
│  图文 | 视频 | 小说 | 课程          │
│  简介 + 链接形式                    │
├─────────────────────────────────────┤
│  💬 AI 助手                         │
│  智能问答、数据分析、创作辅助          │
├─────────────────────────────────────┤
│  📞 联系方式                        │
│  微信 | 邮箱 | 商务合作              │
└─────────────────────────────────────┘
```

### 响应式断点
- Mobile: < 640px (单列)
- Tablet: 640-1024px (双列)
- Desktop: > 1024px (三列)

---

## 4. Features & Interactions

### 核心功能

#### 4.1 账号聚合管理
- 一键添加主流平台账号（抖音/小红书/B站/微博/微信/YouTube等）
- 自动拉取公开数据（粉丝数、简介、头像）
- 手动/自动同步更新
- 支持链接展示和跳转

#### 4.2 实名认证系统
- 基础认证：手机号 + 身份证
- 高级认证：人脸识别 + 公安库比对
- 认证标识展示（个人/企业/公众人物）
- 当事人认领机制

#### 4.3 作品展示
- 多媒体类型支持：图文/视频/小说/课程
- 简介 + 外链形式（不托管内容）
- 分类标签管理
- 置顶/排序功能

#### 4.4 AI 助手
- 对话式交互
- 数据分析（账号健康度、增长建议）
- 内容创作辅助（标题、文案、脚本）
- 竞品分析
- 运营策略建议

#### 4.5 群组/主页创建
- 创建者：可创建公众人物/影视/单位主页
- 认领机制：当事人认领后拥有管理权
- 贡献分成：创建者获得打赏分成和贡献分
- 权限分级：创建者/协作者/查看者

### 交互细节
- 平台账号添加：输入ID → 自动获取数据 → 确认展示
- AI 助手：打字机效果回复，支持 Markdown
- 作品展示：点击展开详情，悬浮显示操作按钮
- 表单验证：实时校验，红色边框 + 错误提示

---

## 5. Component Inventory

### 5.1 ProfileCard (用户信息卡)
- 头像（支持裁剪上传）
- 昵称、认证标签、简介
- 统计数据（粉丝/作品/获赞）
- 编辑/预览模式切换

### 5.2 PlatformLink (平台链接)
- 平台图标 + 名称
- 粉丝数/影响力指标
- 状态指示（正常/异常/未连接）
- 悬停：显示快捷操作

### 5.3 WorkCard (作品卡片)
- 封面图/视频预览
- 标题 + 简介摘要
- 平台标识 + 发布时间
- 点击：跳转外链

### 5.4 AIChatWidget (AI对话组件)
- 消息气泡（用户/AI 区分）
- 打字机效果
- 快捷问题推荐
- 加载状态骨架屏

### 5.5 AuthBadge (认证标识)
- 认证级别图标
- Tooltip 显示认证信息
- 点击：展示认证详情

---

## 6. Technical Approach

### 技术栈
```
Frontend:
  - Next.js 14 (App Router)
  - TypeScript
  - TailwindCSS
  - shadcn/ui
  - Framer Motion

Backend:
  - Next.js API Routes
  - PostgreSQL (数据存储)
  - Redis (缓存)
  - Prisma (ORM)

AI:
  - OpenAI API (GPT-4)
  - Vector DB for 知识库

Auth:
  - NextAuth.js
  - 实名认证对接
```

### API 设计
```
POST   /api/auth/register        # 注册
POST   /api/auth/login           # 登录
POST   /api/auth/verify          # 实名认证

GET    /api/profile/:username     # 获取主页
PUT    /api/profile               # 更新个人资料

POST   /api/platforms             # 添加平台账号
GET    /api/platforms             # 获取已连接平台
DELETE /api/platforms/:id        # 删除平台账号

POST   /api/works                # 添加作品
GET    /api/works                # 获取作品列表
PUT    /api/works/:id            # 更新作品
DELETE /api/works/:id            # 删除作品

POST   /api/ai/chat              # AI 对话
POST   /api/ai/analyze           # 数据分析

POST   /api/group/create          # 创建群组主页
POST   /api/group/:id/claim      # 认领主页
```

### 数据模型
```prisma
model User {
  id            String   @id @default(cuid())
  username      String   @unique
  email         String   @unique
  passwordHash  String
  avatar        String?
  bio           String?
  isVerified    Boolean  @default(false)
  verifyLevel   String   @default("none") // basic, advanced
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Platform {
  id        String   @id @default(cuid())
  userId    String
  platform  String   // douyin, xiaohongshu, bilibili...
  handle    String
  displayName String?
  followers Int?
  avatar    String?
  url       String?
  status    String   @default("active")
  lastSync  DateTime?
}

model Work {
  id          String   @id @default(cuid())
  userId      String
  type        String   // article, video, novel, course
  title       String
  summary     String?
  cover       String?
  url         String
  platform    String
  tags        String[]
  isPinned    Boolean  @default(false)
  createdAt   DateTime @default(now())
}

model Group {
  id          String   @id @default(cuid())
  creatorId   String
  name        String
  type        String   // person, movie, organization
  description String?
  isClaimed   Boolean  @default(false)
  claimerId   String?
  revenueShare Float   @default(0.1)
  createdAt   DateTime @default(now())
}
```

---

## 7. 里程碑计划

### Phase 1: MVP (2-3周)
- ✅ 用户注册/登录
- ✅ 个人主页展示
- ✅ 平台账号添加（5个主流平台）
- ✅ 基础 AI 问答

### Phase 2: 增强 (2-3周)
- 📝 作品展示功能
- 🔐 实名认证系统
- 📊 数据分析仪表盘

### Phase 3: 生态 (2-3周)
- 👥 群组主页创建
- 🤖 AI 内容创作
- 📢 一键发布（看平台政策）

---

## 8. Q&A / 待验证

1. 各平台 API 权限申请流程？
2. 实名认证是否需要第三方服务商？
3. 变现模式：认证收费/功能订阅/交易分成？
4. 数据存储规模和成本估算？
