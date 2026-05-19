#!/bin/sh
set -e
pnpm exec prisma generate
pnpm dev
