# Etapa 1 - PHP + Composer
FROM php:8.2-fpm AS php-base

RUN apt-get update && apt-get install -y \
    git curl libpng-dev libonig-dev libxml2-dev zip unzip libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql mbstring exif pcntl bcmath gd

COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader
RUN cp .env.example .env && php artisan key:generate

RUN chown -R www-data:www-data /var/www/storage && chmod -R 775 /var/www/storage



# Etapa 2 - Node + Next.js build
FROM node:20 AS next-build

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --production=false

COPY frontend/ .
RUN npm run build



# Etapa 3 - Nginx + PHP-FPM + Node
FROM nginx:alpine AS production

# Instalar PHP-FPM e Node
RUN apk add --no-cache php82 php82-fpm php82-pdo_pgsql php82-mbstring php82-bcmath php82-gd php82-opcache php82-xml php82-tokenizer php82-json php82-session nodejs npm supervisor bash curl

# Configurar diretórios
WORKDIR /var/www

# Copiar Laravel da etapa PHP
COPY --from=php-base /var/www /var/www

# Copiar Next.js build
COPY --from=next-build /app/.next /var/www/frontend/.next
COPY --from=next-build /app/node_modules /var/www/frontend/node_modules
COPY --from=next-build /app/package*.json /var/www/frontend/

# Configuração do Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Configuração do Supervisor (para rodar PHP-FPM e Next.js juntos)
COPY supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
