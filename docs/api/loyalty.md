# Loyalty & Affiliates

---

## Loyalty Points

The loyalty program rewards customers with points for purchases. Points can be redeemed for wallet credit.

See [User Profile — Loyalty Points](/api/user#loyalty-points) for all endpoints.

### How Points Work

| Action | Points Earned |
|--------|--------------|
| Purchase (per $1 spent) | Configurable via admin |
| Account registration | Bonus points (configurable) |
| Product review | Bonus points (configurable) |

Points are credited when the order is delivered.

### Redeeming Points

Points convert to wallet credit at a rate configured in the admin panel (e.g. 100 points = $1). Wallet credit applies automatically at checkout.

---

## Gift Cards

Gift cards can be purchased and shared. They are redeemed at checkout like a coupon code.

```http
GET /api/v1/gift-cards/{code}
```

Check gift card balance.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "code": "GC-XXXX-XXXX",
    "initial_amount": "50.00",
    "balance": "32.50",
    "currency": "USD",
    "expires_at": "2027-01-01",
    "is_active": true
  }
}
```

Gift cards are applied at checkout alongside regular coupons.

---

## Affiliate Program

The affiliate system lets users earn commission by referring customers.

All affiliate endpoints require authentication.

### Register as Affiliate

```http
POST /api/v1/user/affiliate/register
```

No request body required. The current authenticated user is registered as an affiliate.

**Response `201`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "code": "JOHN-2026",
    "commission_type": "percentage",
    "commission_rate": 0.05,
    "status": "pending",
    "balance": "0.00",
    "total_earned": "0.00",
    "total_orders": 0,
    "approved_at": null,
    "created_at": "2026-03-10T10:00:00+00:00"
  }
}
```

Affiliate applications start as `pending` and require admin approval.

### Get Affiliate Dashboard

```http
GET /api/v1/user/affiliate
```

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "code": "JOHN-2026",
    "commission_type": "percentage",
    "commission_rate": 0.05,
    "status": "active",
    "balance": "87.20",
    "total_earned": "348.50",
    "total_orders": 24,
    "approved_at": "2026-03-02T10:00:00+00:00",
    "created_at": "2026-03-01T09:00:00+00:00"
  }
}
```

### Conversion History

```http
GET /api/v1/user/affiliate/conversions
```

Paginated list of all affiliate conversions (referral clicks that resulted in a purchase).

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "order_id": 42,
      "referred_user_id": 15,
      "commission_amount": 9.00,
      "status": "approved",
      "approved_at": "2026-03-02T10:00:00+00:00",
      "paid_at": null,
      "created_at": "2026-03-01T14:22:00+00:00"
    }
  ]
}
```

### Conversion Statuses

| Status | Description |
|--------|-------------|
| `pending` | Order placed, awaiting delivery |
| `approved` | Order delivered — commission confirmed |
| `paid` | Commission paid out to affiliate |
| `cancelled` | Order cancelled or refunded |

### How Tracking Works

When a visitor arrives via `?ref=JOHN-2026`, a cookie is set. If they place an order within the cookie lifetime (configurable), a conversion is automatically recorded and commission is calculated.
