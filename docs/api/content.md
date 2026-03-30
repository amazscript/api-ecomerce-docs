# Blog & Content

LaraCommerce includes a built-in blog and CMS for marketing content. All read endpoints are public.

---

## Blog Posts

### List Posts

```http
GET /api/v1/blog
```

Returns published blog posts, newest first.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category_id` | integer | Filter by category ID |
| `search` | string | Search in title and content |
| `per_page` | integer | Default: 10 |

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Top 10 Wireless Headphones in 2026",
      "slug": "top-10-wireless-headphones-2026",
      "excerpt": "We tested 50+ headphones to bring you the definitive list.",
      "featured_image": "https://...",
      "published_at": "2026-03-01T09:00:00Z",
      "author": { "name": "Jane Smith" },
      "category": { "name": "Reviews", "slug": "reviews" }
    }
  ]
}
```

### Get Post

```http
GET /api/v1/blog/{slug}
```

Returns the full blog post content.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Top 10 Wireless Headphones in 2026",
    "slug": "top-10-wireless-headphones-2026",
    "content": "<p>Full HTML content...</p>",
    "meta_title": "Best Wireless Headphones 2026",
    "meta_description": "...",
    "views_count": 1240,
    ...
  }
}
```

---

## Static Pages

```http
GET /api/v1/pages/{slug}
```

Returns static CMS pages (About Us, Terms of Service, Privacy Policy, etc.).

---

## FAQs

```http
GET /api/v1/faqs
```

Returns all active FAQ items, grouped by category.

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "question": "How do I track my order?",
      "answer": "You can track your order in your account under Orders.",
      "category": "Orders",
      "sort_order": 1
    }
  ]
}
```

---

## Contact

```http
POST /api/v1/contact
```

Public endpoint. Submits a contact form message.

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Order inquiry",
  "message": "I have a question about my recent order..."
}
```

**Response `200`:**
```json
{
  "status": "success",
  "message": "Your message has been sent. We'll get back to you shortly."
}
```

An admin notification is sent automatically when a new contact message is received.

---

## Newsletter

```http
POST /api/v1/newsletter/subscribe
```

**Request:**
```json
{ "email": "john@example.com" }
```

```http
POST /api/v1/newsletter/unsubscribe/{token}
```

The unsubscribe link (with token) is included in every newsletter email. No request body needed.

---

## Product Q&A

```http
GET /api/v1/products/{slug}/questions
```

Returns approved customer questions and answers for a product.

```http
POST /api/v1/products/{slug}/questions
```

*Requires authentication.* Submit a question about a product.

**Request:**
```json
{ "question": "Is this compatible with iPhone 15?" }
```

---

## Currencies

```http
GET /api/v1/currencies
```

Returns all supported currencies with exchange rates (relative to the base currency).

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    { "code": "USD", "name": "US Dollar", "symbol": "$", "exchange_rate": 1.0000, "is_default": true },
    { "code": "EUR", "name": "Euro", "symbol": "€", "exchange_rate": 0.9200 },
    { "code": "GBP", "name": "British Pound", "symbol": "£", "exchange_rate": 0.7900 },
    { "code": "MAD", "name": "Moroccan Dirham", "symbol": "د.م.", "exchange_rate": 10.0500 },
    { "code": "AED", "name": "UAE Dirham", "symbol": "د.إ", "exchange_rate": 3.6700 }
  ]
}
```
