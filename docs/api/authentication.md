# Authentication

LaraCommerce uses **Laravel Sanctum** with two tokens per session — an **access token** (short-lived) and a **refresh token** (long-lived). Every protected route requires an `Authorization: Bearer {token}` header.

## Base URL

```
https://localhost/api/v1        # Docker (with Nginx + SSL)
http://localhost:8000/api/v1    # Manual (php artisan serve)
```

## Required Headers

```http
Authorization: Bearer {access_token}
Accept: application/json
Content-Type: application/json
```

---

## Register

```http
POST /api/v1/auth/register
```

Creates a new customer account. The system automatically creates a **user profile**, a **wallet**, and a **wishlist** via an observer.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Secret123",
  "password_confirmation": "Secret123",
  "phone": "+1234567890",
  "currency": "USD",
  "language": "en",
  "device_name": "iPhone 15"
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `name` | Yes | 2–100 characters |
| `email` | Yes | Valid email, unique |
| `password` | Yes | Min 8 chars, mixed case + numbers |
| `password_confirmation` | Yes | Must match `password` |
| `phone` | No | Max 20 chars |
| `currency` | No | ISO 4217 code (e.g. `USD`) |
| `language` | No | Language code (e.g. `en`, `fr`) |
| `device_name` | No | Used to name the token |

**Response `201`:**
```json
{
  "status": "success",
  "message": "Account created successfully. Please verify your email.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["customer"]
    },
    "access_token": "1|abcdefghij...",
    "refresh_token": "2|zyxwvutsrq...",
    "token_type": "Bearer",
    "expires_in": 2592000
  }
}
```

::: warning Email verification required
The account is created and tokens are returned, but **the account cannot use protected endpoints until the email is verified**. A verification email is sent automatically.
:::

---

## Email Verification

After register, the user receives an email with a signed verification link.

### Verify Email (from the link)

```http
GET /api/v1/auth/verify-email/{id}/{hash}
```

*Requires authentication + valid signed URL.*

The user clicks this link in their email. On success:
- Email is marked as verified
- A **Welcome email** is sent

**Response `200`:**
```json
{
  "status": "success",
  "message": "Email verified successfully."
}
```

### Resend Verification Email

```http
POST /api/v1/auth/verify-email/resend
```

*Requires authentication.*

If the email wasn't received or the link expired (valid 60 minutes).

**Response `200`:**
```json
{
  "status": "success",
  "message": "Verification email sent."
}
```

---

## Login

```http
POST /api/v1/auth/login
```

**Request:**
```json
{
  "email": "john@example.com",
  "password": "Secret123",
  "device_name": "iPhone 15"
}
```

`device_name` is optional. If provided, any existing tokens for that device are revoked before issuing new ones (prevents duplicate sessions per device).

**Response `200`:**
```json
{
  "status": "success",
  "message": "Login successful.",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "roles": ["customer"]
    },
    "access_token": "1|abcdefghij...",
    "refresh_token": "2|zyxwvutsrq...",
    "token_type": "Bearer",
    "expires_in": 2592000
  }
}
```

### Login Security Checks

| Condition | HTTP | Code |
|-----------|------|------|
| Wrong email or password | `401` | `INVALID_CREDENTIALS` |
| Account deleted (soft-deleted) | `401` | `ACCOUNT_DELETED` |
| Account suspended | `403` | `ACCOUNT_SUSPENDED` |
| Email not verified | `403` | `EMAIL_NOT_VERIFIED` + new verification email sent |

::: tip Unverified email
If the user tries to log in without verifying their email, the API automatically resends the verification email and returns `403`. The user simply needs to check their inbox and click the link.
:::

---

## Token System

Each login/register issues **two tokens**:

| Token | Purpose | Lifetime |
|-------|---------|---------|
| `access_token` | Used in `Authorization` header for all API requests | Configurable (default: 30 days) |
| `refresh_token` | Exchange for a new access token when it expires | Long-lived |

Store both tokens securely on the client. Use the `access_token` for API calls. When the access token expires, use the refresh token to get a new one without requiring the user to log in again.

---

## Refresh Token

```http
POST /api/v1/auth/refresh
```

Exchange a refresh token for a new access token without requiring the user to log in again.

**Request:**
```json
{ "refresh_token": "2|zyxwvutsrq..." }
```

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "access_token": "3|newtoken...",
    "refresh_token": "4|newrefresh...",
    "token_type": "Bearer",
    "expires_in": 2592000
  }
}
```

---

## Logout

```http
POST /api/v1/auth/logout
```

*Requires authentication.*

Revokes the **current** access token only. Other sessions (other devices) remain active.

**Response `200`:**
```json
{
  "status": "success",
  "message": "Logged out successfully."
}
```

## Logout All Devices

```http
POST /api/v1/auth/logout-all
```

*Requires authentication.*

Revokes **all** tokens for this user — signs out on every device simultaneously.

---

## Social Login

```http
POST /api/v1/auth/social/{provider}
```

OAuth login using an external provider. Returns the same token pair as regular login.

**Supported providers:** `google`, `facebook`, `apple` (configurable in `config/services.php`)

**Request:**
```json
{ "token": "oauth-access-token-from-provider" }
```

**Response `200`:** Same as [Login](#login).

---

## Forgot Password

```http
POST /api/v1/auth/forgot-password
```

Sends a password reset link to the provided email.

**Request:**
```json
{ "email": "john@example.com" }
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "If an account with this email exists, a reset link has been sent."
}
```

::: info Security
The response is always `200` regardless of whether the email exists. This prevents user enumeration attacks.
:::

The reset link is sent to `FRONTEND_URL/reset-password?token=...&email=...` and is **valid for 60 minutes**.

---

## Reset Password

```http
POST /api/v1/auth/reset-password
```

Resets the password using the token from the email link.

**Request:**
```json
{
  "token": "reset-token-from-email",
  "email": "john@example.com",
  "password": "NewSecret456",
  "password_confirmation": "NewSecret456"
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "Your password has been reset."
}
```

**Error `422`:**
```json
{
  "status": "error",
  "message": "This password reset token is invalid.",
  "code": "RESET_FAILED"
}
```

### What happens on reset:
1. New password is saved
2. **All active tokens are revoked** — the user is logged out on all devices
3. A `PasswordChangedNotification` email is sent with the **IP address** and **device** that made the request

The user must log in again with the new password to get fresh tokens.

---

## Roles & Permissions

| Role | Access |
|------|--------|
| `customer` | Own data only (orders, profile, cart, etc.) |
| `manager` | Orders, products, inventory management |
| `admin` | Full access including Filament admin panel |

---

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `POST /auth/login` | 10 requests / minute |
| `POST /auth/register` | 10 requests / minute |
| `POST /auth/forgot-password` | 5 requests / minute |
| `POST /auth/reset-password` | 5 requests / minute |

::: info Testing
Rate limiting is disabled in the test environment (`APP_ENV=testing`).
:::
