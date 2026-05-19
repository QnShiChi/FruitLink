#!/bin/sh
set -e
rm -rf dist
pnpm exec prisma generate
pnpm dev
