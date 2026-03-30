# Route Reference

Complete list of all **325+ API endpoints**. Base URL: `https://localhost/api/v1` (Docker) or `http://localhost:8000/api/v1` (manual)

**Legend:** 🔓 Public &nbsp;|&nbsp; 🔐 Auth required &nbsp;|&nbsp; 🛡️ Admin/Manager only

---

## Health & Config

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/health` | 🔓 | Health check — returns API status, version, and timestamp |
| `GET` | `/config` | 🔓 | Public config — returns Stripe public key, default currency |

---

## Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/register` | 🔓 | Create account — returns access + refresh tokens |
| `POST` | `/auth/login` | 🔓 | Login — returns access + refresh tokens |
| `POST` | `/auth/logout` | 🔐 | Revoke current token |
| `POST` | `/auth/logout-all` | 🔐 | Revoke ALL tokens (all devices) |
| `POST` | `/auth/refresh` | 🔓 | Exchange refresh token for new access token |
| `POST` | `/auth/forgot-password` | 🔓 | Send password reset email |
| `POST` | `/auth/reset-password` | 🔓 | Reset password with token from email |
| `GET` | `/auth/verify-email/{id}/{hash}` | 🔐 | Verify email (signed link from email) |
| `POST` | `/auth/verify-email/resend` | 🔐 | Resend verification email |
| `POST` | `/auth/social/{provider}` | 🔓 | OAuth login (Google, Facebook, etc.) |

---

## Catalogue

::: info Route prefix
All catalogue endpoints are under `/api/v1/catalogue/`
:::

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/catalogue/categories` | 🔓 | List categories (tree or flat) |
| `GET` | `/catalogue/categories/{category:slug}` | 🔓 | Get category with children |
| `GET` | `/catalogue/brands` | 🔓 | List all brands |
| `GET` | `/catalogue/brands/{brand:slug}` | 🔓 | Get brand detail |
| `GET` | `/catalogue/collections` | 🔓 | List curated collections |
| `GET` | `/catalogue/collections/{collection:slug}` | 🔓 | Get collection with products |
| `GET` | `/catalogue/products` | 🔓 | List products (with filters) |
| `GET` | `/catalogue/products/featured` | 🔓 | Featured products (up to 12) |
| `GET` | `/catalogue/products/{product:slug}` | 🔓 | Product detail (increments view count) |
| `GET` | `/catalogue/products/{product:slug}/related` | 🔓 | Related products (up to 8) |
| `GET` | `/catalogue/products/{product:slug}/frequently-bought-together` | 🔓 | Frequently bought together (up to 6) |
| `GET` | `/catalogue/products/{product:slug}/reviews` | 🔓 | Approved reviews for product |
| `GET` | `/catalogue/search` | 🔓 | Full-text search with filters + facets |
| `GET` | `/catalogue/search/suggestions` | 🔓 | Autocomplete suggestions |
| `GET` | `/catalogue/search/popular` | 🔓 | Popular search terms |

---

## Products (User Actions)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/products/{product:slug}/reviews` | 🔐 | Submit a review |
| `PUT` | `/reviews/{review:id}` | 🔐 | Update own review (pending only) |
| `DELETE` | `/reviews/{review:id}` | 🔐 | Delete own review |
| `POST` | `/reviews/{review:id}/vote` | 🔐 | Vote helpful / not helpful |
| `POST` | `/products/{product:slug}/view` | 🔓 | Track product view |
| `GET` | `/products/recently-viewed` | 🔐 | Get recently viewed products |
| `POST` | `/products/{product:slug}/questions` | 🔐 | Submit a product question |
| `POST` | `/questions/{question:id}/answers` | 🔐 | Answer a product question |

---

## Cart

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/cart` | 🔐 | Get current cart |
| `DELETE` | `/cart` | 🔐 | Clear cart (remove all items) |
| `POST` | `/cart/items` | 🔐 | Add item to cart |
| `PUT` | `/cart/items/{cartItem:id}` | 🔐 | Update item quantity |
| `DELETE` | `/cart/items/{cartItem:id}` | 🔐 | Remove item from cart |
| `POST` | `/cart/coupon` | 🔐 | Apply coupon code |
| `DELETE` | `/cart/coupon` | 🔐 | Remove coupon |

---

## Wishlist

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/wishlist` | 🔐 | Get wishlist |
| `POST` | `/wishlist/{product:slug}` | 🔐 | Toggle product in wishlist (add if absent, remove if present) |

---

## Orders

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/orders` | 🔐 | List own orders |
| `POST` | `/orders` | 🔐 | Checkout — create order from cart |
| `GET` | `/orders/{orderNumber}` | 🔐 | Order detail |
| `POST` | `/orders/{orderNumber}/cancel` | 🔐 | Cancel an order |
| `POST` | `/orders/{orderNumber}/return` | 🔐 | Request a return |

---

## Payments

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/payments/intent` | 🔐 | Create Stripe PaymentIntent |
| `POST` | `/payments/confirm` | 🔐 | Confirm payment (server-side check) |
| `POST` | `/payments/retry` | 🔐 | Retry a failed payment |
| `POST` | `/webhooks/stripe` | 🔓 | Stripe webhook receiver |

---

## Shipping

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/shipping-methods` | 🔓 | Available shipping methods for a country |

---

## User Profile

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user` | 🔐 | Get profile + addresses |
| `PUT` | `/user` | 🔐 | Update profile |
| `DELETE` | `/user` | 🔐 | Delete account (soft delete, requires password) |
| `POST` | `/user/avatar` | 🔐 | Upload avatar to S3/MinIO |
| `PUT` | `/user/password` | 🔐 | Change password |

---

## Addresses

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/addresses` | 🔐 | List addresses |
| `POST` | `/user/addresses` | 🔐 | Add address |
| `GET` | `/user/addresses/{id}` | 🔐 | Get address |
| `PUT` | `/user/addresses/{id}` | 🔐 | Update address |
| `DELETE` | `/user/addresses/{id}` | 🔐 | Delete address |
| `PATCH` | `/user/addresses/{id}/default` | 🔐 | Set default address |

---

## Payment Methods (Saved Cards)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/payment-methods` | 🔐 | List saved Stripe cards |
| `POST` | `/user/payment-methods` | 🔐 | Save a card |
| `DELETE` | `/user/payment-methods/{id}` | 🔐 | Delete a card |

---

## Wallet

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/wallet` | 🔐 | Get wallet balance |
| `GET` | `/user/wallet/transactions` | 🔐 | Wallet transaction history |

---

## Loyalty Points

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/loyalty/balance` | 🔐 | Points balance + lifetime stats |
| `GET` | `/loyalty/history` | 🔐 | Transaction history |
| `POST` | `/loyalty/redeem` | 🔐 | Redeem points for wallet credit |

---

## Invoices

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/invoices` | 🔐 | List invoices |
| `GET` | `/invoices/{id}` | 🔐 | Get / download invoice |

---

## Affiliate

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/affiliate/register` | 🔐 | Register as affiliate |
| `GET` | `/affiliate` | 🔐 | Affiliate dashboard |
| `GET` | `/affiliate/conversions` | 🔐 | Conversion history |

---

## Notifications

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/user/notifications` | 🔐 | List notifications |
| `PATCH` | `/user/notifications/read-all` | 🔐 | Mark all notifications as read |
| `POST` | `/user/push-token` | 🔐 | Register push notification token |
| `DELETE` | `/user/push-token` | 🔐 | Unregister push token |

---

## Gift Cards

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/gift-cards/apply` | 🔐 | Apply gift card to cart/order |

---

## Marketing

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/flash-sales` | 🔓 | List active flash sales |
| `GET` | `/flash-sales/{id}` | 🔓 | Flash sale detail |
| `GET` | `/bundles` | 🔓 | List product bundles |
| `GET` | `/bundles/{slug}` | 🔓 | Bundle detail |
| `GET` | `/banners` | 🔓 | Active promotional banners |

---

## Content

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/blog` | 🔓 | List blog posts |
| `GET` | `/blog/{slug}` | 🔓 | Blog post detail |
| `GET` | `/pages/{slug}` | 🔓 | Static CMS page |
| `GET` | `/faqs` | 🔓 | FAQ list |
| `POST` | `/contact` | 🔓 | Submit contact form |
| `GET` | `/settings/public` | 🔓 | Public store settings |
| `GET` | `/currencies` | 🔓 | Supported currencies + exchange rates |
| `POST` | `/newsletter/subscribe` | 🔓 | Subscribe to newsletter |
| `POST` | `/newsletter/unsubscribe/{token}` | 🔓 | Unsubscribe from newsletter |

---

## Admin — Catalogue

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET/POST` | `/admin/products` | 🛡️ | List / create products |
| `GET/PUT/DELETE` | `/admin/products/{id}` | 🛡️ | Get / update / delete product |
| `POST` | `/admin/products/{id}/images` | 🛡️ | Upload product images |
| `DELETE` | `/admin/products/images/{image}` | 🛡️ | Delete product image |
| `GET/POST` | `/admin/products/{id}/variants` | 🛡️ | Manage variants |
| `PUT/DELETE` | `/admin/products/{id}/variants/{variant}` | 🛡️ | Update / delete variant |
| `GET/POST/DELETE` | `/admin/products/{id}/translations` | 🛡️ | Manage translations |
| `POST/DELETE` | `/admin/products/{id}/restore` | 🛡️ | Restore soft-deleted product |
| `GET/POST` | `/admin/categories` | 🛡️ | Categories CRUD |
| `GET/POST` | `/admin/brands` | 🛡️ | Brands CRUD |
| `POST` | `/admin/brands/{id}/restore` | 🛡️ | Restore brand |
| `GET/POST` | `/admin/collections` | 🛡️ | Collections CRUD |
| `GET/POST` | `/admin/attributes` | 🛡️ | Attributes CRUD |
| `POST` | `/admin/attributes/{id}/values` | 🛡️ | Add attribute value |
| `DELETE` | `/admin/attributes/{id}/values/{value}` | 🛡️ | Delete attribute value |
| `GET/POST` | `/admin/tags` | 🛡️ | Tags CRUD |
| `GET/POST` | `/admin/price-tiers` | 🛡️ | Price tiers CRUD |

---

## Admin — Orders & Fulfillment

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/orders` | 🛡️ | List all orders |
| `GET` | `/admin/orders/{order}` | 🛡️ | Order detail |
| `PATCH` | `/admin/orders/{order}/status` | 🛡️ | Update order status |
| `GET/POST` | `/admin/shipments` | 🛡️ | Shipments CRUD |
| `PUT` | `/admin/shipments/{id}` | 🛡️ | Update shipment |
| `POST` | `/admin/shipments/{id}/trackings` | 🛡️ | Add tracking event |
| `GET` | `/admin/returns` | 🛡️ | List return requests |
| `GET/PUT` | `/admin/returns/{id}` | 🛡️ | Review / process return |
| `GET` | `/admin/refunds` | 🛡️ | List refunds |
| `GET/PATCH` | `/admin/refunds/{id}` | 🛡️ | Process refund |

---

## Admin — Payments & Finance

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/invoices` | 🛡️ | List invoices |
| `GET/PATCH/DELETE` | `/admin/invoices/{id}` | 🛡️ | Manage invoice |
| `GET/POST` | `/admin/tax-categories` | 🛡️ | Tax categories CRUD |
| `GET/POST` | `/admin/tax-rates` | 🛡️ | Tax rates CRUD |
| `GET` | `/admin/currencies` | 🛡️ | List currencies |
| `PUT` | `/admin/currencies/{currency}` | 🛡️ | Update exchange rate |

---

## Admin — Marketing

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET/POST` | `/admin/coupons` | 🛡️ | Coupons CRUD |
| `GET/POST` | `/admin/promotions` | 🛡️ | Promotions CRUD |
| `POST` | `/admin/promotions/{id}/sync-products` | 🛡️ | Sync products to promotion |
| `GET/POST` | `/admin/flash-sales` | 🛡️ | Flash sales CRUD |
| `POST` | `/admin/flash-sales/{id}/items` | 🛡️ | Add item to flash sale |
| `DELETE` | `/admin/flash-sales/{id}/items/{item}` | 🛡️ | Remove item from flash sale |
| `GET/POST` | `/admin/bundles` | 🛡️ | Bundles CRUD |
| `POST` | `/admin/bundles/{id}/items` | 🛡️ | Add bundle item |
| `DELETE` | `/admin/bundles/{id}/items/{item}` | 🛡️ | Remove bundle item |
| `GET/POST` | `/admin/banners` | 🛡️ | Banners CRUD |
| `GET/POST` | `/admin/gift-cards` | 🛡️ | Gift cards CRUD |
| `GET` | `/admin/loyalty` | 🛡️ | Loyalty overview |
| `POST` | `/admin/loyalty/adjust` | 🛡️ | Manually adjust user points |

---

## Admin — Users & Groups

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET/POST` | `/admin/users` | 🛡️ | Users CRUD |
| `GET/PUT/DELETE` | `/admin/users/{id}` | 🛡️ | Manage user |
| `PATCH` | `/admin/users/{id}/toggle` | 🛡️ | Suspend / unsuspend user |
| `GET/POST` | `/admin/customer-groups` | 🛡️ | Customer groups CRUD |
| `POST` | `/admin/customer-groups/{id}/users` | 🛡️ | Assign users to group |
| `DELETE` | `/admin/customer-groups/{id}/users/{userId}` | 🛡️ | Remove user from group |
| `GET/POST` | `/admin/affiliates` | 🛡️ | List / manage affiliates |
| `POST` | `/admin/affiliates/{id}/approve` | 🛡️ | Approve affiliate application |
| `POST` | `/admin/affiliates/{id}/reject` | 🛡️ | Reject affiliate application |
| `GET` | `/admin/affiliates/{id}/conversions` | 🛡️ | Affiliate conversions |

---

## Admin — Inventory & Shipping

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/stock` | 🛡️ | Stock levels overview |
| `GET` | `/admin/stock/alerts` | 🛡️ | Low stock alerts |
| `POST` | `/admin/stock/adjust` | 🛡️ | Manual stock adjustment |
| `PUT/DELETE` | `/admin/stock/{inventory}` | 🛡️ | Update / delete inventory record |
| `GET/POST` | `/admin/warehouses` | 🛡️ | List / create warehouses |
| `GET/PUT/DELETE` | `/admin/warehouses/{id}` | 🛡️ | Get / update / delete warehouse |
| `GET/POST` | `/admin/shipping-zones` | 🛡️ | Shipping zones CRUD |
| `POST` | `/admin/shipping-zones/{id}/countries` | 🛡️ | Assign countries to zone |
| `GET/POST` | `/admin/shipping-methods` | 🛡️ | Shipping methods CRUD |
| `GET/POST` | `/admin/shipping-methods/{id}/rates` | 🛡️ | Manage shipping rates |
| `PUT/DELETE` | `/admin/shipping-methods/{id}/rates/{rate}` | 🛡️ | Update / delete rate |

---

## Admin — Reviews & Content

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/reviews` | 🛡️ | List all reviews (pending first) |
| `PATCH` | `/admin/reviews/{id}/approve` | 🛡️ | Approve review |
| `PATCH` | `/admin/reviews/{id}/reject` | 🛡️ | Reject review |
| `GET/POST` | `/admin/blog-posts` | 🛡️ | Blog posts CRUD |
| `POST` | `/admin/blog-posts/{id}/publish` | 🛡️ | Publish post |
| `POST` | `/admin/blog-posts/{id}/unpublish` | 🛡️ | Unpublish post |
| `GET/POST` | `/admin/blog-categories` | 🛡️ | Blog categories CRUD |
| `GET/POST` | `/admin/pages` | 🛡️ | Static pages CRUD |
| `GET/POST` | `/admin/faqs` | 🛡️ | FAQs CRUD |
| `POST` | `/admin/faqs/reorder` | 🛡️ | Reorder FAQs |
| `GET` | `/admin/contacts` | 🛡️ | List contact submissions |
| `GET` | `/admin/contacts/{contact}` | 🛡️ | View contact submission |
| `DELETE` | `/admin/contacts/{contact}` | 🛡️ | Delete contact submission |
| `PATCH` | `/admin/contacts/{contact}/read` | 🛡️ | Mark contact as read |
| `GET/POST` | `/admin/newsletter` | 🛡️ | Newsletter subscribers |
| `GET` | `/admin/newsletter/{id}` | 🛡️ | Get newsletter campaign |
| `POST` | `/admin/newsletter/{id}/send` | 🛡️ | Send newsletter campaign |

---

## Admin — System

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/dashboard` | 🛡️ | Dashboard stats |
| `GET` | `/admin/analytics` | 🛡️ | Analytics data |
| `GET` | `/admin/settings` | 🛡️ | Get all settings |
| `PUT` | `/admin/settings` | 🛡️ | Update settings |
| `GET/PUT` | `/admin/languages` | 🛡️ | Languages management |
| `POST` | `/admin/currencies/sync-rates` | 🛡️ | Sync currency exchange rates |
| `GET` | `/admin/logs/activity` | 🛡️ | Activity log (all admin actions) |
| `GET` | `/admin/logs/api` | 🛡️ | API request logs |
| `GET` | `/admin/logs/search` | 🛡️ | Search query logs |
| `POST` | `/admin/media/upload` | 🛡️ | Upload media file |
| `DELETE` | `/admin/media/{path}` | 🛡️ | Delete media file |

---

## Admin — Webhooks

| Method | Endpoint | Role | Description |
|--------|----------|------|-------------|
| `GET` | `/admin/webhooks` | 🛡️ | List all customer webhook endpoints |
| `POST` | `/admin/webhooks` | 🛡️ | Create webhook endpoint |
| `GET` | `/admin/webhooks/{id}` | 🛡️ | Get webhook details |
| `PUT/PATCH` | `/admin/webhooks/{id}` | 🛡️ | Update webhook |
| `DELETE` | `/admin/webhooks/{id}` | 🛡️ | Delete webhook |
| `GET` | `/admin/webhooks/{id}/deliveries` | 🛡️ | Delivery logs for a webhook |
