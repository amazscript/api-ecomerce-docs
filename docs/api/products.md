# Products & Catalogue

The catalogue is fully public — no authentication needed to browse products, categories, or reviews.

---

## Categories

### List Categories

```http
GET /api/v1/categories
```

Returns the category tree (root categories with nested children).

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `flat` | boolean | Return a flat list of all categories (useful for filter menus) |

**Response `200` — Tree:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Electronics",
      "slug": "electronics",
      "image_url": "https://...",
      "children": [
        { "id": 5, "name": "Smartphones", "slug": "smartphones" },
        { "id": 6, "name": "Laptops", "slug": "laptops" }
      ]
    }
  ]
}
```

### Get Category

```http
GET /api/v1/categories/{id}
```

Returns a single category with its direct children.

---

## Products

### List Products

```http
GET /api/v1/products
```

Returns a paginated list of published, active products.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `category_id` | integer | Filter by category (includes subcategories automatically) |
| `min_price` | number | Minimum price |
| `max_price` | number | Maximum price |
| `featured` | boolean | Only featured products |
| `in_stock` | boolean | Only products with at least one variant in stock |
| `on_sale` | boolean | Only products with a sale price (`compare_price > price`) |
| `is_new` | boolean | Products published in the last 30 days |
| `is_digital` | boolean | Digital products only |
| `min_rating` | number | Minimum average rating (e.g. `4` for 4★ and above) |
| `attribute_value_id[]` | array | Filter by attribute values (e.g. size=M, color=Red) |
| `per_page` | integer | Results per page (default: 15) |

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro",
      "slug": "iphone-15-pro",
      "price": "999.00",
      "compare_price": "1099.00",
      "average_rating": 4.7,
      "reviews_count": 42,
      "has_stock": true,
      "is_digital": false,
      "brand": { "id": 1, "name": "Apple" },
      "category": { "id": 5, "name": "Smartphones" },
      "images": [
        { "url": "https://...", "is_primary": true }
      ],
      "variants": [
        {
          "id": 10,
          "sku": "IPH15P-256-BLK",
          "price": "999.00",
          "stock_quantity": 50,
          "attribute_values": [
            { "attribute": "Storage", "value": "256GB" },
            { "attribute": "Color", "value": "Black" }
          ]
        }
      ]
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 15,
    "total": 120,
    "last_page": 8
  }
}
```

### Get Product Detail

```http
GET /api/v1/products/{slug}
```

Returns full product information including all variants, attributes, tags, and images. Each call increments the `views_count` counter.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "iPhone 15 Pro",
    "slug": "iphone-15-pro",
    "description": "...",
    "price": "999.00",
    "compare_price": "1099.00",
    "sku": "IPH15P",
    "weight": 0.187,
    "average_rating": 4.7,
    "reviews_count": 42,
    "views_count": 1503,
    "is_digital": false,
    "published_at": "2026-01-15T00:00:00Z",
    "brand": { "id": 1, "name": "Apple", "logo_url": "https://..." },
    "category": { "id": 5, "name": "Smartphones", "slug": "smartphones" },
    "tags": ["5G", "Pro", "Titanium"],
    "images": [
      { "url": "https://...", "is_primary": true, "sort_order": 1 }
    ],
    "variants": [
      {
        "id": 10,
        "sku": "IPH15P-256-BLK",
        "price": "999.00",
        "compare_price": null,
        "stock_quantity": 50,
        "weight": 0.187,
        "is_active": true,
        "attribute_values": [
          { "attribute": "Storage", "value": "256GB", "color_hex": null },
          { "attribute": "Color", "value": "Black", "color_hex": "#000000" }
        ]
      }
    ]
  }
}
```

### Featured Products

```http
GET /api/v1/products/featured
```

Returns up to 12 featured products. Ideal for homepage carousels.

### Related Products

```http
GET /api/v1/products/{slug}/related
```

Returns up to 8 products from the same category or brand, in random order. Perfect for "You may also like" sections.

---

## Product Variants & Attributes

Products have **variants** (e.g. Size M / Color Red) controlled by **attributes**.

Each variant has:
- Its own `sku`, `price`, `compare_price`, `stock_quantity`, `weight`
- A set of `attribute_values` (e.g. `Size: XL`, `Color: Blue`)

Use the `attribute_value_id[]` filter on the product list to show only products available in a specific size or color.

---

## Reviews

### List Product Reviews

```http
GET /api/v1/products/{slug}/reviews
```

Public endpoint. Returns approved reviews, sorted by helpfulness then recency.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `rating` | integer | Filter by star rating (1–5) |
| `verified_only` | boolean | Only show verified purchase reviews |
| `per_page` | integer | Default: 15 |

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "rating": 5,
      "title": "Excellent product!",
      "body": "Very happy with this purchase.",
      "is_verified_purchase": true,
      "helpful_count": 12,
      "not_helpful_count": 1,
      "user": { "name": "John D." },
      "images": [],
      "created_at": "2026-02-10T14:30:00Z"
    }
  ]
}
```

### Submit a Review

```http
POST /api/v1/products/{slug}/reviews
```

*Requires authentication.*

**Request:**
```json
{
  "rating": 5,
  "title": "Great product!",
  "body": "Works exactly as described.",
  "order_item_id": 42
}
```

| Field | Required | Description |
|-------|----------|-------------|
| `rating` | Yes | 1 to 5 stars |
| `title` | No | Short summary |
| `body` | No | Full review text (max 5000 chars) |
| `order_item_id` | No | Link to an order item to get "Verified Purchase" badge |

**Review Statuses:**
- `pending` — awaiting moderation (default)
- `approved` — visible publicly
- `rejected` — not visible

::: info Verified Purchase
If you provide an `order_item_id` from a delivered order, the review automatically gets a **Verified Purchase** badge.
:::

::: tip One review per product
Each user can submit one review per product per order item. Duplicate submissions are rejected with a `422` error.
:::

### Update a Review

```http
PUT /api/v1/reviews/{id}
```

*Requires authentication. Own reviews only.*

Updates `rating`, `title`, or `body`. Only works while the review is `pending`.

### Delete a Review

```http
DELETE /api/v1/reviews/{id}
```

*Requires authentication. Own reviews only.*

Returns `204 No Content`.

### Vote on a Review

```http
POST /api/v1/reviews/{id}/vote
```

*Requires authentication.*

Mark a review as helpful or not helpful.

**Request:**
```json
{ "is_helpful": true }
```

::: info Vote toggle
Voting the same way twice cancels the vote. Changing from helpful to not-helpful automatically adjusts both counters.
:::
