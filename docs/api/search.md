# Search

LaraCommerce uses **Meilisearch** for full-text search with instant results, typo tolerance, and rich filtering.

Search endpoints are public — no authentication required.

---

## Full-Text Search

```http
GET /api/v1/search
```

Search across products with full filtering, sorting, and optional facets.

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `q` | string | Search query (e.g. `"wireless headphones"`) |
| `category_id` | int / int[] | Filter by one or multiple categories |
| `brand_id` | int / int[] | Filter by one or multiple brands |
| `min_price` | number | Minimum price |
| `max_price` | number | Maximum price |
| `min_rating` | number | Minimum average rating (1–5) |
| `is_featured` | boolean | Featured products only |
| `is_on_sale` | boolean | On sale only (`compare_price > price`) |
| `is_new` | boolean | Published in the last 30 days |
| `in_stock` | boolean | In stock only |
| `is_digital` | boolean | Digital products only |
| `attribute_value_id[]` | array | Filter by attribute values (size, color, etc.) |
| `sort` | string | See sort options below |
| `per_page` | integer | Results per page (default: 20) |
| `with_facets` | boolean | Include facets in response (default: false) |

**Sort Options:**

| Value | Description |
|-------|-------------|
| *(empty)* | Relevance (Meilisearch ranking) |
| `price_asc` | Lowest price first |
| `price_desc` | Highest price first |
| `rating_desc` | Best rated first |
| `newest` | Most recently published |
| `sold` | Best sellers first |
| `discount` | Biggest discount first |

**Example Request:**
```
GET /api/v1/search?q=headphones&min_price=30&max_price=200&in_stock=true&sort=rating_desc&with_facets=true
```

**Response `200`:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Sony WH-1000XM5",
      "slug": "sony-wh-1000xm5",
      "price": "149.99",
      "compare_price": "249.99",
      "average_rating": 4.8,
      "has_stock": true,
      "brand": { "name": "Sony" },
      "category": { "name": "Headphones" },
      "images": [{ "url": "https://...", "is_primary": true }]
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total": 47
  },
  "facets": {
    "categories": [
      { "id": 3, "name": "Headphones", "slug": "headphones", "count": 23 }
    ],
    "brands": [
      { "id": 2, "name": "Sony", "slug": "sony", "count": 12 }
    ],
    "attributes": [
      {
        "id": 1,
        "name": "Color",
        "slug": "color",
        "type": "color",
        "values": [
          { "id": 1, "value": "Black", "color_code": "#000000", "count": 18 }
        ]
      }
    ],
    "price_range": {
      "min": 9.99,
      "max": 499.99,
      "avg": 89.50,
      "ranges": [
        { "min": 0, "max": 25, "label": "0€ – 25€" },
        { "min": 25, "max": 50, "label": "25€ – 50€" },
        { "min": 50, "max": 100, "label": "50€ – 100€" },
        { "min": 100, "max": 200, "label": "100€ – 200€" },
        { "min": 200, "max": null, "label": "200€ et plus" }
      ]
    },
    "ratings": [
      { "rating": 5, "count": 12, "label": "5★ et plus" },
      { "rating": 4, "count": 28, "label": "4★ et plus" }
    ],
    "flags": {
      "in_stock": 43,
      "is_on_sale": 11,
      "is_new": 5,
      "is_digital": 0
    }
  }
}
```

::: tip Facets for filter UI
Request `with_facets=true` on the first load to build your filter sidebar. On subsequent filter changes, you can skip facets (`with_facets=false`) for faster responses.
:::

---

## Autocomplete Suggestions

```http
GET /api/v1/search/suggestions?q=head
```

Returns fast autocomplete results for products and categories. Requires at least 2 characters.

**Response `200`:**
```json
{
  "status": "success",
  "data": {
    "products": [
      { "id": 1, "name": "Sony WH-1000XM5", "slug": "sony-wh-1000xm5", "price": 149.99 },
      { "id": 4, "name": "Headphone Stand", "slug": "headphone-stand", "price": 24.99 }
    ],
    "categories": [
      { "id": 3, "name": "Headphones", "slug": "headphones" }
    ]
  }
}
```

Returns up to 5 results per type. Ideal for live search dropdowns.

---

## Meilisearch Setup

After installation, index your data:

```bash
php artisan scout:import "App\Models\Product"
php artisan scout:import "App\Models\Category"
php artisan scout:import "App\Models\BlogPost"
```

Configure `.env`:

```ini
SCOUT_DRIVER=meilisearch
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_KEY=your-master-key
```

::: info Testing
In the test environment, `SCOUT_DRIVER=collection` is used automatically — no Meilisearch server needed.
:::
