#!/bin/sh
set -e
pnpm install --force
pnpm exec prisma generate
pnpm dev
