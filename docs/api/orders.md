# Orders

All order endpoints require authentication. Users can only access their own orders.

---

## List Orders

```http
GET /api/v1/orders
```

Returns a paginated list of the authenticated user's orders, most recent first.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `per_page` | integer | Results per page (default: 15) |

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "order_number": "ORD-20260305-0001",
      "status": "confirmed",
      "total": "134.97",
      "currency": "USD",
      "items_count": 3,
      "created_at": "2026-03-05T10:00:00Z"
    }
  ],
  "meta": { "current_page": 1, "total": 8 }
}
```

---

## Place an Order (Checkout)

```http
POST /api/v1/orders
```

Creates an order from the current cart. The cart must not be empty.

**Request:**
```json
{
  "address_id": 1,
  "shipping_method_id": 2,
  "notes": "Please leave at the door"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `address_id` | Yes | Delivery address from your saved addresses |
| `shipping_method_id` | Yes | Selected shipping method |
| `notes` | No | Optional order notes (max 500 chars) |

**What happens on checkout:**
1. Taxes are calculated via `TaxService` using the delivery address country/state
2. Order and items are created with price/product snapshots
3. Stock is **deducted** from inventory for each variant with `track_inventory` enabled
4. Coupon usage is recorded (if applicable)
5. The cart is cleared
6. An order number is auto-generated (`ORD-YYYYMMDD-XXXX`)

::: warning Stock Protection
If any item has insufficient stock, the entire checkout transaction is rolled back and an error is returned. No partial orders are created.
:::

**Response `201`:**
```json
{
  "status": "success",
  "message": "Order placed successfully.",
  "data": {
    "id": 1,
    "order_number": "ORD-20260305-0001",
    "status": "pending",
    "subtotal": "119.98",
    "shipping_cost": "9.99",
    "discount_amount": "0.00",
    "tax_amount": "12.00",
    "total": "141.97",
    "currency": "USD",
    "notes": "Please leave at the door",
    "coupon": null,
    "items": [
      {
        "id": 1,
        "product_name": "Wireless Headphones",
        "variant_sku": "WH-BLK",
        "quantity": 2,
        "unit_price": "49.99",
        "total": "99.98"
      }
    ],
    "addresses": {
      "shipping": {
        "full_name": "John Doe",
        "address_line1": "123 Main St",
        "city": "New York",
        "country": "US"
      }
    },
    "status_histories": [
      { "status": "pending", "note": "Order placed", "created_at": "2026-03-05T10:00:00Z" }
    ]
  }
}
```

---

## Get Order Detail

```http
GET /api/v1/orders/{order_number}
```

Returns full order details including items, addresses, status history, and shipment info.

**Example:** `GET /api/v1/orders/ORD-20260305-0001`

---

## Cancel an Order

```http
POST /api/v1/orders/{order_number}/cancel
```

**Request:**
```json
{ "reason": "Changed my mind" }
```

Cancellation is only allowed when the order is in `pending` or `confirmed` status. Orders that are `shipped` or `delivered` cannot be cancelled.

**Response `200`:**
```json
{
  "status": "success",
  "message": "Order cancelled.",
  "data": { ...updated order... }
}
```

**Error `422`:**
```json
{
  "status": "error",
  "message": "This order cannot be cancelled.",
  "code": "ORDER_CANNOT_BE_CANCELLED"
}
```

---

## Order Statuses

| Status | Description |
|--------|-------------|
| `pending` | Order placed, awaiting payment |
| `confirmed` | Payment confirmed |
| `processing` | Being prepared |
| `shipped` | Dispatched — tracking available |
| `delivered` | Delivered to customer |
| `cancelled` | Cancelled by customer or admin |
| `refunded` | Fully refunded |

Every status change is logged in `status_histories` with a timestamp and optional note.

---

## Order Notifications

Customers automatically receive email notifications at key stages:

| Event | Notification |
|-------|-------------|
| Order placed | `OrderPlaced` — confirmation with items and total |
| Order confirmed | `OrderConfirmed` — payment receipt |
| Order shipped | `OrderShipped` — tracking number |
| Order delivered | `OrderDelivered` — delivery confirmation |
| Refund processed | `RefundProcessed` — refund amount and method |
