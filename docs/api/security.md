# Security & Validation

LaraCommerce is built with enterprise-grade security in mind. This page details the built-in security features, middleware, and request validation mechanisms.

---

## Global Middleware

Every API request passes through a series of global middlewares configured in `bootstrap/app.php`:

### 1. `ForceJsonResponse`
Automatically intercepts all requests (even those without the `Accept: application/json` header) and ensures that the API *always* returns a properly formatted JSON response. This prevents HTML error pages from leaking into client applications.

### 2. `SecurityHeaders`
Adds crucial HTTP security headers to every response to protect against XSS, clickjacking, and other common web vulnerabilities:
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Cache-Control: no-store, must-revalidate`
- `Pragma: no-cache`
- Server identification headers (`X-Powered-By`, `Server`) are removed.

### 3. Rate Limiting (`throttle`)
LaraCommerce uses Redis-backed rate limiting in production to prevent brute-force and DDoS attacks.
- **Global API (`throttle:api`)**: 60 requests per minute.
- **Auth Routes (`throttle:auth`)**: 10 requests per minute (Login, Register).
- **Strict Routes (`throttle:strict`)**: 5 requests per minute (Password reset, Returns).

---

## Authentication & Authorization

### Sanctum Tokens
The API uses **Laravel Sanctum** for stateful SPA authentication or token-based API authentication. We implement a **dual-token system**:
1.  **Access Token**: Short-lived, used for all protected endpoints.
2.  **Refresh Token**: Long-lived, used to obtain a new access token without re-authenticating.

### Route Protection Aliases
Specific routes are protected using middleware aliases:
- `check.active`: Ensures the authenticated user's account is not suspended (`is_active = true`). If suspended, returns a `403 Forbidden`.
- `email.verified`: Requires the user to have verified their email before accessing sensitive routes (e.g., placing an order, payments).

### Role-Based Access Control (RBAC)
We utilize **Spatie Laravel Permission** to handle complex authorization.
- **Roles**: `customer`, `manager`, `admin`.
- **Permissions**: 57 granular permissions (e.g., `view orders`, `edit products`, `manage settings`).
- Middleware applied to admin routes: `middleware(['auth:sanctum', 'role:admin'])`.

---

## Validation & Exception Handling

### Form Requests
Incoming data is strictly validated using Laravel Form Requests (e.g., `StoreProductRequest`, `UpdateUserRequest`). Invalid data automatically triggers a `422 Unprocessable Entity` response with a structured error payload.

### Model Validation On Save (`ValidatesOnSave`)
As a second layer of defense, a custom trait (`ValidatesOnSave`) is applied to Eloquent models. This ensures that even if data is modified programmatically outside of a controller, it must pass the model's validation rules before being saved to the database.

### Centralized Exception Handler
The API features a custom exception handler in `bootstrap/app.php` that intercepts all exceptions and normalizes them into a consistent JSON format.

```json
// Example of a normalized 403 response
{
  "status": "error",
  "message": "Forbidden. Insufficient permissions.",
  "code": "FORBIDDEN"
}
```
Exceptions handled specifically:
- `ValidationException` -> `422`
- `ModelValidationException` -> `422`
- `SpatieUnauthorizedException` -> `403`
- `AuthenticationException` -> `401`
- `NotFoundHttpException` -> `404`
- `MethodNotAllowedHttpException` -> `405`

---

## Webhook Security

### Stripe Signature Verification
All incoming Stripe webhooks are verified using `\Stripe\Webhook::constructEvent()` with the `STRIPE_WEBHOOK_SECRET` environment variable. If the secret is not configured, webhooks are rejected with a logged error. Invalid signatures return `400 Bad Request`.

### Event Deduplication
Processed webhook events are cached for **48 hours** using the event ID as key. Duplicate events are silently acknowledged with `200 OK` to prevent double-processing (e.g., double refunds or duplicate order confirmations).

### SSRF Protection
Custom webhook endpoint URLs (admin-configured) are validated against private/internal IP ranges:
- `127.0.0.1`, `::1`, `0.0.0.0`, `localhost` are blocked
- Private ranges (`10.x`, `172.16-31.x`, `192.168.x`) are blocked
- Link-local (`169.254.x`) is blocked
- DNS resolution is verified before accepting the URL

---

## Data Protection

### API Logger Sanitization
The `ApiLogger` middleware logs all API requests but sanitizes sensitive fields before storage:
`password`, `password_confirmation`, `current_password`, `card_number`, `cvv`, `stripe_token`, `payment_method_id`, `secret`, `token`, `api_key`, `webhook_secret`, `authorization`

### Model-Level Safeguards
- All models use `ValidatesOnSave` trait — data is validated even when modified programmatically
- Sensitive fields hidden from JSON serialization via `$hidden`: passwords, tokens, Stripe IDs, IP addresses, cost prices
- Stripe `client_secret` only exposed when payment status is `pending`

---

## Financial Safeguards

- **Refund validation**: Amount must be > 0 and <= original payment amount
- **Wallet locking**: Both `credit()` and `debit()` use `SELECT ... FOR UPDATE` pessimistic locks
- **Inventory protection**: `deduct()` throws `InsufficientStockException` if stock would go negative
- **Payment idempotency**: Each Stripe PaymentIntent uses a unique idempotency key
- **Webhook deduplication**: 48-hour cache prevents double-processing of payment events
