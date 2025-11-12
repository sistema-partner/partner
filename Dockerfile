# Dockerfile para Laravel com Inertia.js + React
FROM php:8.2-fpm-alpine

# Instalar dependências do sistema
RUN apk update && apk add --no-cache \
    git \
    curl \
    libpng-dev \
    oniguruma-dev \
    libxml2-dev \
    zip \
    unzip \
    nodejs \
    npm \
    sqlite \
    sqlite-dev \
    bash

# Instalar extensões PHP
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /var/www

# Copiar código da aplicação primeiro
COPY . .

# Instalar dependências PHP (com dev para build, depois remove)
RUN composer install --optimize-autoloader --no-interaction

# Instalar dependências Node.js (incluindo dev dependencies para build)
RUN npm ci

# Configurar permissões
RUN chown -R www-data:www-data /var/www \
    && chmod -R 755 /var/www/storage \
    && chmod -R 755 /var/www/bootstrap/cache

# Criar arquivo de banco SQLite se não existir
RUN mkdir -p database && touch database/database.sqlite

# Build do frontend
RUN npm run build

# Manter as dependências de desenvolvimento para que o Vite funcione
# RUN npm prune --production && composer install --no-dev --optimize-autoloader --no-interaction

# Expor porta
EXPOSE 8000

# Script de inicialização
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]