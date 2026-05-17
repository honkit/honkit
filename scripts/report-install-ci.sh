#!/usr/bin/env bash
# CI-safe sibling of `pnpm run report:install`: writes the same reports/install.log
# shape (leading `$ pnpm …` line + full install output) but uses a frozen lockfile and
# does not delete node_modules or pnpm-lock.yaml.
set -euo pipefail
mkdir -p reports
{
  echo '$ pnpm install --frozen-lockfile'
  pnpm install --frozen-lockfile
} 2>&1 | tee reports/install.log
