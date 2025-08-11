# Dockerfile
FROM alpine:3.18

# Instala PHP, extensões e utilitários
RUN apk add --no-cache \
    nginx \
    php82 \
    php82-fpm \
    php82-phar \
    php82-pdo_pgsql \
    php82-mbstring \
    php82-zip \
    php82-gd \
    php82-curl \
    php82-tokenizer \
    php82-fileinfo \
    php82-xml \
    php82-xmlwriter \
    php82-simplexml \
    php82-openssl \
    php82-session \
    php82-dom \
    php82-iconv \
    curl \
    git \
    unzip \
    supervisor

# Link simbólico para php
RUN ln -s /usr/bin/php82 /usr/bin/php

# Instala composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Configura PHP-FPM
RUN sed -i 's/127\.0\.0\.1:9000/\/var\/run\/php-fpm.sock/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php82/php-fpm.d/www.conf \
    && sed -i 's/;listen.group = nobody/listen.group = nginx/' /etc/php82/php-fpm.d/www.conf

# Configura Nginx
RUN mkdir -p /run/nginx
COPY docker/nginx.backend.conf /etc/nginx/http.d/default.conf

# Configura supervisord
COPY docker/supervisord.backend.conf /etc/supervisord.conf

# Copia código Laravel
WORKDIR /var/www/html
COPY . .

# Instala dependências do Laravel
RUN composer install --optimize-autoloader

# Permissões
RUN chown -R nginx:nginx storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

EXPOSE 80

CMD ["supervisord", "-c", "/etc/supervisord.conf"]
