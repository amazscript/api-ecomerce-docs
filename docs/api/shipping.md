# Shipping

Shipping is configured through zones, methods, and rates in the admin panel. The API exposes the available methods for a given cart.

---

## Get Available Shipping Methods

```http
GET /api/v1/shipping/methods
```

Returns shipping methods available for the customer's delivery country based on their cart.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `country` | string | ISO country code (e.g. `US`, `FR`, `GB`) |

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Standard Shipping",
      "description": "5–7 business days",
      "carrier": "UPS",
      "estimated_days": 7,
      "cost": "5.99",
      "is_free": false
    },
    {
      "id": 2,
      "name": "Express Shipping",
      "description": "1–2 business days",
      "carrier": "FedEx",
      "estimated_days": 2,
      "cost": "19.99",
      "is_free": false
    },
    {
      "id": 3,
      "name": "Free Shipping",
      "description": "Orders over $75 — 7–10 business days",
      "carrier": "Standard",
      "estimated_days": 10,
      "cost": "0.00",
      "is_free": true
    }
  ]
}
```

---

## Shipping Rate Types

The admin can configure four types of shipping rates:

| Type | How Cost is Calculated |
|------|----------------------|
| `flat` | Fixed cost regardless of order |
| `weight_based` | Cost calculated from total cart weight |
| `price_based` | Cost based on order total (e.g. free over $75) |
| `free` | Always free |

---

## Shipping Zones

Zones define which countries a shipping method applies to. An order's shipping cost is determined by:

1. The customer's delivery country
2. The shipping zone that includes that country
3. The shipping method and rate configured for that zone

---

## Order Tracking

Once an order is shipped, tracking information is available in the order detail:

```http
GET /api/v1/orders/{order_number}
```

**Response includes:**
```json
{
  "shipment": {
    "carrier": "UPS",
    "tracking_number": "1Z999AA10123456784",
    "tracking_url": "https://www.ups.com/track?tracknum=1Z999AA10123456784",
    "shipped_at": "2026-03-06T09:00:00Z",
    "estimated_delivery": "2026-03-08"
  }
}
```

---

## Returns

Customers can request a return for delivered orders.

### Request a Return

```http
POST /api/v1/returns
```

*Requires authentication.*

**Request:**
```json
{
  "order_number": "ORD-20260305-0001",
  "reason": "Product does not match description",
  "items": [
    { "order_item_id": 1, "quantity": 1 }
  ]
}
```

**Response `201`:**
```json
{
  "status": "success",
  "message": "Return request submitted.",
  "data": {
    "id": 1,
    "status": "pending",
    "reason": "Product does not match description",
    "created_at": "2026-03-10T10:00:00Z"
  }
}
```

### Return Statuses

| Status | Description |
|--------|-------------|
| `pending` | Submitted, awaiting admin review |
| `approved` | Approved — return label sent |
| `rejected` | Rejected with reason |
| `received` | Item received at warehouse |
| `completed` | Refund processed |

When a return is approved, a `ReturnApproved` notification is sent to the customer.
