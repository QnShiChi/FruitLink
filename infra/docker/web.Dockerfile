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

CMD ["sh", "/app/infra/docker/web.entrypoint.sh"]
