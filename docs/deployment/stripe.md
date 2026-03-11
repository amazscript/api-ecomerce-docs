# Stripe Integration

LaraCommerce uses the **Stripe PHP SDK** for payments, saved cards, 3D Secure, refunds, and dispute handling.

## Setup

### 1. Get API Keys

Log in to your [Stripe Dashboard](https://dashboard.stripe.com/apikeys) and copy your keys.

For development, use the **Test** keys. For production, use **Live** keys.

```ini
STRIPE_KEY=pk_test_xxxxx       # Publishable key (frontend)
STRIPE_SECRET=sk_test_xxxxx    # Secret key (backend)
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### 2. Configure Webhook

In the Stripe Dashboard → **Developers → Webhooks**, add a new endpoint:

- **URL:** `https://yourdomain.com/api/v1/stripe/webhook`
- **Events to listen:**
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `payment_intent.requires_action`
  - `charge.refunded`
  - `charge.dispute.created`
  - `refund.updated`

Copy the **Signing secret** and set it as `STRIPE_WEBHOOK_SECRET`.

### 3. Local Webhook Testing

Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward events to your local server:

```bash
stripe listen --forward-to http://localhost:8000/api/v1/stripe/webhook
```

This outputs a local webhook signing secret — use it as `STRIPE_WEBHOOK_SECRET` during development.

## Test Cards

Use these test card numbers in development:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Success |
| `4000 0025 0000 3155` | Requires 3D Secure authentication |
| `4000 0000 0000 9995` | Card declined |

Use any future expiry date, any 3-digit CVC, and any postal code.

## Features Implemented

| Feature | Details |
|---------|---------|
| Payment Intents | Full server-side creation with idempotency keys |
| Saved Cards | Cards stored as Stripe Payment Methods linked to Stripe Customers |
| 3D Secure | `requires_action` flow with email notification |
| Retry Payments | Failed intent cancelled, new one created |
| Refunds | Full and partial refunds via Stripe API |
| Disputes | Dispute records created from webhook |
| Webhook Security | Signature verification + 48h deduplication |
