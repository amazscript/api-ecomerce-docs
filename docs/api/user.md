# Profile & Addresses

All endpoints require authentication.

---

## User Profile

### Get Profile

```http
GET /api/v1/user
```

Returns the authenticated user's profile with addresses.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "preferred_currency": "USD",
    "preferred_language": "en",
    "email_verified_at": "2026-03-01T10:00:00Z",
    "roles": ["customer"],
    "profile": {
      "gender": "male",
      "date_of_birth": "1990-01-15",
      "bio": "Tech enthusiast",
      "website": "https://johndoe.com",
      "avatar_url": "https://..."
    },
    "addresses": [...]
  }
}
```

### Update Profile

```http
PUT /api/v1/user
```

**Request:**
```json
{
  "name": "John Doe",
  "phone": "+1234567890",
  "preferred_currency": "EUR",
  "preferred_language": "fr",
  "gender": "male",
  "date_of_birth": "1990-01-15",
  "bio": "Tech enthusiast",
  "website": "https://johndoe.com",
  "facebook_url": "https://facebook.com/johndoe",
  "instagram_url": "https://instagram.com/johndoe"
}
```

All fields are optional.

### Upload Avatar

```http
POST /api/v1/user/avatar
```

Uploads a profile picture to MinIO/S3. Replaces the previous avatar.

**Content-Type:** `multipart/form-data`

| Field | Constraints |
|-------|-------------|
| `avatar` | `jpg`, `jpeg`, `png`, `webp` — max 2MB |

**Response `200`:**
```json
{
  "status": "success",
  "data": { "avatar_url": "https://minio.example.com/avatars/1/photo.jpg" }
}
```

### Change Password

```http
PUT /api/v1/user/password
```

**Request:**
```json
{
  "current_password": "oldpassword",
  "password": "newpassword",
  "password_confirmation": "newpassword"
}
```

### Delete Account

```http
DELETE /api/v1/user
```

Soft-deletes the account (GDPR compliant). Requires password confirmation. All tokens are revoked immediately.

**Request:**
```json
{ "password": "yourpassword" }
```

**Response `204`** — No content.

---

## Addresses

### List Addresses

```http
GET /api/v1/user/addresses
```

Returns all saved addresses, default address first.

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "label": "Home",
      "full_name": "John Doe",
      "phone": "+1234567890",
      "address_line1": "123 Main St",
      "address_line2": "Apt 4B",
      "city": "New York",
      "state": "NY",
      "postal_code": "10001",
      "country": "US",
      "is_default": true
    }
  ]
}
```

### Add Address

```http
POST /api/v1/user/addresses
```

**Request:**
```json
{
  "label": "Home",
  "full_name": "John Doe",
  "phone": "+1234567890",
  "address_line1": "123 Main St",
  "address_line2": "Apt 4B",
  "city": "New York",
  "state": "NY",
  "postal_code": "10001",
  "country": "US",
  "is_default": true
}
```

::: info First Address
The first address added is automatically set as default.
:::

### Update Address

```http
PUT /api/v1/user/addresses/{id}
```

Same fields as above. Setting `is_default: true` clears the default flag from other addresses.

### Delete Address

```http
DELETE /api/v1/user/addresses/{id}
```

The default address cannot be deleted. Set another address as default first.

### Set Default Address

```http
PATCH /api/v1/user/addresses/{id}/default
```

Sets the specified address as the default delivery address.

---

## Wishlist

### Get Wishlist

```http
GET /api/v1/user/wishlist
```

Returns all products in the user's wishlist.

### Add to Wishlist

```http
POST /api/v1/user/wishlist
```

**Request:**
```json
{ "product_id": 1 }
```

### Remove from Wishlist

```http
DELETE /api/v1/user/wishlist/{product_id}
```

---

## Wallet

The wallet stores store credit that can be applied at checkout.

### Get Balance

```http
GET /api/v1/user/wallet
```

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "balance": "25.50",
    "currency": "USD",
    "transactions": [...]
  }
}
```

---

## Loyalty Points

### Get Balance

```http
GET /api/v1/user/loyalty/balance
```

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "balance": 450,
    "lifetime_earned": 1200,
    "lifetime_redeemed": 750
  }
}
```

### Transaction History

```http
GET /api/v1/user/loyalty/history
```

Paginated list of points earned and redeemed.

### Redeem Points

```http
POST /api/v1/user/loyalty/redeem
```

Converts loyalty points into wallet credit.

**Request:**
```json
{ "points": 100 }
```

---

## Invoices

```http
GET /api/v1/user/invoices
```

Lists all invoices for the user's orders.

```http
GET /api/v1/user/invoices/{id}/download
```

Downloads the invoice as a PDF.

---

## Notifications

### List Notifications

```http
GET /api/v1/user/notifications
```

Returns unread and recent notifications.

### Mark as Read

```http
PATCH /api/v1/user/notifications/{id}/read
```

### Mark All as Read

```http
PATCH /api/v1/user/notifications/read-all
```

### Register Push Token

```http
POST /api/v1/user/push-tokens
```

Register a device token for push notifications (iOS/Android).

**Request:**
```json
{
  "token": "ExponentPushToken[xxxxxx]",
  "platform": "ios"
}
```
