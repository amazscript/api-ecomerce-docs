# Notifications

LaraCommerce sends automatic notifications via **email**, **in-app** (database), and **push** (Firebase Cloud Messaging) channels at key customer journey moments.

---

## Notification Events

| Notification | Trigger | Channels |
|-------------|---------|---------|
| `WelcomeNotification` | Email verified | Email + Database + Push |
| `OrderPlacedNotification` | Order successfully created | Email + Database + Push |
| `OrderConfirmedNotification` | Payment confirmed | Email + Database + Push |
| `OrderShippedNotification` | Order marked as shipped | Email + Database + Push |
| `OrderDeliveredNotification` | Order marked as delivered | Email + Database + Push |
| `OrderCancelledNotification` | Order cancelled | Email + Database + Push |
| `PaymentRequiresActionNotification` | 3DS authentication needed | Email + Database |
| `PaymentFailedNotification` | Payment declined | Email + Database + Push |
| `RefundProcessedNotification` | Refund completed | Email + Database + Push |
| `ReturnRequestedNotification` | Return request initiated | Email + Database |
| `ReturnApprovedNotification` | Return request approved | Email + Database + Push |
| `ReturnRejectedNotification` | Return request rejected | Email + Database + Push |
| `InvoiceNotification` | Invoice generated | Email + Database |
| `ReviewApprovedNotification` | Review approved by admin | Email + Database |
| `PasswordChangedNotification` | Password changed (includes IP/device) | Email |
| `AccountDeletedNotification` | Account deletion confirmed | Email |
| `LowStockNotification` | Stock below threshold | Email (admin) |
| `StockBackInStockNotification` | Item restocked | Email + Database + Push |
| `NewContactNotification` | New contact form submission | Email (admin only) |

---

## Push Notifications (Firebase Cloud Messaging)

LaraCommerce uses **FCM v1 API** via the `kreait/laravel-firebase` package to send push notifications to mobile devices.

### How It Works

1. The Flutter app registers a device token via `POST /api/v1/user/push-token`
2. When an event occurs (order shipped, payment failed, etc.), the notification is sent on 3 channels: email, database, and **push**
3. FCM delivers the push notification to the registered devices
4. Invalid/expired tokens are automatically deactivated

### FCM Payload Format

The payload sent to devices follows this structure, used by the Flutter app for navigation:

```json
{
  "notification": {
    "title": "Colis expédié",
    "body": "Votre commande ORD-001 a été expédiée"
  },
  "data": {
    "type": "order_shipped",
    "order_number": "ORD-001"
  }
}
```

The `data.type` field is used by the Flutter app for navigation on tap.

### Notification Types

| Type | Title | Trigger |
|------|-------|---------|
| `order_placed` | Commande confirmée | Order created |
| `order_confirmed` | Commande en préparation | Payment confirmed |
| `order_shipped` | Colis expédié | Order shipped |
| `order_delivered` | Colis livré | Order delivered |
| `order_cancelled` | Commande annulée | Order cancelled |
| `payment_failed` | Paiement échoué | Payment failed |
| `refund_processed` | Remboursement effectué | Refund completed |
| `return_approved` | Retour approuvé | Return approved |
| `return_rejected` | Retour refusé | Return rejected |
| `back_in_stock` | De retour en stock | Product restocked |
| `welcome` | Bienvenue ! | Email verified |

### Configuration

```ini
# .env
FIREBASE_CREDENTIALS=firebase-service-account.json
```

Download the service account JSON from [Firebase Console](https://console.firebase.google.com/) → Project Settings → Service accounts → Generate new private key.

Place the file at the project root. It is excluded from git via `.gitignore`.

---

## Register Push Token

```http
POST /api/v1/user/push-token
Authorization: Bearer {token}
```

**Request:**
```json
{
  "token": "dx8iE3KeSc6tCrdnb8-qOU:APA91b...",
  "platform": "android",
  "device_id": "unique-device-id"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | FCM device token |
| `platform` | string | Yes | `ios`, `android`, or `web` |
| `device_id` | string | No | Unique device identifier (used for upsert) |

**Response `201`:**
```json
{
  "status": "success",
  "message": "Created"
}
```

### Delete Push Token

```http
DELETE /api/v1/user/push-token
Authorization: Bearer {token}
```

**Request:**
```json
{
  "device_id": "unique-device-id"
}
```

---

## Managing Notifications

### List Notifications

```http
GET /api/v1/user/notifications
Authorization: Bearer {token}
```

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "type": "order_shipped",
        "title": "Colis expédié",
        "body": "Votre commande ORD-001 a été expédiée",
        "data": {"order_number": "ORD-001"},
        "read_at": null,
        "created_at": "2026-03-17T10:00:00Z"
      }
    ],
    "current_page": 1,
    "last_page": 1,
    "total": 1
  }
}
```

### Mark All as Read

```http
PATCH /api/v1/user/notifications/read-all
Authorization: Bearer {token}
```

---

## Admin Panel

The admin panel includes a **Notifications** section at `/admin`:

| Page | URL | Features |
|------|-----|----------|
| **Notifications** | `/admin/push-notifications` | List all notifications, filter by type/read status, mark read/unread, send manual push |
| **Push Tokens** | `/admin/push-tokens` | List device tokens, test push, activate/deactivate, filter by platform |

### Send Manual Push (Admin)

From the **Notifications** page, click **"Send Push Notification"** to send a custom push to any user with an active device token.

### Test Push (Admin)

From the **Push Tokens** page, click **"Test Push"** on any active token to send a test notification to that device.

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
