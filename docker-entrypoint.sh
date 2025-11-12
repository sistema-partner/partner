#!/bin/bash

# Script de inicialização para o container Laravel

set -e

echo "🚀 Iniciando configuração da aplicação..."

# Verificar se .env existe, se não, copiar do .env.example
if [ ! -f .env ]; then
    echo "📝 Criando arquivo .env..."
    cp .env.example .env
fi

# Gerar chave da aplicação se não existir
if grep -q "APP_KEY=$" .env; then
    echo "🔑 Gerando chave da aplicação..."
    php artisan key:generate --ansi
fi

# Aguardar banco de dados estar disponível (se usando MySQL/PostgreSQL)
if [ "$DB_CONNECTION" = "mysql" ] || [ "$DB_CONNECTION" = "pgsql" ]; then
    echo "⏳ Aguardando banco de dados..."
    while ! php artisan migrate:status --quiet 2>/dev/null; do
        echo "Aguardando conexão com o banco de dados..."
        sleep 2
    done
fi

# Executar migrações
echo "🗄️ Executando migrações..."
php artisan migrate --force

# Executar seeders se existirem
if [ "$APP_ENV" = "local" ] || [ "$RUN_SEEDERS" = "true" ]; then
    echo "🌱 Executando seeders..."
    php artisan db:seed --force || echo "⚠️ Nenhum seeder encontrado ou erro ao executar"
fi

# Limpar e otimizar cache
echo "🧹 Otimizando aplicação..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Configuração concluída!"

# Iniciar servidor Laravel
echo "🌐 Iniciando servidor Laravel na porta 8000..."
php artisan serve --host=0.0.0.0 --port=8000