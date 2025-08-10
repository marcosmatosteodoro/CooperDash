# Base com Nginx, PHP-FPM e Node (para build do Next.js)
FROM alpine:3.18

# Instala dependências
RUN apk add --no-cache \
    nginx \
    supervisor \
    curl \
    git \
    unzip \
    nodejs \
    npm \
    php82 \
    php82-fpm \
    php82-phar \
    php82-openssl \
    php82-pdo_pgsql \
    php82-opcache \
    php82-mbstring \
    php82-zip \
    php82-gd \
    php82-curl \
    php82-tokenizer \
    php82-fileinfo \
    php82-session \
    php82-dom \
    php82-xml \
    php82-xmlwriter \
    php82-simplexml \
    php82-iconv

# Link simbólico para php
RUN ln -s /usr/bin/php82 /usr/bin/php

# Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer && \
    chmod +x /usr/local/bin/composer

# Cria pastas e limpa config default do nginx
RUN mkdir -p /run/nginx /var/log/supervisor /var/log/nginx /var/log/php-fpm \
    && mkdir -p /var/www/html \
    && chown -R nginx:nginx /var/www/html \
    && rm /etc/nginx/http.d/default.conf

# Copia configurações customizadas
COPY docker/nginx.conf /etc/nginx/http.d/app.conf
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Configura PHP-FPM
RUN sed -i 's/;clear_env = no/clear_env = no/' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's/listen = 127.0.0.1:9000/listen = \/var\/run\/php-fpm.sock/' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's/;listen.owner = nobody/listen.owner = nginx/' /etc/php82/php-fpm.d/www.conf && \
    sed -i 's/;listen.group = nobody/listen.group = nginx/' /etc/php82/php-fpm.d/www.conf

# Laravel (copia todo o código antes para o composer ter acesso ao artisan)
WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --optimize-autoloader

# Build Next.js
WORKDIR /var/www/html/frontend
RUN npm install && npm run build

# Cria pasta para logs do Next.js
RUN mkdir -p /var/log/nextjs \
    && chown -R nginx:nginx /var/log/nextjs
    
# Ajusta permissões Laravel
WORKDIR /var/www/html
RUN chown -R nginx:nginx storage bootstrap/cache

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
