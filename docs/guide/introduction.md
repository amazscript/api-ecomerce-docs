# Introduction

**LaraCommerce API** is a complete, production-ready ecommerce REST API built with **Laravel 12**. Designed for developers building mobile apps or web storefronts who need a robust, tested, and well-documented backend — without reinventing the wheel.

::: tip Why LaraCommerce?
Building an ecommerce backend from scratch takes **months**. LaraCommerce gives you 300+ endpoints, Stripe payments, an admin panel, inventory management, and marketing tools — ready to go on day one.
:::

## What You Get

| Category | Details |
|----------|---------|
| **API Endpoints** | 325+ routes across 25+ modules |
| **Database** | 83 Eloquent models with 72 migrations |
| **Admin Panel** | Filament v3 with 46 fully-configured resources |
| **Tests** | 1,590+ tests / 3,500+ assertions (PHPUnit) |
| **Payments** | Full Stripe integration (PaymentIntents, 3DS, webhooks) |
| **Storage** | MinIO / AWS S3 for images and files |
| **Search** | Meilisearch with facets, filters, autocomplete |
| **Seeders** | 50 seeders generating realistic demo data |
| **REST Client** | 46 `.http` files for testing every endpoint |
| **Docker** | 11 pre-configured services, one-command setup |
| **Documentation** | This full VitePress docs site included |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Laravel 12 (PHP 8.5+) |
| Auth | Laravel Sanctum (access + refresh tokens) |
| Roles | Spatie Laravel Permission (3 roles, 57 permissions) |
| Admin | Filament v3 |
| Storage | MinIO / AWS S3 |
| Search | Meilisearch + Laravel Scout |
| Queue | Redis + Laravel Horizon |
| Database | MySQL 8.4 |
| Payments | Stripe PHP SDK |
| Docker | Docker Compose + Nginx SSL (11 services) |

## Feature Breakdown

### Authentication & Security
- Sanctum dual-token system (access + refresh)
- Social OAuth login (Google, Facebook, Apple)
- Email verification with resend
- Password reset flow
- Rate limiting (3 tiers: standard, auth, strict)
- Security headers middleware
- Role-based access control (customer, manager, admin)

### Catalog & Products
- Products with unlimited variants (size, color, custom attributes)
- Categories (nested hierarchy), brands, tags, collections
- Product images via MinIO/S3
- Product translations (5 languages)
- Flash sales with countdown, bundles with discount, price tiers
- Product views tracking, related products algorithm

### Cart, Orders & Checkout
- Persistent cart with coupon application
- Smart shipping rate calculation (flat, weight, price, free)
- Full order lifecycle (pending -> confirmed -> shipped -> delivered)
- Order status history, return requests, cancellations
- Automatic invoice generation

### Payments (Stripe)
- PaymentIntents API with 3D Secure / SCA
- Saved payment methods
- Webhook handling (payment_intent.succeeded/failed)
- Refunds with audit trail
- Internal wallet system
- Supports: Stripe, PayPal (placeholder), wallet, COD

### Shipping & Logistics
- Shipping zones with geographic targeting
- Multiple rate types (flat, weight-based, price-based, free)
- Carrier support (UPS, FedEx, DHL, etc.)
- Shipment tracking with carrier info
- Return shipping workflow

### Inventory Management
- Stock tracking per variant per warehouse
- Stock movement logs (in/out/adjustment)
- Low stock alerts with reorder notifications
- Multi-warehouse support

### Marketing & Promotions
- Coupons: percentage, fixed, free shipping, buy-X-get-Y
- Promotions with rules engine
- Flash sales, product bundles, price tiers
- Banners, collections, newsletters
- Abandoned cart tracking

### Loyalty & Customer Retention
- Loyalty points system with redemption
- Gift cards (digital balance with usage tracking)
- Affiliate program with conversion tracking
- Customer groups with custom discounts

### Content Management
- Blog with categories and drafts
- Static pages (FAQ, Terms, Privacy)
- Contact form with admin notifications
- Newsletter campaigns

### Search & Discovery
- Meilisearch full-text search (typo-tolerant)
- Faceted filtering (categories, brands, attributes, price range)
- Sort by relevance, price, rating, newest, best-selling
- Autocomplete suggestions

### Notifications
- Email notifications for all key events (15 notification classes)
- In-app database notifications
- Push notification support (Firebase FCM)
- Custom webhook endpoints with delivery logs

### Admin Panel (Filament v3)
- 46 fully-configured resources
- Dashboard with live statistics
- Activity audit logs (Spatie ActivityLog)
- Bulk actions, advanced filtering, export

## API Response Format

All endpoints return a consistent JSON format:

```json
{
  "status": "success",
  "message": "OK",
  "data": { ... }
}
```

Error responses:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

## Base URL

```
Docker   : https://localhost/api/v1
Manual   : http://localhost:8000/api/v1
```

## Required Headers

```http
Authorization: Bearer {your_token}
Accept: application/json
Content-Type: application/json
```

## Project Structure

```
app/
├── Models/          # 83 Eloquent models
├── Http/Controllers/Api/V1/  # API controllers
├── Services/        # Business logic (Auth, Commerce, Marketing)
├── Filament/        # 46 admin resources
├── Policies/        # 20 authorization policies
├── Observers/       # 10 event observers
├── Notifications/   # 15 notification classes
├── Jobs/            # 10 queued jobs
├── Enums/           # 17 type-safe enums
└── Traits/          # Reusable functionality

database/
├── migrations/      # 72 migration files
└── seeders/         # 50 seeder files

tests/
├── Feature/         # API endpoint tests
└── Unit/            # Service unit tests

rest/                # 48 .http files for API testing
docs-site/           # This documentation (VitePress)
```
