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

CMD ["sh", "/app/infra/docker/api.entrypoint.sh"]
