# Production Deployment

## Server Requirements

| Requirement | Version |
|------------|---------|
| PHP | >= 8.5 |
| MySQL | >= 8.0 |
| Redis | >= 7.0 |
| Node.js | >= 18 (for compiling admin assets) |
| Composer | >= 2.0 |
| MinIO or AWS S3 | — |
| Meilisearch | >= 1.0 |

## Deployment Steps

### 1. Upload & Install

```bash
# Upload the project to your server, then:
cd laracommerce-api
composer install --optimize-autoloader --no-dev
```

### 2. Environment

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` with production values. See [Configuration](/deployment/configuration).

### 3. Build Admin Assets

```bash
npm install
npm run build
```

### 4. Database

```bash
php artisan migrate --force
php artisan db:seed --force   # optional — only for initial data
```

### 5. Storage

```bash
php artisan storage:link
mkdir -p storage/app/livewire-tmp
```

### 6. Cache

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 7. Search Index

```bash
php artisan scout:import "App\Models\Product"
php artisan scout:import "App\Models\Category"
php artisan scout:import "App\Models\BlogPost"
```

### 8. Queue Worker

The queue must be running for notifications, webhooks, and search indexing.

**With Horizon (recommended):**
```bash
php artisan horizon
```

Monitor Horizon at: `https://yourdomain.com/horizon`

**Basic queue worker:**
```bash
php artisan queue:work --tries=3 --timeout=60
```

### 9. Scheduler

Add to crontab (`crontab -e`):

```cron
* * * * * cd /path/to/laracommerce && php artisan schedule:run >> /dev/null 2>&1
```

### 10. Default Credentials

After seeding, three accounts are created:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ecommerce.local` | `Admin123456!` |
| Manager | `manager@ecommerce.local` | `Manager123!` |
| Customer | `customer@ecommerce.local` | `Customer123!` |

::: danger
Change all default passwords immediately in production.
:::

## Scheduled Jobs

The scheduler (step 9) runs the following jobs automatically:

| Job | Schedule | Description |
|-----|----------|-------------|
| `ActivatePromotionsJob` | Every minute | Activates promotions when their start date is reached |
| `ExpirePromotionsJob` | Every minute | Deactivates promotions past their end date |
| `CheckStockAlertsJob` | Every 30 minutes | Checks inventory levels and sends low-stock alerts |
| `SyncCurrencyRatesJob` | Daily | Updates currency exchange rates |
| `SyncShipmentTrackingJob` | Every hour | Polls carriers for shipment tracking updates |

**On-demand jobs** (triggered by events, not scheduled):

| Job | Trigger | Description |
|-----|---------|-------------|
| `SendNewsletterJob` | Admin sends newsletter | Bulk email delivery to subscribers |
| `SendPushNotificationJob` | Various events | Firebase FCM push to mobile devices |
| `DeliverWebhookJob` | Various events | HTTP POST to registered webhook endpoints (with retries) |

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/laracommerce/public;

    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.5-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## Post-Deployment Checklist

- [ ] Change all default passwords (admin, manager, customer)
- [ ] Set `APP_DEBUG=false`
- [ ] Set `TRUSTED_PROXIES` to your proxy IPs (not `*`)
- [ ] Configure Stripe webhook endpoint (`https://yourdomain.com/api/v1/webhooks/stripe`)
- [ ] Set up SSL certificate (Let's Encrypt / Cloudflare)
- [ ] Configure mail provider (Mailgun, SES, Postmark)
- [ ] Configure Firebase FCM for push notifications
- [ ] Enable Horizon in Supervisor
- [ ] Set up cron scheduler
- [ ] Run `php artisan scout:import` for all searchable models
- [ ] Test a complete checkout flow with Stripe test cards
