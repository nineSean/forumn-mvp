# Forum MVP

Team-internal forum MVP for discussion and knowledge sharing.

This project is built as a `pnpm` monorepo with a micro-frontend frontend, a GraphQL API, and AWS infrastructure code in the same repository.

## Overview

The app is split into one shell app and three remote apps:

- `Shell`: layout, navigation, auth state, shared providers
- `Forum`: post list, post detail, create post, replies
- `User`: profile and settings
- `Admin`: board management and user management

Backend responsibilities live in the API package:

- Hono HTTP app
- GraphQL Yoga schema and resolvers
- Prisma ORM
- PostgreSQL persistence
- NextAuth credentials login through the shell

## Architecture

Production architecture from the project spec:

```text
User
  -> Cloudflare (DNS / CDN / WAF)
  -> AWS Amplify (Next.js shell + remotes)
  -> API Gateway
  -> Lambda (Hono + GraphQL Yoga + Prisma)
  -> PostgreSQL
```

Frontend architecture:

- `packages/shell` is the Module Federation host
- `packages/forum`, `packages/user`, and `packages/admin` are remotes
- Next.js Pages Router is used instead of App Router
- Shared frontend utilities live in `packages/shared`

## Monorepo Layout

```text
packages/
  api/      GraphQL API, Prisma schema, auth middleware
  shell/    Next.js host app
  forum/    Forum remote
  user/     User remote
  admin/    Admin remote
  shared/   Shared GraphQL docs, types, urql client helpers
  infra/    AWS CDK stacks
docs/
  superpowers/specs/  Design notes
  superpowers/plans/  Implementation plan
```

## Core Features

- Posts and replies
- Board categories
- Search
- Credentials-based authentication
- Admin board management

Current routes in the shell:

- `/` -> redirects to `/forum`
- `/forum`
- `/forum/new`
- `/forum/:postId`
- `/user`
- `/user/settings`
- `/admin`
- `/admin/users`
- `/search`

## Tech Stack

- `pnpm` workspaces
- Turborepo
- Next.js 14
- Module Federation via `@module-federation/nextjs-mf`
- React 18
- Tailwind CSS
- Hono
- GraphQL Yoga
- Prisma
- PostgreSQL
- NextAuth
- AWS CDK

## Local Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Prepare the database

The local database URL is read from [packages/api/.env](/Users/ninesean/Repos/playground/forum-mvp/packages/api/.env).

Apply the current schema:

```bash
pnpm --filter @forum/api exec prisma db push
```

Open Prisma Studio:

```bash
pnpm --filter @forum/api exec prisma studio
```

### 3. Start the API

```bash
pnpm dev:api
```

Health check:

- [http://localhost:4000/health](http://localhost:4000/health)

### 4. Start the frontend apps

```bash
pnpm dev:frontend
```

Or run everything together:

```bash
pnpm dev
```

Local app URLs:

- Shell: [http://localhost:3000](http://localhost:3000)
- Forum remote: [http://localhost:3001](http://localhost:3001)
- User remote: [http://localhost:3002](http://localhost:3002)
- Admin remote: [http://localhost:3003](http://localhost:3003)

## Useful Commands

```bash
pnpm build
pnpm test
pnpm lint
pnpm dev:api
pnpm dev:frontend
pnpm --filter @forum/api exec prisma studio
pnpm --filter @forum/api exec prisma db push
```

## Authentication Notes

- Login is handled by NextAuth credentials provider in the shell
- The shell calls the API `login` GraphQL query
- The local API must be running for sign-in to work
- A local database user is required for successful login

## Docs

Primary project docs:

- Design spec: [docs/superpowers/specs/2026-03-22-forum-mvp-design.md](/Users/ninesean/Repos/playground/forum-mvp/docs/superpowers/specs/2026-03-22-forum-mvp-design.md)
- Implementation plan: [docs/superpowers/plans/2026-03-22-forum-mvp.md](/Users/ninesean/Repos/playground/forum-mvp/docs/superpowers/plans/2026-03-22-forum-mvp.md)

## Status

This repository already includes working local development flows for:

- shell-to-remote routing
- create-post navigation
- credentials login against the local API

Deployment-oriented infrastructure code also exists under `packages/infra`, but local development is the fastest way to explore the project.
