#!/usr/bin/env bash

# -----------------------------------------------------------------------------
# EverGrove - Automated Production Deployment Script
# Target Server: ever-grove.co.uk (/var/www/evergrove)
# -----------------------------------------------------------------------------

set -e

APP_DIR="/var/www/evergrove"
cd "$APP_DIR"

echo "🌲 [1/8] Entering Maintenance Mode..."
php artisan down --render="errors::503" --retry=60 2>/dev/null || true

if [ -d ".git" ]; then
    echo "📥 [2/8] Fetching latest code from Git..."
    git pull origin main
else
    echo "⏩ [2/8] Not a git clone or git pull skipped."
fi

echo "📦 [3/8] Installing Composer dependencies (No Dev)..."
composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction

echo "⚡ [4/8] Building Frontend Assets with Vite..."
if [ -f "package-lock.json" ]; then
    npm ci --prefer-offline --no-audit
else
    npm install --no-audit
fi
npm run build

echo "🗄️ [5/8] Preparing Database & Running Migrations..."
mkdir -p database
if [ ! -f "database/database.sqlite" ]; then
    touch database/database.sqlite
    echo "Created database/database.sqlite"
fi
php artisan migrate --force

echo "🚀 [6/8] Caching Configurations & Routes..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

echo "🔒 [7/8] Fixing Directory and SQLite File Permissions..."
chown -R www-data:www-data "$APP_DIR"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap/cache" "$APP_DIR/database"
chmod 664 "$APP_DIR/database/database.sqlite" 2>/dev/null || true

echo "🔄 [8/8] Reloading PHP 8.4 FPM & Exiting Maintenance Mode..."
sudo systemctl reload php8.4-fpm 2>/dev/null || true
php artisan up

echo "✅ EverGrove deployed successfully to https://ever-grove.co.uk !"
