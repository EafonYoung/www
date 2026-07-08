#!/bin/bash
# 转发到 blog 的 check.sh，默认检查 www-app
export APP_CONTAINER=www-app
exec "$(dirname "$0")/../../blog/deploy/check.sh"
