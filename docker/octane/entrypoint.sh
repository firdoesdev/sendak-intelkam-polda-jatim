#!/bin/sh
set -e

PUBLIC_SRC="/var/www/html/public"
PUBLIC_DEST="/srv/public"

# Ensure destination exists
mkdir -p "$PUBLIC_DEST"

# Remove old storage entry (may be a dangling symlink from previous builds)
rm -rf "$PUBLIC_DEST/storage"

# Copy built assets from image to shared nginx volume, excluding storage
for item in "$PUBLIC_SRC"/*; do
    name=$(basename "$item")
    [ "$name" = "storage" ] && continue
    cp -r "$item" "$PUBLIC_DEST/"
done

# Create storage directory placeholder for nginx
mkdir -p "$PUBLIC_DEST/storage"

# Fix ownership
chown -R www-data:www-data "$PUBLIC_DEST" /var/www/html/storage /var/www/html/bootstrap/cache

exec /usr/bin/supervisord -c /etc/supervisord.conf
