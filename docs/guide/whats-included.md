# What's Included

Everything you need to build and launch a complete ecommerce backend — ready to use on day one.

## At a Glance

| | |
|---|---|
| **API Endpoints** | 325+ RESTful routes |
| **Database** | 83 Eloquent models with 72 migrations |
| **Admin Panel** | Filament v3 with 46 management screens |
| **Automated Tests** | 1,590+ tests, 3,500+ assertions |
| **Payments** | Full Stripe integration (3DS, webhooks, refunds) |
| **Search** | Meilisearch with facets, filters, autocomplete |
| **Storage** | MinIO / AWS S3 ready |
| **Docker** | 11 services, one-command setup |
| **Documentation** | This full docs site + 46 REST client test files |
| **Languages** | 5 (EN, FR, AR, ES, DE) |
| **Currencies** | 7 (USD, EUR, GBP, MAD, CAD, CHF, AED) |

---

## Core Modules

### Authentication & Security
Register, login, token refresh, social OAuth (Google, Facebook, Apple), email verification, password reset, rate limiting (3 tiers), role-based access (customer, manager, admin with 57 granular permissions).

### Product Catalog
Products with unlimited variants, dynamic attributes, nested categories, brands, tags, collections, product translations, images via S3, flash sales, bundles, and volume-based price tiers.

### Shopping Cart & Checkout
Persistent cart, coupon validation and application, smart shipping rate calculation, address selection, and seamless order creation.

### Orders & Returns
Full order lifecycle management, status history tracking, automatic invoice generation, cancellation workflow, and return request processing.

### Stripe Payments
PaymentIntents with 3D Secure/SCA, saved payment methods, webhook handlers, refund processing, internal wallet system, and cash-on-delivery support.

### Shipping & Logistics
Shipping zones with geographic targeting, multiple rate types (flat, weight, price, free), carrier tracking, estimated delivery dates, and return shipping.

### Multi-Warehouse Inventory
Stock tracking per variant per warehouse, movement logs, low stock alerts, automatic reorder notifications, and stock adjustment endpoints.

### Marketing Suite
Coupons (percentage, fixed, BOGO, free shipping), promotions engine, flash sales with countdown, product bundles, banners, newsletters, and abandoned cart tracking.

### Loyalty & Retention
Points system with earn/redeem, digital gift cards, affiliate program with conversion tracking, and customer group segmentation.

### Content Management
Blog with categories and drafts, static pages (FAQ, Terms, Privacy), contact form, and newsletter campaigns.

### Search & Discovery
Meilisearch full-text search with typo tolerance, faceted filtering, price range filters, category navigation, autocomplete suggestions, and multiple sort options.

### Notifications
15 email notification templates, in-app notifications, push notification support (Firebase FCM), custom webhook endpoints with delivery logs.

---

## Admin Panel

46 fully-configured management screens powered by Filament v3:

- **Dashboard** with live sales statistics
- **Order management** with Stripe refund integration
- **Product management** with variants, images, and translations
- **Inventory management** with stock adjustments
- **Customer management** with order history
- **Coupon & promotion management**
- **Shipping configuration** (zones, methods, rates)
- **Blog & content management**
- **Full activity audit log** for all admin actions
- Bulk actions, advanced filtering, and export

::: tip See It in Action
Run the project locally to see the admin panel at `https://localhost/admin` with pre-loaded demo data.
:::

---

## Developer Experience

- **One-command Docker setup** — 11 pre-configured services, just run `docker compose up -d`
- **50 seeders** — Realistic demo data generated automatically
- **46 REST client files** — Test every endpoint from VS Code or JetBrains
- **1,590+ automated tests** — Ship with confidence, refactor safely
- **Makefile shortcuts** — `make fresh`, `make test`, `make urls`, and more
- **Consistent API format** — Every endpoint returns the same JSON structure
- **Full documentation** — This VitePress site is included in your purchase

---

## What You Can Build With This

- Mobile ecommerce app (iOS / Android)
- Web storefront (React, Vue, Next.js, Nuxt)
- Multi-vendor marketplace (extend with custom modules)
- Subscription box service
- Digital product store
- B2B wholesale platform
