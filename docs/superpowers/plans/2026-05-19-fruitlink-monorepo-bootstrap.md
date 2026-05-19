# FruitLink Monorepo Bootstrap Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dựng monorepo FruitLink chạy local bằng Docker Compose với `web`, `api`, `postgres`, `redis`, `minio`, `mailpit`, có `Makefile` ngắn gọn và PostgreSQL truy cập được từ `DBeaver`.

**Architecture:** Dự án dùng monorepo `pnpm + Turborepo`, gồm `apps/web` cho Next.js, `apps/api` cho NestJS, `packages/ui` cho design tokens và base UI, `packages/types` cho shared types, cùng hạ tầng local đặt ở root và `infra/`. Backend là modular monolith dùng PostgreSQL, Redis, MinIO; frontend bám token từ `DESIGN.md`. Mọi chuỗi hiển thị ra người dùng cuối phải dùng tiếng Việt có dấu 100%.

**Tech Stack:** Next.js, NestJS, TypeScript, Tailwind CSS, Prisma, PostgreSQL, Redis, MinIO, Mailpit, Docker Compose, Makefile, pnpm workspaces, Turborepo

---

### Task 1: Khởi tạo workspace monorepo

**Files:**
- Create: `package.json`
- Create: `pnpm-workspace.yaml`
- Create: `turbo.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Create: `.editorconfig`
- Create: `.env.example`
- Create: `README.md`

- [ ] **Step 1: Tạo failing checklist bằng cách xác nhận root chưa có các file workspace**

Run: `ls package.json pnpm-workspace.yaml turbo.json .env.example`
Expected: lỗi `No such file or directory` cho ít nhất một file

- [ ] **Step 2: Tạo `package.json` root cho workspace**

```json
{
  "name": "fruitlink",
  "private": true,
  "packageManager": "pnpm@10.0.0",
  "scripts": {
    "dev": "turbo run dev --parallel",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "typecheck": "turbo run typecheck",
    "format": "turbo run format"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

- [ ] **Step 3: Tạo `pnpm-workspace.yaml`**

```yaml
packages:
  - apps/*
  - packages/*
```

- [ ] **Step 4: Tạo `turbo.json`**

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "format": {
      "cache": false
    }
  }
}
```

- [ ] **Step 5: Tạo các file root cơ bản**

```gitignore
node_modules
.turbo
.next
dist
.env
.env.local
coverage
pnpm-lock.yaml
```

```ini
strict-peer-dependencies=false
auto-install-peers=true
```

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
indent_style = space
indent_size = 2
trim_trailing_whitespace = true
```

```env
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
API_PORT=4000
DATABASE_URL=postgresql://fruitlink:fruitlink@postgres:5432/fruitlink
DIRECT_DATABASE_URL=postgresql://fruitlink:fruitlink@127.0.0.1:5432/fruitlink
REDIS_URL=redis://redis:6379
MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123
MINIO_ENDPOINT=http://minio:9000
MINIO_PUBLIC_ENDPOINT=http://localhost:9000
MINIO_BUCKET=fruitlink
MAILPIT_SMTP_PORT=1025
MAILPIT_UI_PORT=8025
POSTGRES_DB=fruitlink
POSTGRES_USER=fruitlink
POSTGRES_PASSWORD=fruitlink
POSTGRES_PORT=5432
```

```md
# FruitLink

Monorepo bootstrap cho nền tảng FruitLink.
```

- [ ] **Step 6: Chạy kiểm tra root files**

Run: `ls package.json pnpm-workspace.yaml turbo.json .env.example README.md`
Expected: hiển thị đầy đủ các file vừa tạo

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-workspace.yaml turbo.json .gitignore .npmrc .editorconfig .env.example README.md
git commit -m "chore: initialize monorepo workspace"
```

### Task 2: Tạo package cấu hình dùng chung

**Files:**
- Create: `packages/config/package.json`
- Create: `packages/config/tsconfig/base.json`
- Create: `packages/config/eslint/base.cjs`
- Create: `packages/config/prettier/base.cjs`
- Create: `packages/types/package.json`
- Create: `packages/types/src/index.ts`
- Create: `packages/types/tsconfig.json`

- [ ] **Step 1: Viết failing test dạng existence check cho package dùng chung**

Run: `ls packages/config packages/types`
Expected: lỗi `No such file or directory`

- [ ] **Step 2: Tạo `packages/config/package.json`**

```json
{
  "name": "@fruitlink/config",
  "private": true,
  "version": "0.0.0"
}
```

- [ ] **Step 3: Tạo cấu hình TypeScript, ESLint, Prettier dùng chung**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@fruitlink/types": ["../../types/src"]
    }
  }
}
```

```js
module.exports = {
  root: false,
  extends: ["next/core-web-vitals"],
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};
```

```js
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all'
};
```

- [ ] **Step 4: Tạo `packages/types` với contract nền**

```json
{
  "name": "@fruitlink/types",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "src/index.ts"
}
```

```json
{
  "extends": "../config/tsconfig/base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

```ts
export type UserRole = 'investor' | 'farmer' | 'admin';

export type ProjectStatus = 'draft' | 'open' | 'funded' | 'growing' | 'harvested' | 'closed';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'cancelled';
```

- [ ] **Step 5: Chạy kiểm tra package structure**

Run: `find packages -maxdepth 3 -type f | sort`
Expected: liệt kê đủ file trong `packages/config` và `packages/types`

- [ ] **Step 6: Commit**

```bash
git add packages/config packages/types
git commit -m "chore: add shared config and types packages"
```

### Task 3: Dựng `apps/web` với token UI theo `DESIGN.md`

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/postcss.config.js`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/app/page.tsx`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/(app)/dashboard/page.tsx`
- Create: `apps/web/src/app/(admin)/admin/page.tsx`

- [ ] **Step 1: Viết failing test bằng cách chạy tìm app web trước khi tạo**

Run: `ls apps/web`
Expected: lỗi `No such file or directory`

- [ ] **Step 2: Tạo `apps/web/package.json`**

```json
{
  "name": "@fruitlink/web",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "next dev --hostname 0.0.0.0 --port 3000",
    "build": "next build",
    "start": "next start --hostname 0.0.0.0 --port 3000",
    "lint": "next lint",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@fruitlink/types": "workspace:*",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Tạo cấu hình Next.js và TypeScript**

```ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;
```

```json
{
  "extends": "../../packages/config/tsconfig/base.json",
  "compilerOptions": {
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "src/**/*.ts", "src/**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **Step 4: Tạo `tailwind.config.ts` và `globals.css` chứa design tokens**

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--color-midnight-ink)',
        accent: 'var(--color-accent-green)',
        canvas: 'var(--color-canvas-white)'
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)'
      }
    }
  },
  plugins: []
};

export default config;
```

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --color-midnight-ink: #000000;
  --color-canvas-white: #ffffff;
  --color-charcoal-border: #171717;
  --color-shadow-base: #0a0a0d;
  --color-pale-ash: #f5f5f5;
  --color-accent-green: #a3e635;
  --color-card-saffron: #fef3c8;
  --color-card-lavender: #fae9ff;
  --color-card-mint: #d2fae5;
  --color-card-pink: #f5d1fe;
  --color-highlight-yellow: #fbbf25;
  --gradient-sky-breeze: linear-gradient(rgb(137, 229, 240), rgb(182, 239, 246) 27%, rgb(204, 243, 250) 35%, rgb(197, 243, 248) 55%);
  --shadow-subtle: rgb(10, 10, 13) 2px 2px 0px 0px;
}

html,
body {
  margin: 0;
  padding: 0;
  background: var(--color-canvas-white);
  color: var(--color-midnight-ink);
  font-family: var(--font-satoshi, ui-sans-serif, system-ui, sans-serif);
}
```

- [ ] **Step 5: Tạo layout và các trang stub**

```tsx
import './globals.css';
import type { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="mb-4 inline-flex rounded-full border border-black bg-white px-4 py-2 text-sm">
          FruitLink
        </p>
        <h1 className="max-w-4xl text-5xl font-bold">Đầu tư nông sản minh bạch, theo dõi đến ngày thu hoạch.</h1>
      </section>
    </main>
  );
}
```

```tsx
export default function DashboardPage() {
  return <main className="p-6">Bảng điều khiển nhà đầu tư và nông dân</main>;
}
```

```tsx
export default function AdminPage() {
  return <main className="p-6">Cổng quản trị hệ thống</main>;
}
```

- [ ] **Step 6: Chạy typecheck cho web**

Run: `pnpm --filter @fruitlink/web typecheck`
Expected: PASS không lỗi TypeScript

- [ ] **Step 7: Commit**

```bash
git add apps/web
git commit -m "feat: scaffold nextjs web app with design tokens"
```

### Task 4: Dựng `packages/ui` cho component nền

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/src/index.ts`
- Create: `packages/ui/src/components/button.tsx`
- Create: `packages/ui/src/components/card.tsx`
- Create: `packages/ui/src/components/badge.tsx`
- Create: `packages/ui/tsconfig.json`

- [ ] **Step 1: Viết failing test bằng cách import package chưa tồn tại**

Run: `ls packages/ui`
Expected: lỗi `No such file or directory`

- [ ] **Step 2: Tạo `packages/ui/package.json` và `tsconfig.json`**

```json
{
  "name": "@fruitlink/ui",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "main": "src/index.ts",
  "peerDependencies": {
    "react": "^19.0.0"
  }
}
```

```json
{
  "extends": "../config/tsconfig/base.json",
  "compilerOptions": {
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Tạo component nền**

```tsx
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center rounded border px-6 py-3 text-sm font-semibold';
  const tone =
    variant === 'primary'
      ? 'border-black bg-[var(--color-accent-green)] text-black shadow-[var(--shadow-subtle)]'
      : 'border-black bg-white text-black shadow-[var(--shadow-subtle)]';

  return <button className={`${base} ${tone} ${className}`.trim()} {...props} />;
}
```

```tsx
import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-lg border border-black bg-white p-6 ${className}`.trim()} {...props} />;
}
```

```tsx
import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex rounded-full border border-black px-3 py-1 text-sm ${className}`.trim()} {...props} />;
}
```

```ts
export * from './components/button';
export * from './components/card';
export * from './components/badge';
```

- [ ] **Step 4: Kiểm tra package UI**

Run: `find packages/ui -maxdepth 3 -type f | sort`
Expected: hiện đủ file `package.json`, `tsconfig.json`, `src/index.ts`, `src/components/*`

- [ ] **Step 5: Commit**

```bash
git add packages/ui
git commit -m "feat: add shared ui package"
```

### Task 5: Dựng `apps/api` với NestJS và module nền

**Files:**
- Create: `apps/api/package.json`
- Create: `apps/api/tsconfig.json`
- Create: `apps/api/tsconfig.build.json`
- Create: `apps/api/nest-cli.json`
- Create: `apps/api/src/main.ts`
- Create: `apps/api/src/app.module.ts`
- Create: `apps/api/src/health/health.controller.ts`
- Create: `apps/api/src/config/env.ts`
- Create: `apps/api/src/modules/auth/auth.module.ts`
- Create: `apps/api/src/modules/users/users.module.ts`
- Create: `apps/api/src/modules/projects/projects.module.ts`
- Create: `apps/api/src/modules/investments/investments.module.ts`

- [ ] **Step 1: Viết failing test bằng cách kiểm tra app API chưa tồn tại**

Run: `ls apps/api`
Expected: lỗi `No such file or directory`

- [ ] **Step 2: Tạo `apps/api/package.json`**

```json
{
  "name": "@fruitlink/api",
  "private": true,
  "version": "0.0.0",
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main.js",
    "lint": "eslint \"src/**/*.ts\"",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@nestjs/common": "^11.0.0",
    "@nestjs/config": "^4.0.0",
    "@nestjs/core": "^11.0.0",
    "@nestjs/platform-express": "^11.0.0",
    "@nestjs/swagger": "^11.0.0",
    "@prisma/client": "^6.0.0",
    "reflect-metadata": "^0.2.2",
    "rxjs": "^7.8.1"
  },
  "devDependencies": {
    "@nestjs/cli": "^11.0.0",
    "@nestjs/schematics": "^11.0.0",
    "@nestjs/testing": "^11.0.0",
    "prisma": "^6.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.0"
  }
}
```

- [ ] **Step 3: Tạo cấu hình NestJS**

```json
{
  "extends": "../../packages/config/tsconfig/base.json",
  "compilerOptions": {
    "module": "commonjs",
    "declaration": true,
    "removeComments": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*.ts", "prisma/**/*.ts"]
}
```

```json
{
  "extends": "./tsconfig.json",
  "exclude": ["node_modules", "dist", "test", "**/*spec.ts"]
}
```

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src"
}
```

- [ ] **Step 4: Tạo bootstrap API và module health**

```ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const config = new DocumentBuilder().setTitle('FruitLink API').setVersion('1.0.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.API_PORT || 4000);
}

bootstrap();
```

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { InvestmentsModule } from './modules/investments/investments.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, UsersModule, ProjectsModule, InvestmentsModule],
  controllers: [HealthController]
})
export class AppModule {}
```

```ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return { status: 'ok' };
  }
}
```

- [ ] **Step 5: Tạo stub module nghiệp vụ**

```ts
import { Module } from '@nestjs/common';

@Module({})
export class AuthModule {}
```

```ts
import { Module } from '@nestjs/common';

@Module({})
export class UsersModule {}
```

```ts
import { Module } from '@nestjs/common';

@Module({})
export class ProjectsModule {}
```

```ts
import { Module } from '@nestjs/common';

@Module({})
export class InvestmentsModule {}
```

- [ ] **Step 6: Chạy typecheck cho API**

Run: `pnpm --filter @fruitlink/api typecheck`
Expected: PASS không lỗi TypeScript

- [ ] **Step 7: Commit**

```bash
git add apps/api
git commit -m "feat: scaffold nestjs api app"
```

### Task 6: Thêm Prisma schema nền và kết nối PostgreSQL

**Files:**
- Create: `apps/api/prisma/schema.prisma`
- Create: `apps/api/src/prisma/prisma.module.ts`
- Create: `apps/api/src/prisma/prisma.service.ts`
- Modify: `apps/api/src/app.module.ts`

- [ ] **Step 1: Viết failing test bằng cách chạy Prisma validate trước khi có schema**

Run: `pnpm --filter @fruitlink/api exec prisma validate`
Expected: FAIL với lỗi không tìm thấy `schema.prisma`

- [ ] **Step 2: Tạo `schema.prisma`**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  fullName  String?
  role      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Project {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  status      String
  location    String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model InvestmentOrder {
  id          String   @id @default(cuid())
  userId      String
  projectId   String
  amount      Decimal  @db.Decimal(12, 2)
  status      String
  createdAt   DateTime @default(now())
}
```

- [ ] **Step 3: Tạo Prisma service**

```ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService]
})
export class PrismaModule {}
```

```ts
import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
```

- [ ] **Step 4: Import `PrismaModule` vào `AppModule`**

```ts
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule, AuthModule, UsersModule, ProjectsModule, InvestmentsModule],
  controllers: [HealthController]
})
export class AppModule {}
```

- [ ] **Step 5: Chạy Prisma validate**

Run: `pnpm --filter @fruitlink/api exec prisma validate`
Expected: PASS với thông báo schema hợp lệ

- [ ] **Step 6: Commit**

```bash
git add apps/api/prisma apps/api/src/prisma apps/api/src/app.module.ts
git commit -m "feat: add prisma and postgres base schema"
```

### Task 7: Tạo Dockerfiles cho `web` và `api`

**Files:**
- Create: `infra/docker/web.Dockerfile`
- Create: `infra/docker/api.Dockerfile`
- Create: `infra/docker/web.entrypoint.sh`
- Create: `infra/docker/api.entrypoint.sh`

- [ ] **Step 1: Viết failing test bằng cách kiểm tra Dockerfiles chưa tồn tại**

Run: `ls infra/docker`
Expected: lỗi `No such file or directory` hoặc thư mục chưa có file

- [ ] **Step 2: Tạo Dockerfile cho `web`**

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/web/package.json apps/web/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/ui/package.json packages/ui/package.json

RUN pnpm install

COPY . .

WORKDIR /app/apps/web

RUN chmod +x /app/infra/docker/web.entrypoint.sh

CMD ["/app/infra/docker/web.entrypoint.sh"]
```

- [ ] **Step 3: Tạo Dockerfile cho `api`**

```dockerfile
FROM node:22-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/api/package.json apps/api/package.json
COPY packages/types/package.json packages/types/package.json
COPY packages/config/package.json packages/config/package.json

RUN pnpm install

COPY . .

WORKDIR /app/apps/api

RUN chmod +x /app/infra/docker/api.entrypoint.sh

CMD ["/app/infra/docker/api.entrypoint.sh"]
```

- [ ] **Step 4: Tạo entrypoint scripts**

```sh
#!/bin/sh
set -e
pnpm install
pnpm dev
```

```sh
#!/bin/sh
set -e
pnpm install
pnpm exec prisma generate
pnpm dev
```

- [ ] **Step 5: Kiểm tra Docker files**

Run: `find infra -maxdepth 3 -type f | sort`
Expected: hiện đủ 4 file Docker và entrypoint

- [ ] **Step 6: Commit**

```bash
git add infra/docker
git commit -m "chore: add dockerfiles for web and api"
```

### Task 8: Tạo `docker-compose.yml` cho toàn bộ local stack

**Files:**
- Create: `docker-compose.yml`

- [ ] **Step 1: Viết failing test bằng cách chạy compose config trước khi có file**

Run: `docker compose config`
Expected: FAIL với lỗi không tìm thấy `docker-compose.yml`

- [ ] **Step 2: Tạo `docker-compose.yml`**

```yaml
services:
  web:
    build:
      context: .
      dockerfile: infra/docker/web.Dockerfile
    working_dir: /app/apps/web
    env_file:
      - .env.example
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - web_node_modules:/app/node_modules
    depends_on:
      - api

  api:
    build:
      context: .
      dockerfile: infra/docker/api.Dockerfile
    working_dir: /app/apps/api
    env_file:
      - .env.example
    ports:
      - "4000:4000"
    volumes:
      - .:/app
      - api_node_modules:/app/node_modules
    depends_on:
      - postgres
      - redis
      - minio

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: fruitlink
      POSTGRES_USER: fruitlink
      POSTGRES_PASSWORD: fruitlink
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: minio
      MINIO_ROOT_PASSWORD: minio123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data

  mailpit:
    image: axllent/mailpit:latest
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  web_node_modules:
  api_node_modules:
  postgres_data:
  minio_data:
```

- [ ] **Step 3: Chạy `docker compose config`**

Run: `docker compose config`
Expected: PASS và render cấu hình đầy đủ các service

- [ ] **Step 4: Commit**

```bash
git add docker-compose.yml
git commit -m "chore: add local docker compose stack"
```

### Task 9: Tạo `Makefile` phục vụ local development

**Files:**
- Create: `Makefile`

- [ ] **Step 1: Viết failing test bằng cách gọi make target trước khi có file**

Run: `make up`
Expected: FAIL với lỗi không có rule hoặc không có `Makefile`

- [ ] **Step 2: Tạo `Makefile`**

```make
.PHONY: up down logs ps restart build shell-api shell-web db-studio

up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

ps:
	docker compose ps

restart:
	docker compose restart

build:
	docker compose build

shell-api:
	docker compose exec api sh

shell-web:
	docker compose exec web sh

db-studio:
	docker compose exec api pnpm exec prisma studio --hostname 0.0.0.0 --port 5555
```

- [ ] **Step 3: Kiểm tra make targets**

Run: `make -pn | rg "^(up|down|logs|ps|restart|build|shell-api|shell-web|db-studio):"`
Expected: PASS và hiển thị đầy đủ target

- [ ] **Step 4: Commit**

```bash
git add Makefile
git commit -m "chore: add developer make targets"
```

### Task 10: Thêm tài liệu hướng dẫn chạy local và kết nối `DBeaver`

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Viết failing test bằng cách kiểm tra README chưa có phần Docker và DBeaver**

Run: `rg -n "DBeaver|docker compose|make up" README.md`
Expected: không có kết quả

- [ ] **Step 2: Cập nhật `README.md`**

```md
# FruitLink

Monorepo bootstrap cho nền tảng FruitLink.

## Local development

### Yêu cầu

- Docker
- Docker Compose
- pnpm

### Chạy dự án

```bash
make up
```

Web: `http://localhost:3000`
API: `http://localhost:4000/api`
Swagger: `http://localhost:4000/docs`
Mailpit: `http://localhost:8025`
MinIO Console: `http://localhost:9001`

### Dừng dự án

```bash
make down
```

### Kết nối PostgreSQL bằng DBeaver

- Host: `127.0.0.1`
- Port: `5432`
- Database: `fruitlink`
- Username: `fruitlink`
- Password: `fruitlink`

### Lệnh hữu ích

```bash
make logs
make ps
make shell-api
make shell-web
```

### Quy ước ngôn ngữ

- Toàn bộ giao diện người dùng cuối phải dùng tiếng Việt có dấu 100%
- Không dùng chuỗi tiếng Anh cho menu, nhãn, nút bấm, thông báo hoặc trạng thái hiển thị
```

- [ ] **Step 3: Chạy kiểm tra README**

Run: `rg -n "DBeaver|make up|localhost:5432|Swagger" README.md`
Expected: PASS và hiện đúng các dòng hướng dẫn

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: add local setup and dbeaver guide"
```

### Task 11: Xác thực bootstrap end-to-end

**Files:**
- Modify: `apps/api/prisma/schema.prisma`
- Modify: `README.md`
- Modify: `docker-compose.yml`

- [ ] **Step 1: Chạy cài dependency toàn workspace**

Run: `pnpm install`
Expected: PASS và tạo lockfile

- [ ] **Step 2: Chạy typecheck toàn workspace**

Run: `pnpm typecheck`
Expected: PASS với `@fruitlink/web` và `@fruitlink/api`

- [ ] **Step 3: Chạy Docker stack**

Run: `make up`
Expected: PASS và tất cả service `web`, `api`, `postgres`, `redis`, `minio`, `mailpit` lên trạng thái running

- [ ] **Step 4: Kiểm tra health API**

Run: `curl http://localhost:4000/api/health`
Expected: trả về `{"status":"ok"}`

- [ ] **Step 5: Kiểm tra web**

Run: `curl -I http://localhost:3000`
Expected: trả về `HTTP/1.1 200 OK` hoặc redirect hợp lệ của Next.js

- [ ] **Step 6: Kiểm tra PostgreSQL cho DBeaver**

Run: `docker compose ps postgres`
Expected: container `postgres` chạy và publish `0.0.0.0:5432->5432/tcp`

- [ ] **Step 7: Nếu bước nào fail, sửa tối thiểu đúng file gây lỗi**

```bash
pnpm install
pnpm typecheck
docker compose config
make up
```

- [ ] **Step 8: Commit**

```bash
git add pnpm-lock.yaml apps api packages docker-compose.yml README.md Makefile
git commit -m "test: verify local bootstrap stack"
```

## Self-review

Spec coverage:
- Stack, monorepo, Docker, Makefile, PostgreSQL cho `DBeaver`, web/api bootstrap và token UI đều đã có task riêng.
- Phase 1 business modules mới scaffold, chưa đi sâu nghiệp vụ đầu tư, nhật ký, QR. Phần đó cần plan tiếp theo sau khi bootstrap hoàn tất.

Placeholder scan:
- Không dùng `TODO`, `TBD`, hay tham chiếu mơ hồ kiểu “làm tương tự task trước”.
- Mọi task đều có file đích, lệnh chạy và expected outcome.

Type consistency:
- Tên package và app nhất quán: `@fruitlink/web`, `@fruitlink/api`, `@fruitlink/types`, `@fruitlink/ui`, `@fruitlink/config`.
- Cấu hình PostgreSQL và `DBeaver` nhất quán với `.env.example`: database `fruitlink`, user `fruitlink`, password `fruitlink`, port `5432`.
