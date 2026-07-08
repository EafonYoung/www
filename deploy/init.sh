#!/bin/bash
# ============================================
# www.eafon.net 首次部署初始化
# ============================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

info()  { echo -e "${GREEN}[INFO]${NC} $1"; }
warn()  { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

if [ ! -f .env ]; then
    error ".env 文件不存在，请先执行：cp .env.example .env 并填写配置"
fi
source .env

[ -z "$SITE_URL" ] && error "SITE_URL 未配置"
[ -z "$DATABASE_URL" ] && error "DATABASE_URL 未配置"
[ -z "$POSTGRES_DOCKER_NETWORK" ] && error "POSTGRES_DOCKER_NETWORK 未配置"

if [[ "$DATABASE_URL" == *"你的密码"* ]]; then
    error "DATABASE_URL 仍为模板值，请填写真实连接串"
fi

if [ ! -d /data/project/blog/uploads ]; then
    warn "/data/project/blog/uploads 不存在，请确认 blog 已部署或手动创建该目录"
fi

info "构建并启动 www-app（监听 127.0.0.1:3001）..."
docker compose -p www up -d --build

info "============================================"
info "www 应用已启动"
info "本地验证: curl -I http://127.0.0.1:3001"
info ""
info "若尚未配置 HTTPS，请在 blog 的 deploy/.env 中设置："
info "  WWW_DOMAIN=www.eafon.net"
info "然后重启 blog Caddy："
info "  cd /data/project/blog/deploy && docker compose up -d caddy"
info "============================================"
