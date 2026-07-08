# www.eafon.net 个人门户网站 — 需求提案

> 版本：v0.1  
> 日期：2026-07-08  
> 状态：草案，待评审

---

## 1. 项目概述

### 1.1 背景

当前 [blog](../blog) 项目（`blog.eafon.net`）是个人私有后台，用于撰写与管理技术笔记、书签及开发工具。现需新建独立项目 **www**，部署于 `www.eafon.net`，作为面向公众的**只读个人门户网站**，展示经筛选后发布的笔记及其他个人内容。

两个项目**共用同一 PostgreSQL 数据库**，内容在 blog 中创作与管理，在 www 中只读展示。

### 1.2 目标

| 目标 | 说明 |
|------|------|
| 公开展示 | 将 blog 中标记为「已发布」的笔记以精美、易读的方式呈现 |
| 个人门户 | 不仅是博客，而是完整的个人网站（首页、笔记、书签、关于等） |
| 只读安全 | www 全站无写操作，不暴露管理接口，降低攻击面 |
| 视觉一致 | UI 严格遵循 [`DESIGN-apple.md`](./DESIGN-apple.md) 中的 Apple 风格设计规范 |
| 独立部署 | 与 blog 同服务器、独立 Docker 容器，Caddy 多域名路由 |

### 1.3 非目标（明确不做）

- www 不提供登录、注册、评论、点赞等交互写能力
- www 不提供笔记/书签的增删改功能
- www 不复制 blog 的开发工具（JSON 格式化、URL 编解码等）—— 工具留在私有后台
- www 不管理 AI 配置、用户账号等敏感数据（仅读取展示所需字段）

---

## 2. 已确认决策

以下事项已在需求讨论中确认：

| 项 | 决策 |
|----|------|
| 站点定位 | 完整个人门户（笔记 + 个人主页 + 书签 + 其他板块） |
| 内容发布控制 | 在 blog 的 `Note` 模型新增 `published` 字段，手动控制每篇是否公开 |
| 技术栈 | 与 blog 一致：Next.js + Prisma + Tailwind CSS |
| 笔记 URL | `/notes/{uuid}`，与 blog 内部 ID 一致，实现简单 |
| 部署方式 | 与 blog 同服务器，www 独立 Docker 容器 + Caddy 多域名 |
| UI 风格 | 遵循 `DESIGN-apple.md`（摄影优先、低密度、Action Blue 单强调色、SF Pro 字体体系） |
| v1 板块 | 首页 + 笔记 + 书签 |
| 静态内容 | 数据库 `SiteConfig`，blog 后台维护 |
| 双站关系 | blog 与 www 均可公开访问，www 为精美展示层 |
| 图片方案 | www 挂载共享 `uploads` 卷，自行提供静态服务 |

---

## 3. 已确认事项（补充）

以下事项已在评审中确认：

### 3.1 v1 板块范围

| 板块 | v1 | 说明 |
|------|-----|------|
| 首页 Hero + 精选笔记 | ✅ | |
| 笔记列表 / 详情 / 标签筛选 | ✅ | 核心功能 |
| 书签导航 | ✅ | |
| 关于我 | v2 | 依赖 `SiteConfig`，后续迭代 |
| 项目展示 | v2 | |
| RSS 订阅 | v2 | |
| 联系方式 / 社交链接 | v2 | 可通过 `SiteConfig` 在 v2 接入 |

### 3.2 静态内容维护方式

**决策：存数据库，在 blog 后台管理。**

v1 引入 `SiteConfig` 键值表，blog 设置页提供编辑入口；www 只读查询。适用于首页文案、关于页内容、社交链接等。

### 3.3 blog 与 www 的关系

**决策：双公开。** `blog.eafon.net` 保持现有功能（含登录后台），`www.eafon.net` 是面向公众的精美展示层。两者可独立访问，内容通过共享数据库同步。

### 3.4 笔记图片展示策略

**决策：www 容器挂载与 blog 相同的 `uploads` 目录，自行提供静态文件服务。**

- 生产路径与 blog 一致：`/data/project/blog/uploads` → 容器内 `/app/uploads`
- www 提供 `/uploads/{filename}` 路由（或 Next.js static file serving）
- Markdown 渲染时将 `/api/uploads/...` 路径规范化为 www 域名的 `/uploads/...`
- www 可独立于 blog 进程提供图片，域名统一

### 3.5 书签公开控制

书签纳入 v1，需在 blog 新增 `published` 字段（默认 `true` 或 `false` 实施时与站主确认）。www 仅展示 `published = true` 的书签。

---

## 4. 用户角色

| 角色 | 使用场景 | 使用站点 |
|------|----------|----------|
| 访客 | 浏览笔记、书签、关于页 | www.eafon.net |
| 站主（你） | 撰写笔记、标记发布、管理书签 | blog.eafon.net |

www 仅服务「访客」角色，无认证流程。

---

## 5. 功能需求

### 5.1 首页 `/`

Apple 风格的全屏板块堆叠（参考 `DESIGN-apple.md` 中 product-tile 节奏）：

- **Hero 区**：个人名称 / 一句话介绍（`hero-display` 标题 + `lead` 副文案）
- **精选笔记**：最近发布的 3–5 篇笔记，卡片或 tile 形式展示
- **快捷入口**：笔记、书签、关于等板块的导航 tile（浅色 / 深色交替）
- **页脚**：版权、备案信息（如有）、社交链接

首页数据全部只读查询，支持 ISR/SSG 缓存。

### 5.2 笔记模块

#### 5.2.1 笔记列表 `/notes`

- 仅展示 `published = true` 且 `deletedAt IS NULL` 的笔记
- 按 `updatedAt` 降序排列
- 支持按标签筛选：`/notes?tag=xxx`
- 支持分页或无限滚动（v1 建议简单分页，每页 20 篇）
- 列表项展示：标题、摘要（content 前 200 字纯文本）、标签、更新时间、所属文件夹名（可选）

#### 5.2.2 笔记详情 `/notes/{id}`

- UUID 路由，与 blog 笔记 ID 一致
- Markdown 渲染（`react-markdown` + `remark-gfm` + `rehype-highlight`，与 blog 对齐）
- 展示：标题、正文、标签、发布/更新时间
- 代码块语法高亮
- 图片正确加载（见 3.4 待确认）
- 未发布或已删除笔记返回 404
- 基础 SEO：`title`、`description`、Open Graph

#### 5.2.3 标签页 `/tags` 或 `/tags/{name}`

- 展示所有已发布笔记涉及的标签列表
- 点击标签跳转筛选后的笔记列表

### 5.3 书签模块 `/bookmarks`（v1）

- 读取 `bookmarks` + `bookmark_categories` 表
- 仅展示 `published = true` 的书签
- 按分类分组展示，保留 `order` 排序
- 外链新窗口打开（`target="_blank" rel="noopener noreferrer"`）
- 展示站点图标（`icon` 字段）

### 5.4 关于页 `/about`（v2）

- 个人简介、头像、技能标签、工作经历等
- Apple 风格 editorial 排版（`lead-airy` 段落 + 低密度留白）
- 内容来自 `SiteConfig` 表，blog 后台维护

### 5.5 全局导航

遵循 `DESIGN-apple.md` 组件规范：

- **`global-nav`**：顶部 44px 黑色导航栏，站点 Logo/名称 + 主导航链接
- **`sub-nav-frosted`**（可选）：二级导航或面包屑，毛玻璃效果
- 移动端 ≤ 834px 折叠为汉堡菜单
- 导航项建议：首页、笔记、书签（关于页 v2 加入）

### 5.6 全站只读约束

www 项目**不得**包含以下能力：

- 任何 `POST` / `PUT` / `PATCH` / `DELETE` API Route
- 登录 / Session / Cookie 认证
- 文件上传
- 表单提交（除搜索框等纯客户端过滤外）
- 对 `AiSetting`、`User` 表的任何查询

Prisma Client 在 www 中仅用于 `SELECT` 查询，建议使用只读数据库用户（见 §8.3）。

---

## 6. 数据层设计

### 6.1 共用数据库

| 项 | 值 |
|----|-----|
| 数据库 | PostgreSQL（与 blog 相同实例） |
| 连接串 | 同一 `DATABASE_URL`，或 www 使用只读账号 |
| Schema 管理 | 由 **blog** 项目维护 Prisma migrations |
| www 角色 | 消费 schema，不独立迁移（或 symlink 共用 `prisma/schema.prisma`） |

### 6.2 blog 侧 Schema 变更（www 的前置依赖）

#### 6.2.1 Note 新增 `published` 字段

```prisma
model Note {
  // ...existing fields
  published   Boolean   @default(false)
  publishedAt DateTime?

  @@index([published])
}
```

**行为约定：**

- blog 笔记编辑器增加「发布到门户」开关
- 首次发布时写入 `publishedAt = now()`
- 取消发布时 `published = false`，`publishedAt` 保留（记录首次发布时间）
- www 仅查询 `published = true AND deletedAt IS NULL`

#### 6.2.2 书签公开控制（若纳入 v1）

```prisma
model Bookmark {
  // ...existing fields
  published Boolean @default(true)  // 或 false，待确认默认值
}
```

#### 6.2.3 站点配置表（v1 引入，v2 页面消费）

```prisma
model SiteConfig {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  value     String   @db.Text
  updatedAt DateTime @updatedAt

  @@map("site_config")
}
```

v1 可先建表 + blog 后台编辑能力，供首页 Hero 文案等使用；关于页等完整消费留 v2。

### 6.3 www 查询范围

| 表 | www 是否读取 | 条件 |
|----|-------------|------|
| `notes` | ✅ | `published = true`, `deletedAt IS NULL` |
| `tags` / `note_tags` | ✅ | 关联已发布笔记 |
| `folders` | ✅（可选） | 展示分类名 |
| `images` | ✅ | 关联已发布笔记 |
| `bookmarks` | ✅（若启用） | 按公开策略 |
| `bookmark_categories` | ✅（若启用） | 全部 |
| `users` | ❌ | 不读取 |
| `ai_settings` | ❌ | 不读取 |

---

## 7. UI / UX 规范

### 7.1 设计系统引用

所有视觉与交互决策以 [`DESIGN-apple.md`](./DESIGN-apple.md) 为唯一设计规范，实施时须：

1. 将 YAML token（颜色、字体、圆角、间距）映射为 Tailwind CSS 变量 / theme extension
2. 组件命名与文档中的 component key 对齐（如 `global-nav`、`product-tile-light`、`button-primary`）
3. 字体栈：`SF Pro Display/Text, system-ui, -apple-system`，非 Apple 平台回退 **Inter**
4. 强调色唯一：`#0066cc`（Action Blue），禁止引入第二品牌色
5. 按钮 active 态统一 `transform: scale(0.95)`
6. 阴影仅用于产品/配图，卡片和按钮不加阴影

### 7.2 页面布局原则

- **低密度**：每屏一个主题，section 间距 80px（`spacing.section`）
- **深浅交替**：浅色 tile（`#ffffff` / `#f5f5f7`）与深色 tile（`#272729`）交替，色块即分隔
- **内容居中**：文本区 max-width ~980px，卡片网格 max-width ~1440px
- **响应式**：遵循文档 §Responsive Behavior 断点表（419 / 640 / 734 / 834 / 1068 / 1440px）

### 7.3 笔记阅读体验

笔记详情页在 Apple 门户框架内，正文区采用阅读优化排版：

- 正文 17px / line-height 1.47（`typography.body`）
- 代码块使用 highlight.js 主题，与浅色/深色 tile 背景协调
- 宽代码块横向滚动，不撑破布局

### 7.4 主题模式

`DESIGN-apple.md` 记录的是 Apple 日间/light-dominant 变体。v1 建议：

- **默认浅色**（与文档一致）
- 暂不实现 dark mode（文档 Known Gaps 亦未覆盖 store 暗色变体）
- v2 可评估是否在深色 tile 板块外增加全局 dark mode

---

## 8. 技术方案

### 8.1 技术栈

| 层 | 选型 | 说明 |
|----|------|------|
| 框架 | Next.js 16（App Router） | 与 blog 版本对齐 |
| 语言 | TypeScript | |
| 样式 | Tailwind CSS 4 | token 映射为 CSS variables |
| ORM | Prisma 7 | 共用 schema，client 生成到 www 项目内 |
| Markdown | react-markdown + remark-gfm + rehype-highlight | 与 blog 一致 |
| 部署 | Docker + Caddy | 独立容器，端口如 3001 |

### 8.2 项目结构（建议）

```
www/
├── docs/
│   ├── proposal.md          # 本文档
│   └── DESIGN-apple.md      # UI 设计规范
├── prisma/                  # symlink 或复制 blog/schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx       # global-nav + footer
│   │   ├── page.tsx         # 首页
│   │   ├── notes/
│   │   │   ├── page.tsx     # 笔记列表
│   │   │   └── [id]/page.tsx
│   │   ├── bookmarks/page.tsx
│   │   ├── about/page.tsx
│   │   └── tags/[name]/page.tsx
│   ├── components/
│   │   ├── layout/          # GlobalNav, Footer, SubNav
│   │   ├── notes/           # NoteCard, MarkdownRenderer
│   │   └── ui/              # Button, Tile 等基础组件
│   ├── lib/
│   │   ├── db.ts            # Prisma client（只读）
│   │   └── notes.ts         # 查询封装
│   └── styles/
│       └── tokens.css       # DESIGN-apple token 变量
├── deploy/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── caddy/               # 或扩展现有 blog Caddy 配置
├── package.json
└── .env.example
```

### 8.3 数据库安全

生产环境建议为 www 创建**只读数据库用户**：

```sql
CREATE USER www_reader WITH PASSWORD '...';
GRANT CONNECT ON DATABASE blog TO www_reader;
GRANT USAGE ON SCHEMA public TO www_reader;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO www_reader;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO www_reader;
```

www 的 `DATABASE_URL` 使用 `www_reader` 账号，即使代码误写 mutation 也会在数据库层被拒绝。

### 8.4 缓存策略

| 页面 | 策略 |  revalidate |
|------|------|-------------|
| 首页 | ISR | 60s |
| 笔记列表 | ISR | 60s |
| 笔记详情 | ISR | 60s |
| 书签 / 关于 | ISR 或 SSG | 300s / build 时 |

发布笔记后，可在 blog 侧调用 www 的 revalidate webhook（v2 优化，v1 可依赖 TTL）。

### 8.5 与 blog 的代码关系

- **不**将 blog 作为 npm 依赖引入
- Prisma schema 通过 monorepo 内 symlink 或 CI 同步保持一致
- UI 组件独立实现（风格遵循同一 DESIGN 文档，但不复用 blog 的 shadcn 组件）
- Markdown 渲染逻辑可参考 blog，复制最小必要代码

---

## 9. 部署架构

### 9.1 拓扑

```
                    Internet
                        │
                   Caddy (:443)
                   /         \
        blog.eafon.net    www.eafon.net
              │                │
         blog-app:3000    www-app:3001
              │                │
              └───────┬────────┘
                      │
              PostgreSQL (共享)
              uploads 卷（共享，若采用图片方案 B）
```

### 9.2 Caddy 配置扩展

在现有 blog Caddy 配置上增加 `www.eafon.net` 站点块，反向代理至 `127.0.0.1:3001`。SSL 证书沿用 HTTP-01 自动签发流程（注意 Cloudflare 灰云要求，见 blog `deploy/.env.example` 说明）。

### 9.3 环境变量（www）

```env
DATABASE_URL=postgresql://www_reader:密码@postgres:5432/blog
NEXT_PUBLIC_SITE_URL=https://www.eafon.net
UPLOAD_DIR=/app/uploads
```

---

## 10. blog 配套改动清单

www 上线前，blog 项目需完成：

| # | 改动 | 优先级 |
|---|------|--------|
| 1 | `Note` 表新增 `published` / `publishedAt` 字段 + migration | P0 |
| 2 | 笔记编辑器增加「发布到门户」开关 UI | P0 |
| 3 | 笔记列表显示发布状态标识 | P1 |
| 4 | 书签 `published` 字段 | P0 |
| 5 | `SiteConfig` 模型 + blog 设置页编辑 | P1 |

---

## 11. 非功能需求

### 11.1 性能

- Lighthouse Performance ≥ 90（移动端）
- 首页 LCP < 2.5s
- 图片 lazy-load + WebP（若后续优化上传流程）

### 11.2 SEO

- 每页独立 `<title>` 与 `meta description`
- 笔记详情 Open Graph（`og:title`, `og:description`, `og:type=article`）
- `/sitemap.xml` 自动生成（v1 或 v2）
- `/robots.txt` 允许全站爬取
- RSS `/feed.xml`（待确认是否 v1）

### 11.3 安全

- 全站只读，无写 API
- 数据库只读账号
- 响应头：`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`（与 blog Caddy 配置一致）
- 不暴露 `/api` 管理接口

### 11.4 可访问性

- 语义化 HTML（`nav`, `main`, `article`, `footer`）
- 图片 `alt` 文本
- 键盘可聚焦导航与按钮
- 焦点环使用 `#0071e3`（`primary-focus`）

---

## 12. 实施阶段建议

### Phase 0 — 准备（当前）

- [x] 创建 www 项目目录
- [x] 编写需求文档（本文档）
- [x] 确认需求待决事项
- [ ] 评审并通过 proposal

### Phase 1 — 基础设施

- [ ] blog：Note `published` 字段 migration + 编辑器开关
- [ ] www：Next.js 项目初始化 + Tailwind token 映射
- [ ] www：Prisma 接入 + 只读查询封装
- [ ] www：GlobalNav + Footer 布局骨架

### Phase 2 — 核心页面

- [ ] 首页
- [ ] 笔记列表 + 详情 + Markdown 渲染
- [ ] 标签筛选
- [ ] 图片加载方案落地

### Phase 3 — 扩展板块

- [ ] 书签页
- [ ] `SiteConfig` 首页文案接入
- [ ] Sitemap（建议 v1 末尾）

### Phase 3.5 — v2 迭代

- [ ] 关于页（`SiteConfig` 驱动）
- [ ] RSS `/feed.xml`
- [ ] 项目展示板块

### Phase 4 — 部署上线

- [ ] Dockerfile + docker-compose
- [ ] Caddy 多域名配置
- [ ] 生产环境只读数据库用户
- [ ] 域名 DNS 解析 + SSL 验证

---

## 13. 风险与缓解

| 风险 | 影响 | 缓解 |
|------|------|------|
| 未发布笔记意外公开 | 隐私泄露 | `published` 默认 `false`；www 查询硬编码过滤条件 |
| blog schema 变更不同步 | www 查询报错 | symlink 共用 schema；CI 检查一致性 |
| 图片跨域 / 路径问题 | 笔记图片无法显示 | 提前确认图片方案；共享 uploads 卷 |
| Apple 风格与内容密度冲突 | 长文笔记阅读体验差 | 详情页内使用阅读模式子布局，外围保持 tile 框架 |
| SF Pro 字体在非 Apple 设备缺失 | 视觉偏差 | Inter 回退 + letter-spacing 微调（见 DESIGN 文档） |

---

## 14. 成功标准

v1 上线时满足：

1. `www.eafon.net` HTTPS 可访问，UI 符合 `DESIGN-apple.md` 核心特征（导航、tile 节奏、Action Blue、字体层级）
2. blog 中标记「已发布」的笔记在 www 可见，未发布/已删除笔记不可访问
3. 笔记 Markdown（含代码块、图片、GFM 表格）正确渲染
4. 全站无可用的写接口
5. 移动端导航与排版正常（≤ 640px 断点）

---

## 附录 A：路由总览

| 路径 | 页面 | v1 |
|------|------|-----|
| `/` | 首页 | ✅ |
| `/notes` | 笔记列表 | ✅ |
| `/notes/{uuid}` | 笔记详情 | ✅ |
| `/tags` | 标签索引 | ✅ |
| `/tags/{name}` | 按标签筛选 | ✅ |
| `/bookmarks` | 书签导航 | ✅ v1 |
| `/about` | 关于我 | v2 |
| `/feed.xml` | RSS | v2 |
| `/sitemap.xml` | 站点地图 | 建议 v1 末尾 |

---

## 附录 B：参考文档

- UI 设计规范：[`docs/DESIGN-apple.md`](./DESIGN-apple.md)
- Blog 项目：`../blog`
- Blog 数据模型：`../blog/prisma/schema.prisma`
- Blog 部署配置：`../blog/deploy/`
