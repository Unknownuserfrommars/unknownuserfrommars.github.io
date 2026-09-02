#!/usr/bin/env bash
# Deploy kevin-z.com to the VPS.
#
#   ./deploy.sh            # build, upload, reload Caddy
#   ./deploy.sh --dry-run  # show what would change, upload nothing
#
# Requires SSH access as root@130.94.33.254. Set KEY to whichever key works:
#   KEY=~/.ssh/kevin-z-deploy ./deploy.sh
set -euo pipefail

HOST="${HOST:-root@130.94.33.254}"
KEY="${KEY:-$HOME/.ssh/kevin-z-deploy}"
WEBROOT="${WEBROOT:-/var/www/kevin-z.com}"
SITE_URL="${SITE_URL:-https://kevin-z.com}"
DRY=""
[ "${1:-}" = "--dry-run" ] && DRY="--dry-run"

cd "$(dirname "$0")"

echo "==> building (canonical: $SITE_URL)"
SITE_URL="$SITE_URL" node build.js

SSH="ssh -i $KEY -o StrictHostKeyChecking=accept-new"

echo "==> checking connection"
$SSH "$HOST" "echo connected as \$(whoami) on \$(hostname)"

echo "==> ensuring web root exists"
$SSH "$HOST" "mkdir -p $WEBROOT"

echo "==> uploading"
# Only the files the site actually serves. Build inputs stay local.
rsync -av --delete $DRY \
  -e "$SSH" \
  --include='index.html' \
  --include='og.jpg' \
  --exclude='*' \
  ./ "$HOST:$WEBROOT/"

if [ -n "$DRY" ]; then
  echo "==> dry run, stopping before Caddy reload"
  exit 0
fi

echo "==> installing Caddyfile"
scp -i "$KEY" Caddyfile "$HOST:/etc/caddy/Caddyfile"

echo "==> validating Caddy config"
$SSH "$HOST" "caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile"

echo "==> reloading Caddy"
$SSH "$HOST" "systemctl reload caddy && systemctl is-active caddy"

echo "==> done. verifying over HTTPS"
sleep 3
curl -sS -o /dev/null -w 'HTTP %{http_code}  TLS %{ssl_verify_result}\n' "$SITE_URL/" || \
  echo "HTTPS still failing - check: journalctl -u caddy -n 50 --no-pager"
