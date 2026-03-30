# Promotions & Coupons

---

## Flash Sales

Flash sales offer limited-time discounts on selected products.

```http
GET /api/v1/flash-sales
```

Returns all active flash sales with their items, prices, and remaining time.

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Weekend Sale",
      "starts_at": "2026-03-05T00:00:00Z",
      "ends_at": "2026-03-07T23:59:59Z",
      "is_active": true,
      "items": [
        {
          "id": 1,
          "product_variant_id": 10,
          "sale_price": 79.99,
          "original_price": 129.99,
          "discount_percent": 38.5,
          "qty_limit": 50,
          "qty_sold": 12,
          "is_active": true
        }
      ]
    }
  ]
}
```

```http
GET /api/v1/flash-sales/{id}
```

Returns a single flash sale with full item details.

---

## Product Bundles

Bundles group multiple products with a special combined price.

```http
GET /api/v1/bundles
```

Lists all active product bundles.

```http
GET /api/v1/bundles/{id}
```

Returns bundle details with all included products.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Starter Pack",
    "slug": "starter-pack",
    "description": "Everything you need to get started.",
    "image": "https://...",
    "discount_type": "percentage",
    "discount_value": 25.0,
    "is_active": true,
    "starts_at": "2026-03-01T00:00:00+00:00",
    "ends_at": "2026-04-01T00:00:00+00:00",
    "items": [
      {
        "id": 1,
        "product_variant_id": 10,
        "quantity": 1,
        "is_required": true
      }
    ],
    "created_at": "2026-02-15T10:00:00+00:00"
  }
}
```

---

## Coupons

Coupons are applied at cart level. See [Cart — Apply Coupon](/api/cart#apply-coupon) for the full flow.

### Coupon Types

| Type | Description |
|------|-------------|
| `percentage` | Percentage off the subtotal (e.g. 10%) |
| `fixed` | Fixed amount off (e.g. $15 off) |
| `free_shipping` | Removes shipping cost |
| `buy_x_get_y` | Buy X items, get Y free |

### Coupon Constraints

Each coupon can have:
- **Minimum order amount** — e.g. only valid on orders over $50
- **Usage limit** — maximum total uses across all customers
- **Per-user limit** — maximum uses per customer
- **Expiry date** — automatic deactivation
- **Product/category restrictions** — only valid on specific items

---

## Collections

Collections are curated groups of products (e.g. "Summer Essentials", "Staff Picks").

```http
GET /api/v1/collections
```

```http
GET /api/v1/collections/{slug}
```

Returns collection details with its products.

---

## Banners

```http
GET /api/v1/banners
```

Returns active promotional banners for homepage/section display.

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Spring Sale",
      "subtitle": "Up to 50% off",
      "image_url": "https://...",
      "image_mobile_url": "https://...",
      "link_type": "url",
      "link_value": "/flash-sales/spring-sale",
      "button_text": "Shop Now",
      "position": "hero",
      "sort_order": 1,
      "is_active": true,
      "starts_at": "2026-03-01T00:00:00+00:00",
      "ends_at": "2026-03-31T23:59:59+00:00"
    }
  ]
}
```
