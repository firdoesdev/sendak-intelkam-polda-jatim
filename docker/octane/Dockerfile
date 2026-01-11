FROM php:8.3-cli-alpine

# 1️⃣ Runtime + build deps + brotli
RUN apk add --no-cache \
    bash \
    git \
    curl \
    libpq-dev \
    icu-dev \
    oniguruma-dev \
    zip \
    unzip \
    supervisor \
    autoconf \
    make \
    g++ \
    linux-headers \
    brotli-dev \
    zstd-dev

# 2️⃣ PHP extensions
RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    intl \
    mbstring \
    opcache \
    pcntl

# 3️⃣ Install Swoole (BIARKAN DEFAULT)
RUN pecl install swoole \
    && docker-php-ext-enable swoole

# 4️⃣ Config
COPY docker/octane/php.ini /usr/local/etc/php/conf.d/custom.ini
# COPY supervisor/octane.conf /etc/supervisor/conf.d/octane.conf
COPY supervisor/octane.ini /etc/supervisor.d/octane.ini


WORKDIR /var/www/html

CMD ["/usr/bin/supervisord", "-n"]
