# Forum MVP Design Spec

## Overview

团队内部论坛，用于讨论与知识共享。

**技术栈**：Next.js, GraphQL (graphql-yoga), Hono, Prisma, Module Federation, AWS, Cloudflare

## Architecture

```
用户 → Cloudflare (DNS/CDN/WAF)
        ↓
   AWS Amplify (Next.js Shell + 微前端应用)
        ↓
   API Gateway (HTTP API) → Lambda (Hono + GraphQL Yoga + Prisma)
        ↓
   Amazon RDS PostgreSQL
```

### Layer Responsibilities

- **Cloudflare**: DNS 解析、CDN 缓存静态资源、WAF 防护。不跑业务逻辑。
- **AWS Amplify**: 托管所有 Next.js 微前端应用（Shell + 3 个子应用），SSR/SSG 渲染。
- **API Gateway + Lambda**: Hono 运行在 Lambda 上，提供 GraphQL API。API Gateway 处理路由、限流、CORS。
- **RDS PostgreSQL**: 所有业务数据存储 + 全文搜索（tsvector/tsquery）。

## Micro-Frontend Architecture

使用 Module Federation（`@module-federation/nextjs-mf`），Shell 作为 host，其余 3 个作为 remote。

| App | Responsibility | Route | Exposed Modules |
|-----|---------------|-------|-----------------|
| Shell (host) | 布局、导航、认证状态、MF 加载、urql Client | `/` | - |
| Forum (remote) | 帖子列表、详情、发帖、回复 | `/forum/*` | `ForumPage`, `PostDetailPage`, `CreatePostPage` |
| User (remote) | 用户中心、个人资料、设置 | `/user/*` | `ProfilePage`, `SettingsPage` |
| Admin (remote) | 板块管理、用户管理、内容审核 | `/admin/*` | `BoardManagePage`, `UserManagePage` |

### Shared Dependencies

`react`, `react-dom`, `graphql`, `urql`

### Frontend Stack

- **GraphQL Client**: urql（轻量，支持 SSR）
- **Styling**: Tailwind CSS（各子应用共享配置，Shell 统一引入）
- **Auth**: NextAuth.js Session Provider 在 Shell 层，共享给所有子应用

## Data Model

```sql
-- 用户表
users
  id            UUID PK
  email         VARCHAR UNIQUE
  name          VARCHAR
  avatar_url    VARCHAR
  role          ENUM('member', 'admin')
  created_at    TIMESTAMP

-- 板块表
boards
  id            UUID PK
  name          VARCHAR
  description   TEXT
  sort_order    INT
  created_at    TIMESTAMP

-- 帖子表
posts
  id            UUID PK
  board_id      UUID FK → boards
  author_id     UUID FK → users
  title         VARCHAR
  content       TEXT
  search_vector TSVECTOR  -- 全文搜索索引，GIN index
  reply_count   INT DEFAULT 0
  created_at    TIMESTAMP
  updated_at    TIMESTAMP

-- 回复表
replies
  id            UUID PK
  post_id       UUID FK → posts
  author_id     UUID FK → users
  content       TEXT
  created_at    TIMESTAMP
```

**Key decisions**:
- `search_vector`: PostgreSQL trigger 自动维护，对 `title + content` 建 GIN 索引
- `reply_count`: 冗余字段，避免列表页 COUNT 查询
- 回复扁平结构，不支持嵌套（MVP 简化）
- ORM: Prisma

## GraphQL API

Hono 作为 HTTP 框架，挂载 GraphQL Yoga handler。

```
Hono App
  ├── POST /graphql  → GraphQL Yoga handler
  └── GET  /health   → 健康检查
```

### Schema

```graphql
type Query {
  boards: [Board!]!
  board(id: ID!): Board
  posts(boardId: ID!, cursor: String, limit: Int): PostConnection!
  post(id: ID!): Post
  searchPosts(query: String!, cursor: String, limit: Int): PostConnection!
  me: User
}

type Mutation {
  createPost(input: CreatePostInput!): Post!
  createReply(input: CreateReplyInput!): Reply!
  updatePost(id: ID!, input: UpdatePostInput!): Post!
  deletePost(id: ID!): Boolean!
  deleteReply(id: ID!): Boolean!
  createBoard(input: CreateBoardInput!): Board!    # admin only
  updateBoard(id: ID!, input: UpdateBoardInput!): Board!  # admin only
}
```

### Key Decisions

- 分页: cursor-based（基于 `created_at`）
- 认证: NextAuth.js 颁发 JWT，Hono 中间件校验，通过 GraphQL context 传递用户信息
- 权限: Hono 中间件层做角色校验（admin 操作）

## Deployment & Infrastructure

### AWS Resources

| Service | Purpose |
|---------|---------|
| Amplify | 托管 4 个 Next.js 应用 |
| API Gateway (HTTP API) | GraphQL API 入口，CORS、限流 |
| Lambda | 运行 Hono + GraphQL Yoga + Prisma |
| RDS PostgreSQL | 数据库，db.t4g.micro |
| VPC | RDS 私有子网，Lambda 通过 VPC 访问 |
| Secrets Manager | 数据库密码、NextAuth secret |

### Cloudflare Resources

| Service | Purpose |
|---------|---------|
| DNS | 域名解析，指向 Amplify |
| CDN | 缓存静态资源 |
| WAF | 基础安全防护 |

### Deployment Flow

```
前端: Git Push → Amplify 自动构建部署
后端: Git Push → GitHub Actions → Lambda 部署
IaC:  AWS CDK 管理所有基础设施
```

### Environment

只做 production 环境，MVP 不搞多环境。

## MVP Core Features

1. **发帖与回复**: 创建帖子、浏览列表、查看详情、发表回复
2. **用户认证**: NextAuth.js，邮箱/密码登录
3. **板块分类**: 管理员创建板块，帖子归属板块
4. **搜索功能**: PostgreSQL 全文搜索（tsvector/tsquery）
