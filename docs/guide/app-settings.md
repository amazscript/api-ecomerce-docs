# App-Specific Settings

While most infrastructure configuration is done via the `.env` file, LaraCommerce includes a central `config/api.php` file for fine-tuning the commerce engine and API behavior.

---

## Global API Settings

| Key | Default | Description |
|-----|---------|-------------|
| `version` | `v1` | The current API version string. |
| `prefix` | `api/v1` | The URL prefix for all API routes. |

---

## Pagination

Configure how many items are returned by default in list endpoints.

```php
'pagination' => [
    'default_per_page' => 15,
    'max_per_page'     => 100, // Hard limit to prevent memory issues
],
```

---

## Rate Limiting

LaraCommerce implements tiered rate limiting to protect different types of endpoints.

| Tier | Requests/min | Usage |
|------|--------------|-------|
| `standard` | 60 | Browsing products, categories, reviews. |
| `auth` | 10 | Login, Registration, Token refresh. |
| `strict` | 5 | Password reset, Return requests. |
| `upload` | 20 | Image and avatar uploads. |

---

## Upload Configuration

Settings for handling product images, avatars, and documents.

```php
'uploads' => [
    'max_size_mb'     => 10,
    'allowed_images'  => ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    'allowed_docs'    => ['pdf', 'doc', 'docx'],
    'image_qualities' => [
        'original'  => 90,
        'large'     => 80, // 1200px
        'medium'    => 75, // 600px
        'thumbnail' => 70, // 300px
    ],
],
```

---

## Order & Cart Rules

Global business rules for the shopping experience.

- **`number_prefix`**: Defaults to `ORD`. Change this to customize your order numbers (e.g., `SHOP-2026...`).
- **`auto_cancel_hours`**: Orders in `pending` status (unpaid) will be automatically cancelled after this many hours.
- **`max_items_per_cart`**: Prevents excessively large carts (Default: 50 items).
- **`max_quantity_per_item`**: Limits the quantity of a single variant in the cart (Default: 99).

---

## Stripe Default Currency

The default currency used for Stripe PaymentIntents if not specified by the user or order.

```php
'stripe' => [
    'currency' => 'usd',
],
```
