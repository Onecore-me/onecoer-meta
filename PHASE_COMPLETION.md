# OneCore 元栈 — Phase 1 完成交接文档

> 由 MaxClaw 完成 · 2026-03-30 · 交接给 Qclaw 继续 Phase 2

---

## 📦 Phase 1 最终产物

**技术栈：** Next.js 14 + Prisma 7 + SQLite + TailwindCSS + TypeScript

**9个页面（全部 HTTP 200）：**
- `/` 首页（品牌展示 + CTA）
- `/login` 登录（含服务端邮箱/密码验证）
- `/register` 注册（含服务端输入校验：邮箱格式、用户名格式、密码长度）
- `/dashboard` 仪表盘（实时读取 API 统计数据）
- `/profile` 编辑个人资料（头像/昵称/简介）
- `/platforms` 平台账号管理（12个平台 CRUD，含添加/删除/链接跳转）
- `/works` 作品管理（图文/视频/课程/小说 CRUD，含标签、浏览量）
- `/profile/[username]` 公开主页（平台聚合卡片 + 作品列表）
- `/ai` AI 运营助手（多后端对话 + 4个快捷功能）

**6个 API 路由：**
- `POST/GET /api/auth` — 注册/登录/个人资料（含输入验证、409冲突检测）
- `PUT /api/profile` — 更新用户资料
- `GET/POST/PUT/DELETE /api/platforms` — 平台账号 CRUD
- `GET/POST/PUT/DELETE /api/works` — 作品 CRUD
- `GET /api/users/[username]` — 公开用户数据（无鉴权）
- `POST /api/chat` — AI 对话（支持 OpenAI / SiliconFlow / 阿里通义千问）

**数据库模型（Prisma + SQLite）：**
- `User` — 用户（email/username/passwordHash/avatar/bio/isVerified）
- `Platform` — 平台账号（platform/handle/followers/url）
- `Work` — 作品（type/title/summary/cover/url/platform/tags/views）

---

## ✅ Phase 1 已通过的质量检查

| 检查项 | 结果 |
|--------|------|
| TypeScript `tsc --noEmit` | ✅ 零错误 |
| `pnpm build` | ✅ 16/16 页面生成 |
| 全链路 E2E | ✅ 注册→登录→平台→作品→主页 |
| 服务端输入验证 | ✅ 邮箱/用户名/密码格式 |
| JWT 密钥一致性 | ✅ 全路由统一 fallback |
| 重复注册检测 | ✅ 409 冲突响应 |
| AI 无 Key 降级 | ✅ 优雅提示，不崩溃 |

---

## 🔧 已知局限 / 待 Phase 2 处理

1. **AI Chat** 依赖外部 API Key（环境变量：`AI_PROVIDER` + `OPENAI_API_KEY` / `SILICONFLOW_API_KEY` / `DASHSCOPE_API_KEY`）
2. **实名认证** 功能仅有字段（`isVerified`、`verifyLevel`），认证流程未实现
3. **平台数据同步** 是手动录入，暂无自动抓取
4. **头像上传** 支持 URL 方式，暂无文件上传
5. **作品置顶** 功能已有字段，但 UI 无控制开关
6. **ContactSection / WorksSection** 组件存在于 `components/` 目录，但未集成到公开主页
7. **所有平台页面的 UI 设计** 较基础，暂无复杂交互动画

---

## 🚀 本地启动命令

```bash
cd /workspace/onecore
pnpm install        # 或 pnpm
pnpm build         # 生产构建
PORT=3000 node ./node_modules/next/dist/bin/next start  # 启动
```

**预览地址：** `http://localhost:3000`

---

## 📁 关键文件路径

| 用途 | 路径 |
|------|------|
| 数据库 Schema | `prisma/schema.prisma` |
| 认证上下文 | `contexts/AuthContext.tsx` |
| 公共组件 | `components/` |
| 首页 | `app/page.tsx` |
| API 路由 | `app/api/` |
| 页面路由 | `app/(auth)/`、`app/dashboard/`、`app/profile/` |
| 全局样式 | `app/globals.css`（深色主题，Slate 配色）|
| 环境变量示例 | `.env`（`DATABASE_URL`、`JWT_SECRET`、`AI_xxx_API_KEY`）|

---

## 🎯 Phase 2 建议优先任务

1. 将 `ContactSection`、`WorksSection` 组件集成到 `/profile/[username]` 公开主页
2. 实现头像文件上传（替代 URL 输入）
3. 完成实名认证页面和流程
4. 添加更多平台支持（Twitter、微信公众号等）
5. UI/UX 打磨：加载动画、错误反馈、空状态设计
6. 添加 `robots.txt` / SEO 元信息
7. 生产环境 `.env` 配置指导文档

---

*如需更多信息，请查阅 `SPEC.md`（产品规范）或 `MEMORY.md`（Agent 记忆文件）*
