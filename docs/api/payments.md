# Payments

LaraCommerce uses **Stripe** as its payment processor. The flow uses Payment Intents with full support for 3D Secure (SCA) authentication.

All payment endpoints require authentication.

---

## Payment Flow

```
1. Place order   → POST /orders          → order_number
2. Create intent → POST /payments/intent → client_secret
3. Confirm       → Stripe.js / SDK       → payment confirmed on client
4. Verify        → POST /payments/confirm → server verifies status
5. Webhook       → Stripe notifies API  → order marked paid
```

---

## Create Payment Intent

```http
POST /api/v1/payments/intent
```

Creates a Stripe PaymentIntent for a pending order. Returns the `client_secret` needed by the frontend to complete payment.

**Request:**
```json
{
  "order_number": "ORD-20260305-0001",
  "payment_method_id": "pm_1234abcd"
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `order_number` | Yes | Order to pay for (must have `payment_status: pending`) |
| `payment_method_id` | No | Stripe Payment Method ID from a saved card. Leave empty to let Stripe.js collect card details |

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "order_number": "ORD-20260305-0001",
    "amount": "141.97",
    "currency": "EUR",
    "status": "pending",
    "stripe_payment_intent_id": "pi_3Oxxxxxx",
    "client_secret": "pi_3Oxxxxxx_secret_xxxxxxx",
    "requires_action": false
  }
}
```

::: tip 3D Secure
If `requires_action: true`, the customer must complete 3DS verification in the browser/app. Use the `client_secret` with `stripe.handleNextAction()` or `stripe.confirmCardPayment()`.
:::

---

## Confirm Payment

```http
POST /api/v1/payments/confirm
```

Verifies payment status on the server after the client completes the Stripe flow.

**Request:**
```json
{
  "payment_intent_id": "pi_3Oxxxxxx"
}
```

**Response `200` — Success:**
```json
{
  "status": "success",
  "message": "Payment confirmed successfully.",
  "data": { ...payment details... }
}
```

**Response `200` — Failed:**
```json
{
  "status": "success",
  "message": "Payment failed.",
  "data": { "status": "failed", ... }
}
```

::: info Webhooks
Payment confirmation also happens automatically via Stripe webhooks (`payment_intent.succeeded`). The confirm endpoint is a secondary check for the frontend.
:::

---

## Retry a Failed Payment

```http
POST /api/v1/payments/retry
```

When a payment fails (card declined, 3DS timeout, etc.), use this endpoint to try again with the same or a different card. The old failed PaymentIntent is cancelled and a new one is created.

**Request:**
```json
{
  "order_number": "ORD-20260305-0001",
  "payment_method_id": "pm_newcard123"
}
```

The order must have `payment_status: failed` to use this endpoint.

---

## Saved Payment Methods

### List Saved Cards

```http
GET /api/v1/user/payment-methods
```

Returns the user's saved Stripe cards, ordered by default first.

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "brand": "visa",
      "last_four": "4242",
      "exp_month": 12,
      "exp_year": 2027,
      "cardholder_name": "John Doe",
      "is_default": true
    }
  ]
}
```

### Save a Card

```http
POST /api/v1/user/payment-methods
```

Saves a Stripe Payment Method to the user's account. The card is attached to the user's Stripe Customer profile for future one-click payments.

**Request:**
```json
{
  "stripe_payment_method_id": "pm_1234abcd",
  "cardholder_name": "John Doe",
  "set_default": true
}
```

**How to get a `stripe_payment_method_id`:**
Use `stripe.createPaymentMethod()` in your frontend before calling this endpoint.

### Delete a Card

```http
DELETE /api/v1/user/payment-methods/{id}
```

Removes the card locally and detaches it from Stripe. If it was the default card, the next most recent card becomes the default automatically.

**Response `204`** — No content.

---

## Stripe Webhooks

```http
POST /api/v1/stripe/webhook
```

Stripe sends events to this endpoint automatically. Supported events:

| Event | Action |
|-------|--------|
| `payment_intent.succeeded` | Marks order as paid, confirms stock deduction |
| `payment_intent.payment_failed` | Marks payment as failed |
| `payment_intent.requires_action` | Sends 3DS notification to customer |
| `charge.refunded` | Updates refund status |
| `charge.dispute.created` | Creates dispute record |
| `refund.updated` | Syncs refund status |

::: warning Webhook Security
Webhook requests are verified using the Stripe signature header (`STRIPE_WEBHOOK_SECRET`). Invalid signatures return `400`. Events are deduplicated using a 48-hour cache to prevent double processing.
:::

---

## Refunds

Refund requests are handled by the admin panel. Customers can request a return/refund via:

```http
POST /api/v1/returns
```

See the [Returns & Refunds](#returns) section for details.
