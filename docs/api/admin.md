# Admin API Reference

Admin endpoints are prefixed with `/api/v1/admin/` and require authentication with `admin` role.

---

## Catalogue Management

### Products
```http
GET    /api/v1/admin/products
POST   /api/v1/admin/products
GET    /api/v1/admin/products/{id}
PUT    /api/v1/admin/products/{id}
DELETE /api/v1/admin/products/{id}
POST   /api/v1/admin/products/{id}/restore
```

### Product Assets & Variants
```http
POST   /api/v1/admin/products/{id}/images
DELETE /api/v1/admin/products/images/{image_id}
GET    /api/v1/admin/products/{id}/variants
POST   /api/v1/admin/products/{id}/variants
PUT    /api/v1/admin/products/{id}/variants/{variant_id}
DELETE /api/v1/admin/products/{id}/variants/{variant_id}
```

### Categories & Brands
```http
GET/POST/PUT/DELETE /api/v1/admin/categories/{id}
GET/POST/PUT/DELETE /api/v1/admin/brands/{id}
POST                /api/v1/admin/brands/{id}/restore
```

---

## Orders & Customers

### Orders
```http
GET    /api/v1/admin/orders
GET    /api/v1/admin/orders/{order_id}
PATCH  /api/v1/admin/orders/{order_id}/status
```

**Update Status Request:**
```json
{
  "status": "shipped",
  "note": "Dispatched via UPS"
}
```
*Valid statuses:* `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`.

### Shipments & Tracking
```http
GET/POST/PUT /api/v1/admin/shipments/{id}
POST         /api/v1/admin/shipments/{id}/trackings
```

### Returns & Refunds
```http
GET/PUT       /api/v1/admin/returns/{id}
GET/PATCH     /api/v1/admin/refunds/{id}
```

### Users & Groups
```http
GET/POST/PUT/DELETE /api/v1/admin/users/{id}
PATCH               /api/v1/admin/users/{id}/toggle (Suspend/Unsuspend)
GET/POST/DELETE     /api/v1/admin/customer-groups/{id}
POST                /api/v1/admin/customer-groups/{id}/users (Attach)
DELETE              /api/v1/admin/customer-groups/{id}/users/{user_id} (Detach)
```

---

## Marketing & Growth

### Coupons & Promotions
```http
GET/POST/PUT/DELETE /api/v1/admin/coupons/{id}
GET/POST/PUT/DELETE /api/v1/admin/promotions/{id}
POST                /api/v1/admin/promotions/{id}/sync-products
```

### Flash Sales & Bundles
```http
GET/POST/PUT/DELETE /api/v1/admin/flash-sales/{id}
POST                /api/v1/admin/flash-sales/{id}/items
DELETE              /api/v1/admin/flash-sales/{id}/items/{item_id}

GET/POST/PUT/DELETE /api/v1/admin/bundles/{id}
POST                /api/v1/admin/bundles/{id}/items
DELETE              /api/v1/admin/bundles/{id}/items/{item_id}
```

### Affiliates
```http
GET/POST/PUT/DELETE /api/v1/admin/affiliates/{id}
POST                /api/v1/admin/affiliates/{id}/approve
POST                /api/v1/admin/affiliates/{id}/reject
GET                 /api/v1/admin/affiliates/{id}/conversions
```

---

## Inventory & Shipping

### Stock Management
```http
GET    /api/v1/admin/stock
GET    /api/v1/admin/stock/alerts
POST   /api/v1/admin/stock/adjust
PUT    /api/v1/admin/stock/{inventory_id}
DELETE /api/v1/admin/stock/{inventory_id}
```

### Warehouses & Methods
```http
GET/POST/PUT/DELETE /api/v1/admin/warehouses/{id}
GET/POST/PUT/DELETE /api/v1/admin/shipping-methods/{id}
GET/POST/PUT/DELETE /api/v1/admin/shipping-zones/{id}
```

---

## Content & System

### Blog & Pages
```http
GET/POST/PUT/DELETE /api/v1/admin/blog-posts/{id}
POST                /api/v1/admin/blog-posts/{id}/publish
POST                /api/v1/admin/blog-posts/{id}/unpublish
GET/POST/PUT/DELETE /api/v1/admin/pages/{id}
```

### FAQs & Contacts
```http
GET/POST/PUT/DELETE /api/v1/admin/faqs/{id}
POST                /api/v1/admin/faqs/reorder
GET                 /api/v1/admin/contacts
GET                 /api/v1/admin/contacts/{contact}
DELETE              /api/v1/admin/contacts/{contact}
PATCH               /api/v1/admin/contacts/{contact}/read
```

### Currencies
```http
POST                /api/v1/admin/currencies/sync-rates
```

### Webhooks
```http
GET/POST/PUT/DELETE /api/v1/admin/webhooks/{id}
GET                 /api/v1/admin/webhooks/{id}/deliveries
```

### Settings & Logs
```http
GET/PUT             /api/v1/admin/settings
GET                 /api/v1/admin/logs/activity
GET                 /api/v1/admin/logs/api
GET                 /api/v1/admin/logs/search
```

---

## Roles & Permissions

The system uses **Spatie Laravel Permission**.

| Role | Access Level |
|------|-------------|
| `customer` | Default role for all registered users. |
| `manager` | Access to orders, products, inventory, and reviews moderation. |
| `admin` | Full access to all endpoints, settings, and user management. |
