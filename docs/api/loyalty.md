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

**Request:**
```json
{
  "website": "https://myblog.com",
  "description": "Tech review blog with 50k monthly readers"
}
```

**Response `201`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "code": "JOHN-2026",
    "referral_url": "https://yourstore.com?ref=JOHN-2026",
    "commission_rate": "10.00",
    "status": "pending"
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
    "referral_url": "https://yourstore.com?ref=JOHN-2026",
    "commission_rate": "10.00",
    "status": "active",
    "total_conversions": 24,
    "total_earned": "348.50",
    "pending_payout": "87.20",
    "paid_out": "261.30"
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
      "order_number": "ORD-20260301-0042",
      "order_total": "89.99",
      "commission_amount": "9.00",
      "status": "approved",
      "converted_at": "2026-03-01T14:22:00Z"
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
