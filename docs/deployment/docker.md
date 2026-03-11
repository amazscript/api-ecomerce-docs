# Docker Setup

LaraCommerce ships with a fully configured **Docker Compose** environment with Nginx + SSL. One command starts the entire stack — no manual PHP, MySQL, or Redis installation needed.

## Stack

| Service | Image | Description |
|---------|-------|-------------|
| `laravel.test` | `sail-8.5/app` | PHP 8.5 application |
| `nginx` | `nginx:alpine` | HTTPS reverse proxy with SSL termination |
| `ssl-setup` | `alpine` | Auto-generates self-signed SSL certificates |
| `horizon` | `sail-8.5/app` | Queue worker — `php artisan horizon` |
| `mysql` | `mysql:8.4` | Primary database |
| `redis` | `redis:7-alpine` | Cache, sessions, queues (password protected) |
| `minio` | `minio/minio:latest` | S3-compatible file storage |
| `minio-setup` | `minio/mc:latest` | Automatically creates buckets on first start |
| `meilisearch` | `getmeili/meilisearch:latest` | Full-text search engine |
| `mailpit` | `axllent/mailpit:latest` | Local email capture (catches all outgoing mail) |
| `adminer` | `adminer:latest` | Database admin UI |
| `redis-commander` | `rediscommander/redis-commander` | Redis admin UI |

---

## Requirements

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- No PHP, MySQL, or Redis needed locally

---

## Start the Stack

```bash
# First time — install PHP dependencies via Docker (no local PHP needed)
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v "$(pwd):/var/www/html" \
    -w /var/www/html \
    laravelsail/php85-composer:latest \
    composer install --ignore-platform-reqs

# Copy environment file
cp .env.example .env

# Start all containers
docker compose up -d

# Generate app key
docker compose exec laravel.test php artisan key:generate

# Run migrations + seeders
docker compose exec laravel.test php artisan migrate --seed

# Create storage link
docker compose exec laravel.test php artisan storage:link

# Index products in Meilisearch
docker compose exec laravel.test php artisan scout:import "App\Models\Product"
docker compose exec laravel.test php artisan scout:import "App\Models\Category"
```

::: tip Alias
Add this to your shell config (`~/.zshrc` or `~/.bashrc`) to shorten commands:
```bash
alias dcex='docker compose exec laravel.test'
# Then: dcex php artisan migrate
```
:::

---

## Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **API** | `https://localhost/api/v1` | — |
| **Admin Panel** | `https://localhost/admin` | `admin@ecommerce.local` / `Admin123456!` |
| **Horizon** | `https://localhost/horizon` | Admin only |
| **MinIO Console** | `http://localhost:8900` | `minioadmin` / `minioadmin` |
| **Mailpit** (email capture) | `http://localhost:8025` | — |
| **Adminer** (DB UI) | `http://localhost:8080` | Server: `mysql` |
| **Redis Commander** | `http://localhost:8081` | `admin` / `secret` |
| **Meilisearch** | `http://localhost:7700` | — |

::: info HTTPS with self-signed certificate
The Nginx container uses a self-signed SSL certificate generated automatically by the `ssl-setup` service. Your browser will show a security warning — this is normal in development. Accept the certificate to proceed.
:::

::: info Mailpit
All emails sent by the application (verification, password reset, notifications) are captured by Mailpit in development. Nothing is sent to real inboxes. Check `http://localhost:8025` to see them.
:::

---

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ecommerce.local` | `Admin123456!` |
| Manager | `manager@ecommerce.local` | `Manager123!` |
| Customer | `customer@ecommerce.local` | `Customer123!` |

---

## MinIO Buckets

Buckets are created **automatically** at startup by the `minio-setup` service:

| Bucket | Access | Used for |
|--------|--------|---------|
| `${AWS_BUCKET}` (e.g. `ecommerce`) | Private | Product images, uploads |
| `${AWS_BUCKET}-public` | Public | Publicly served images |

No manual setup needed.

---

## .env for Docker

The `.env.example` is pre-configured for Docker. Key values:

```ini
APP_PORT=80
APP_SSL_PORT=443
APP_URL=http://localhost

DB_HOST=mysql
DB_DATABASE=ecommerce_db
DB_USERNAME=sail
DB_PASSWORD=password

REDIS_HOST=redis
REDIS_PASSWORD=secret

AWS_ENDPOINT=http://minio:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
AWS_BUCKET=ecommerce
AWS_USE_PATH_STYLE_ENDPOINT=true

MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=masterKey

MAIL_HOST=mailpit
MAIL_PORT=1025

TRUSTED_PROXIES=*

FORWARD_MINIO_CONSOLE_PORT=8900
```

---

## Common Commands

```bash
# Start containers
docker compose up -d

# Stop containers
docker compose down

# Run Artisan commands
docker compose exec laravel.test php artisan migrate
docker compose exec laravel.test php artisan tinker
docker compose exec laravel.test php artisan queue:work

# Run tests
docker compose exec laravel.test php artisan test

# Open MySQL shell
docker compose exec mysql mysql -u sail -ppassword ecommerce_db

# Open Redis CLI
docker compose exec redis redis-cli -a secret

# View application logs
docker compose logs -f laravel.test

# View Horizon logs
docker compose logs -f horizon

# Rebuild containers (after Dockerfile changes)
docker compose build --no-cache
docker compose up -d
```

---

## Stopping & Resetting

```bash
# Stop all containers (data preserved)
docker compose down

# Stop and remove all volumes (full reset — deletes all data)
docker compose down -v
```
