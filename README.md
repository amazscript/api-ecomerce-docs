# LaraCommerce API Documentation

**The Complete Ecommerce Backend You Need**

Ship your mobile or web store in days, not months. Laravel 12 + Stripe + Filament v3 + Meilisearch + 1590+ Tests.

## 🚀 Key Features

- **325+ API Endpoints**: Every ecommerce use case covered — products, variants, cart, checkout, orders, payments, shipping, returns, reviews, loyalty, affiliates, and more.
- **Stripe Payments (Production-Ready)**: PaymentIntents, 3D Secure/SCA, saved cards, webhooks, refunds, wallet system, and cash-on-delivery.
- **Filament v3 Admin Panel**: 46 fully-configured admin resources. Manage orders, inventory, products, coupons, customers, and analytics.
- **Meilisearch Full-Text Search**: Typo-tolerant search with faceted filters, price ranges, category navigation, autocomplete suggestions, and sorting.
- **Multi-Warehouse Inventory**: Track stock across warehouses with movement logs, low-stock alerts, and automatic reorder notifications.
- **Complete Marketing Suite**: Coupons, flash sales, bundles, price tiers, loyalty points, gift cards, and affiliate program.
- **Multi-Language & Multi-Currency**: 5 languages (EN, FR, AR with RTL, ES, DE) and 7 currencies (USD, EUR, GBP, MAD, CAD, CHF, AED) built-in.
- **1590+ Tests / 3500+ Assertions**: Comprehensive test suite covering all endpoints and services.
- **One-Command Docker Setup**: 11 pre-configured services: Laravel, MySQL, Redis, Meilisearch, MinIO, Mailpit, Horizon, Nginx with SSL, Adminer, Redis Commander.

## 🛠️ Tech Stack

- **Backend**: Laravel 12
- **Admin Panel**: Filament v3
- **Database**: MySQL, Redis
- **Search Engine**: Meilisearch
- **Storage**: MinIO (S3 compatible)
- **Payments**: Stripe
- **Infrastructure**: Docker & Nginx

## 📖 Documentation

This repository contains the source for the LaraCommerce API documentation. It is built using [VitePress](https://vitepress.dev/).

### Local Development

To run the documentation locally:

```bash
npm install
npm run docs:dev
```

The documentation will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run docs:build
```

The build output will be in `docs/.vitepress/dist`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
