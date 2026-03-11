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
