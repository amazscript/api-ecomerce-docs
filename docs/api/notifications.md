# Notifications

LaraCommerce sends automatic notifications via **email** and **in-app** (database) channels at key customer journey moments.

---

## Notification Events

| Notification | Trigger | Channels |
|-------------|---------|---------|
| `WelcomeNotification` | User registers | Email |
| `OrderPlacedNotification` | Order successfully created | Email + Database |
| `OrderConfirmedNotification` | Payment confirmed | Email + Database |
| `OrderShippedNotification` | Order marked as shipped | Email + Database |
| `OrderDeliveredNotification` | Order marked as delivered | Email + Database |
| `OrderCancelledNotification` | Order cancelled | Email + Database |
| `PaymentRequiresActionNotification` | 3DS authentication needed | Email + Database |
| `PaymentFailedNotification` | Payment declined | Email + Database |
| `RefundProcessedNotification` | Refund completed | Email + Database |
| `ReturnRequestedNotification` | Return request initiated | Email + Database |
| `ReturnApprovedNotification` | Return request approved | Email + Database |
| `ReturnRejectedNotification` | Return request rejected | Email + Database |
| `InvoiceNotification` | Invoice generated | Email + Database |
| `ReviewApprovedNotification` | Review approved by admin | Email + Database |
| `PasswordChangedNotification` | Password changed (includes IP/device) | Email |
| `AccountDeletedNotification` | Account deletion confirmed | Email |
| `LowStockNotification` | Stock below threshold | Email (admin) |
| `StockBackInStockNotification` | Item restocked | Email + Database |
| `NewContactNotification` | New contact form submission | Email (admin only) |

---

## Managing Notifications

See [User Profile — Notifications](/api/user#notifications) for endpoints to list, read, and dismiss notifications.

### List Notifications

```http
GET /api/v1/user/notifications
```

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid-xxxx",
      "type": "OrderShipped",
      "data": {
        "order_number": "ORD-20260305-0001",
        "tracking_number": "1Z999AA10123456784",
        "carrier": "UPS"
      },
      "read_at": null,
      "created_at": "2026-03-05T14:00:00Z"
    }
  ]
}
```

### Mark as Read

```http
PATCH /api/v1/user/notifications/{id}/read
```

### Mark All as Read

```http
PATCH /api/v1/user/notifications/read-all
```

---

## Push Notifications

Register a device token to receive push notifications on mobile.

```http
POST /api/v1/user/push-tokens
```

**Request:**
```json
{
  "token": "ExponentPushToken[xxxxxx]",
  "platform": "ios"
}
```

| Platform | Values |
|----------|--------|
| `platform` | `ios`, `android`, `web` |

---

## Custom Webhooks

Developers can register webhooks to receive real-time event data on their own servers.

```http
POST /api/v1/user/webhooks
```

*Requires authentication.*

**Request:**
```json
{
  "url": "https://myapp.com/hooks/laracommerce",
  "events": ["order.placed", "order.shipped", "payment.completed"],
  "secret": "my-webhook-secret"
}
```

**Supported Events:**

| Event | Description |
|-------|-------------|
| `order.placed` | New order created |
| `order.confirmed` | Payment confirmed |
| `order.shipped` | Order dispatched |
| `order.delivered` | Order delivered |
| `order.cancelled` | Order cancelled |
| `payment.completed` | Payment successful |
| `payment.failed` | Payment failed |
| `refund.processed` | Refund completed |

**Webhook Payload:**
```json
{
  "event": "order.shipped",
  "timestamp": "2026-03-05T14:00:00Z",
  "data": {
    "order_number": "ORD-20260305-0001",
    "tracking_number": "1Z999AA10123456784"
  }
}
```

All webhook requests include an `X-Webhook-Signature` header (HMAC-SHA256 of the payload using your secret) for verification.

### List Webhooks

```http
GET /api/v1/user/webhooks
```

### Delete Webhook

```http
DELETE /api/v1/user/webhooks/{id}
```

### Delivery Logs

Each webhook delivery is logged with status, response code, and body. Admins can view and retry failed deliveries from the admin panel.
