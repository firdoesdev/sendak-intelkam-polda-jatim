FROM php:8.3-cli-alpine AS base

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
    && docker-php-ext-install -j$(nproc) \
        pdo_pgsql \
        intl \
        mbstring \
        opcache \
        pcntl \
    && pecl install swoole \
    && docker-php-ext-enable swoole \
    && apk del .build-deps

# PHP config
COPY docker/octane/php.ini /usr/local/etc/php/conf.d/custom.ini

# Non-root user
RUN addgroup -g 1000 www-data && \
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

# Install Node dependencies & build frontend
RUN npm ci --omit=dev && npm run build

# Clean up
RUN rm -rf node_modules .git tests

# ========== Production Stage ==========
FROM base AS production

# Copy built application
COPY --from=build --chown=www-data:www-data /var/www/html /var/www/html

# Supervisor config
COPY supervisor/octane.ini /etc/supervisor.d/octane.ini

# Set permissions
RUN chown -R www-data:www-data \
    /var/www/html/storage \
    /var/www/html/bootstrap/cache

USER www-data

EXPOSE 8000

CMD ["/usr/bin/supervisord", "-n"]
