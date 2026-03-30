# Cart

All cart endpoints require authentication. Each user has exactly one persistent cart.

---

## Get Cart

```http
GET /api/v1/cart
```

Returns the current user's cart. Creates an empty cart automatically if none exists.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "items_count": 3,
    "subtotal": "149.97",
    "discount_amount": "15.00",
    "total": "134.97",
    "currency": "USD",
    "coupon": {
      "code": "SAVE10",
      "type": "percentage",
      "value": "10.00"
    },
    "items": [
      {
        "id": 1,
        "quantity": 2,
        "unit_price": "49.99",
        "total": "99.98",
        "product": {
          "id": 1,
          "name": "Wireless Headphones",
          "slug": "wireless-headphones",
          "image": "https://example.com/storage/products/headphones.jpg"
        },
        "variant": {
          "id": 5,
          "sku": "WH-BLK"
        }
      }
    ],
    "expires_at": "2026-04-29T12:00:00+00:00",
    "updated_at": "2026-03-30T10:15:30+00:00"
  }
}
```

---

## Add Item

```http
POST /api/v1/cart/items
```

Adds a product to the cart. If the same product+variant already exists, the quantity is incremented.

**Request:**
```json
{
  "product_id": 1,
  "variant_id": 5,
  "quantity": 2
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `product_id` | Yes | Product ID |
| `variant_id` | No | Specific variant. Uses first variant if omitted |
| `quantity` | No | Default: 1. Max: 100 |

Returns the full updated cart.

---

## Update Item Quantity

```http
PUT /api/v1/cart/items/{item}
```

Updates the quantity of a cart item.

**Request:**
```json
{ "quantity": 3 }
```

Returns the full updated cart.

---

## Remove Item

```http
DELETE /api/v1/cart/items/{item}
```

Removes a single item from the cart.

**Response `204`** — No content.

---

## Clear Cart

```http
DELETE /api/v1/cart
```

Removes all items and resets the cart (also removes any applied coupon).

**Response `204`** — No content.

---

## Coupons

### Apply Coupon

```http
POST /api/v1/cart/coupon
```

**Request:**
```json
{ "code": "SAVE10" }
```

The coupon is validated against:
- Expiry date
- Minimum order amount
- Maximum usage count
- Per-user usage limit

If valid, the discount is calculated and applied to the cart total.

**Response `200`:**
```json
{
  "status": "success",
  "message": "Coupon applied.",
  "data": { ...updated cart... }
}
```

**Error `422`:**
```json
{
  "status": "error",
  "message": "Coupon has expired.",
  "code": "COUPON_EXPIRED"
}
```

**Coupon error codes:**

| Code | Description |
|------|-------------|
| `COUPON_NOT_FOUND` | Invalid code |
| `COUPON_EXPIRED` | Past expiry date |
| `COUPON_INACTIVE` | Disabled by admin |
| `COUPON_MIN_AMOUNT` | Cart below minimum order amount |
| `COUPON_USAGE_LIMIT` | Global usage limit reached |
| `COUPON_USER_LIMIT` | You've already used this coupon |

### Remove Coupon

```http
DELETE /api/v1/cart/coupon
```

Removes the applied coupon and recalculates the cart.

**Response `200`** with updated cart.
