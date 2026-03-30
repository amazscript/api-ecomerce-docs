# Installation

## Requirements

| Requirement | Version |
|------------|---------|
| PHP | >= 8.5 |
| MySQL | >= 8.0 |
| Redis | >= 7.0 |
| Composer | >= 2.0 |
| Node.js | >= 18 (for admin assets) |
| MinIO | Latest (or any S3 provider) |

## Step 1 — Extract the project

```bash
# Unzip the downloaded archive
unzip laracommerce-api.zip
cd laracommerce-api
```

## Step 2 — Install dependencies

```bash
composer install
```

## Step 3 — Environment setup

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your database credentials:

```ini
APP_NAME="LaraCommerce"
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=sail
DB_PASSWORD=password
```

## Step 4 — Database setup

```bash
# Create the database first, then:
php artisan migrate
php artisan db:seed
```

This seeds:
- **3 accounts** — admin, manager, customer (see Default Credentials below)
- **Products** with variants, images, and attributes
- Sample coupons, reviews, shipping zones, and demo data

## Step 5 — Storage setup

```bash
php artisan storage:link
mkdir -p storage/app/livewire-tmp
```

## Step 6 — Run the application

```bash
php artisan serve
```

| URL | Description |
|-----|-------------|
| `http://localhost:8000` | API base |
| `http://localhost:8000/admin` | Filament admin panel |
| `http://localhost:8000/api/v1` | API v1 prefix |

::: tip Makefile shortcuts
A `Makefile` is included with common shortcuts. Instead of running all steps manually:
```bash
make install    # Copies .env, starts containers, generates key, migrates & seeds
make up         # Start containers
make down       # Stop containers
make fresh      # Fresh migration + seed
make test       # Run tests
make urls       # Show all service URLs
```
Run `make help` for the full list of available commands.
:::

## Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ecommerce.local` | `Admin123456!` |
| Manager | `manager@ecommerce.local` | `Manager123!` |
| Customer | `customer@ecommerce.local` | `Customer123!` |

::: warning
Change the default passwords immediately after your first login in production.
:::

## Queue Worker (Required for notifications)

```bash
php artisan queue:work
# or with Horizon:
php artisan horizon
```
