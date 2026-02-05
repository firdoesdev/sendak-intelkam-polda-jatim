FROM php:8.4-cli-alpine AS base

# Runtime dependencies
RUN apk add --no-cache \
    bash \
    curl \
    libpq \
    icu-libs \
    oniguruma \
    supervisor

# PHP extensions
RUN apk add --no-cache --virtual .build-deps \
    autoconf \
    make \
    g++ \
    linux-headers \
    libpq-dev \
    icu-dev \
    oniguruma-dev \
    openssl-dev \
    && docker-php-ext-install -j$(nproc) \
    pdo_pgsql \
    intl \
    mbstring \
    opcache \
    pcntl \
    sockets \
    && pecl install -D 'enable-sockets="yes" enable-openssl="yes" enable-http2="yes" enable-mysqlnd="no" enable-swoole-json="yes" enable-swoole-curl="no" enable-cares="no" enable-brotli="no" enable-zstd="no"' swoole \
    && docker-php-ext-enable swoole \
    && apk del .build-deps

# PHP config
COPY docker/octane/php.ini /usr/local/etc/php/conf.d/custom.ini

# Non-root user (www-data already exists in php:alpine, just ensure correct UID/GID)
RUN set -x && \
    deluser www-data 2>/dev/null || true && \
    delgroup www-data 2>/dev/null || true && \
    addgroup -g 1000 www-data && \
    adduser -D -u 1000 -G www-data www-data

WORKDIR /var/www/html

# ========== Build Stage ==========
FROM base AS build

# Build dependencies
RUN apk add --no-cache \
    git \
    nodejs \
    npm \
    zip \
    unzip

# Copy composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copy application files
COPY --chown=www-data:www-data . .

USER www-data

# Install PHP dependencies
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --optimize-autoloader \
    --classmap-authoritative



# Install Node dependencies & build frontend (need dev deps for build)
RUN npm ci && npm run build

# Clean up
RUN rm -rf node_modules .git tests

# ========== Production Stage ==========
FROM base AS production

# Copy built application
COPY --from=build --chown=www-data:www-data /var/www/html /var/www/html

# Supervisor config
COPY docker/octane/supervisord.conf /etc/supervisord.conf
COPY supervisor/octane.ini /etc/supervisor.d/octane.ini

# Set permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

USER www-data

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
