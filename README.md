# Partner

## 📘 Descrição do Projeto

(Em construção)

## 🚀 Guia de Execução

### Pré-requisitos

-   PHP >= 8.2 (extensões comuns: `pdo`, `pdo_sqlite` ou `pdo_mysql`, `openssl`, `mbstring`, `tokenizer`, `xml`, `ctype`, `json`, `fileinfo`)
-   Composer >= 2.x
-   Node.js >= 18.x (recomendado 18 ou 20 LTS)
-   NPM >= 9.x

Banco de dados padrão neste repositório: SQLite (arquivo em `database/database.sqlite`). Pode trocar para MySQL/PostgreSQL no `.env`.

#### Exemplos de Configuração de Banco

SQLite (padrão):

```env
DB_CONNECTION=sqlite
DB_DATABASE=database/database.sqlite
```

MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=partner
DB_USERNAME=root
DB_PASSWORD=secret
```

PostgreSQL:

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=partner
DB_USERNAME=postgres
DB_PASSWORD=secret
```

Se trocar de SQLite para outro banco depois de já ter migrado, execute:

```bash
php artisan migrate:fresh --seed
```

### 🆕 Primeira Execução (Setup Inicial)

1. Clone o repositório:
    ```bash
    git clone <url> && cd partner
    ```
2. Instale dependências PHP:
    ```bash
    composer install
    ```
    (Se quiser atualizar pacotes antes: `composer update`)
3. Crie o arquivo `.env` (se não existir):
    ```bash
    cp .env.example .env
    ```
4. Configure o e-mail (Mailtrap) antes de prosseguir:
    1. Crie conta em https://mailtrap.io
    2. Crie um Inbox.
    3. Adicione no `.env`:
        ```env
        MAIL_MAILER=smtp
        MAIL_HOST=sandbox.smtp.mailtrap.io
        MAIL_PORT=2525
        MAIL_USERNAME=seu_user
        MAIL_PASSWORD=seu_pass
        MAIL_ENCRYPTION=tls
        MAIL_FROM_ADDRESS="no-reply@partner.test"
        MAIL_FROM_NAME="Partner"
        ```
    4. Teste opcional:
        ```bash
        php artisan tinker
        >>> Mail::raw('Teste Mailtrap', fn($m) => $m->to('seu-email@exemplo.com')->subject('Teste'));
        ```
    5. Se falhar: execute `php artisan config:clear` e verifique usuário/senha.
5. Configure demais variáveis no `.env`: - `APP_NAME`, `APP_URL` - Banco: escolha um dos blocos em "Exemplos de Configuração de Banco" acima.
6. Gere a chave da aplicação:
    ```bash
    php artisan key:generate
    ```
7. Rode as migrações (e seeders se existirem):
    ```bash
    php artisan migrate --seed
    ```
8. Instale dependências JS:
    ```bash
    npm install
    ```
9. Inicie servidores (frontend + backend):
    ```bash
    php artisan serve & npm run dev
    ```
    Ou use o script composer paralelo (inclui queue/logs):
    ```bash
    composer run dev
    ```
10. Acesse: `http://127.0.0.1:8000`

### 🔁 Execuções Posteriores (Desenvolvimento)

Normalmente apenas:

```bash
git pull
composer install
php artisan migrate   # se houver novas migrations
npm install            # se houver mudanças de dependências
php artisan serve & npm run dev
```

### 🧹 Manutenção Útil

```bash
php artisan config:clear
php artisan cache:clear
php artisan migrate:fresh --seed
```

### 🛠️ Build de Produção

```bash
npm run build
php artisan optimize
```

### 🔒 Segurança

-   Nunca commitar `.env`.
-   Gere nova chave se clonar para produção (`php artisan key:generate`).
-   Configure corretamente permissões da pasta `storage/` e `bootstrap/cache/`.

### 📂 Estrutura (Visão Rápida)

-   `app/Models` – Modelos Eloquent
-   `app/Http/Controllers` – Controllers (inclui `CourseController`, `PublicCourseController`)
-   `resources/js` – Frontend Inertia + React
-   `resources/views` – Blade (mínimo / fallback)
-   `database/migrations` – Migrações
-   `database/factories` – Factories
-   `routes/` – Definições de rotas segmentadas

### ❓ Dúvidas

Preencha esta seção futuramente com FAQs ou contatos.

---

Em breve: documentação funcional detalhada.

## 🐘 Notas sobre PostgreSQL

Caso opte por Postgres:

-   Instale a extensão PHP `pdo_pgsql`.
-   Ajuste o bloco PG no `.env`.
-   Use `php artisan migrate:fresh --seed` após mudança de driver se houver tabelas criadas em outro banco.
-   Para performance local, considere adicionar `DB_SCHEMA=public` (opcional).

Backups / dump local:

```bash
pg_dump -h 127.0.0.1 -U postgres -d partner > backup.sql
psql -h 127.0.0.1 -U postgres -d partner < backup.sql
```
