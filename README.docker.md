# 🐳 Docker - Guia de Execução

Este guia mostra como executar a aplicação Partner usando Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker >= 20.10
- Docker Compose >= 2.0

## 🚀 Execução Rápida

1. **Clone o repositório** (se ainda não fez):
   ```bash
   git clone <url-do-repositorio>
   cd partner
   ```

2. **Configure as variáveis de ambiente**:
   ```bash
   cp .env.docker .env
   ```

3. **Construa e execute os containers**:
   ```bash
   docker-compose up -d --build
   ```

4. **Acesse a aplicação**:
   - Aplicação: http://localhost:8000
   - Mailhog (emails): http://localhost:8025
   - Redis: localhost:6379

## 📝 Comandos Úteis

### Gerenciamento de Containers

```bash
# Iniciar todos os serviços
docker-compose up -d

# Parar todos os serviços
docker-compose down

# Ver logs da aplicação
docker-compose logs -f app

# Ver logs de todos os serviços
docker-compose logs -f

# Reconstruir containers
docker-compose up -d --build

# Remover containers e volumes
docker-compose down -v
```

### Comandos Artisan

```bash
# Executar comandos artisan
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
docker-compose exec app php artisan tinker

# Limpar cache
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear

# Criar migration
docker-compose exec app php artisan make:migration create_example_table
```

### Comandos Composer e NPM

```bash
# Instalar dependências PHP
docker-compose exec app composer install

# Instalar dependências Node.js
docker-compose exec app npm install

# Build do frontend
docker-compose exec app npm run build

# Modo desenvolvimento do frontend
docker-compose exec app npm run dev
```

### Acesso ao Container

```bash
# Acessar shell do container
docker-compose exec app sh

# Acessar como root
docker-compose exec --user root app sh
```

## 🗄️ Opções de Banco de Dados

### SQLite (Padrão)

A configuração padrão usa SQLite, que é ideal para desenvolvimento. Nenhuma configuração adicional é necessária.

### MySQL

Para usar MySQL, descomente as linhas do serviço MySQL no `docker-compose.yml` e ajuste o `.env`:

```env
DB_CONNECTION=mysql
DB_HOST=mysql
DB_PORT=3306
DB_DATABASE=partner
DB_USERNAME=partner
DB_PASSWORD=secret
```

### PostgreSQL

Para usar PostgreSQL, descomente as linhas do serviço PostgreSQL no `docker-compose.yml` e ajuste o `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=postgres
DB_PORT=5432
DB_DATABASE=partner
DB_USERNAME=partner
DB_PASSWORD=secret
```

## 📧 Configuração de Email

### Desenvolvimento (Mailhog)

A configuração padrão usa Mailhog para capturar emails em desenvolvimento:
- SMTP: localhost:1025
- Interface Web: http://localhost:8025

### Produção (Mailtrap ou outro)

Para produção, ajuste as configurações MAIL_* no `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=seu_usuario
MAIL_PASSWORD=sua_senha
MAIL_ENCRYPTION=tls
```

## ⚡ Serviços Incluídos

- **app**: Aplicação Laravel principal
- **redis**: Cache e sessões
- **queue**: Worker para processar filas
- **mailhog**: Captura de emails para desenvolvimento
- **mysql/postgres** (opcional): Banco de dados alternativo

## 🔧 Resolução de Problemas

### Permissões

Se encontrar problemas de permissão:

```bash
# Ajustar permissões do storage
docker-compose exec --user root app chown -R www-data:www-data /var/www/storage
docker-compose exec --user root app chmod -R 755 /var/www/storage
```

### Banco de dados não conecta

1. Verifique se o serviço do banco está rodando:
   ```bash
   docker-compose ps
   ```

2. Veja os logs do serviço:
   ```bash
   docker-compose logs mysql  # ou postgres
   ```

3. Teste a conexão:
   ```bash
   docker-compose exec app php artisan migrate:status
   ```

### Reconstruir do zero

Se houver problemas persistentes:

```bash
# Parar tudo e remover volumes
docker-compose down -v

# Remover imagens locais
docker rmi partner-app partner-queue

# Reconstruir
docker-compose up -d --build

# Re-executar migrações
docker-compose exec app php artisan migrate:fresh --seed
```

## 🚦 Status dos Serviços

Para verificar se todos os serviços estão funcionando:

```bash
docker-compose ps
```

Todos devem mostrar estado "Up".

## 📱 Desenvolvimento

Durante o desenvolvimento, você pode:

1. Editar arquivos localmente (são sincronizados via volumes)
2. Os logs aparecem em tempo real com `docker-compose logs -f app`
3. O frontend é construído automaticamente no build
4. Para desenvolvimento ativo do frontend, rode `npm run dev` dentro do container

## 🔍 Monitoramento

- **Logs da aplicação**: `docker-compose logs -f app`
- **Logs do queue worker**: `docker-compose logs -f queue`
- **Emails enviados**: http://localhost:8025
- **Redis**: Use um cliente Redis conectando em localhost:6379

---

Para dúvidas ou problemas, consulte a documentação principal no `README.md` ou abra uma issue no repositório.