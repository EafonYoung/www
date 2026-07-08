#!/bin/bash
# ============================================
# www.eafon.net 同步到正式环境
# ============================================
#
# 服务器项目根目录：/data/project/www/
#
# 用法：
#   ./rsync.sh
#
# 注意：
# - 图片目录挂载 blog 的 /data/project/blog/uploads，无需同步 uploads
# - HTTPS 由 blog 项目的 Caddy 统一代理（www.eafon.net → :3001）

set -euo pipefail

REMOTE_USER="${REMOTE_USER:-ubuntu}"
REMOTE_HOST="${REMOTE_HOST:-ssh.91vst.com}"
REMOTE_PORT="${REMOTE_PORT:-22322}"
REMOTE_IDENTITY="${REMOTE_IDENTITY:-$HOME/.ssh/id_ed25519}"
REMOTE_ROOT="${REMOTE_ROOT:-/data/project/www}"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

SSH_CMD=(ssh -p "$REMOTE_PORT" -i "$REMOTE_IDENTITY" -o BatchMode=yes)
RSYNC_SSH="ssh -p ${REMOTE_PORT} -i ${REMOTE_IDENTITY} -o BatchMode=yes"
REMOTE="${REMOTE_USER}@${REMOTE_HOST}"

RSYNC_OPTS=(-avz --delete --progress --human-readable -e "$RSYNC_SSH")
RSYNC_EXCLUDES=(
    --exclude '.git/'
    --exclude 'node_modules/'
    --exclude '.next/'
    --exclude 'out/'
    --exclude 'coverage/'
    --exclude '.vercel/'
    --exclude '.DS_Store'
    --exclude '*.log'
    --exclude '.env'
    --exclude '.env.local'
    --exclude '.env.*.local'
    --exclude 'deploy/.env'
    --exclude 'src/generated/prisma/'
)

echo "目标服务器: ${REMOTE}:${REMOTE_PORT}"
echo "项目根目录: ${REMOTE_ROOT}"
echo

"${SSH_CMD[@]}" "${REMOTE}" "sudo mkdir -p ${REMOTE_ROOT} && sudo chown -R \$(id -u):\$(id -g) ${REMOTE_ROOT}"

echo ">>> 同步项目代码到 ${REMOTE_ROOT}"
rsync "${RSYNC_OPTS[@]}" "${RSYNC_EXCLUDES[@]}" \
    "${PROJECT_ROOT}/" "${REMOTE}:${REMOTE_ROOT}/"

cat <<EOF

同步完成。

在服务器上构建并启动：
  ssh -p ${REMOTE_PORT} -i ${REMOTE_IDENTITY} ${REMOTE}
  cd ${REMOTE_ROOT}/deploy
  # 首次：cp .env.example .env && vim .env
  docker compose -p www up -d --build

确保 blog 的 Caddy 已配置 WWW_DOMAIN=www.eafon.net 并已重启 blog-caddy。
EOF
