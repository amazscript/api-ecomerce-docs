# Enumerations & Status Codes

This page documents the various status codes and types used throughout the API.

---

## Order Status (`OrderStatus`)

| Value | Label | Description |
|-------|-------|-------------|
| `pending` | Pending | Initial state after checkout. |
| `confirmed` | Confirmed | Payment verified, ready for processing. |
| `processing` | Processing | Order is being prepared in the warehouse. |
| `shipped` | Shipped | Handed over to the carrier. |
| `delivered` | Delivered | Received by the customer. |
| `cancelled` | Cancelled | Cancelled by user or admin. |
| `refunded` | Refunded | Fully refunded. |

**Allowed Transitions:**
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `processing`, `cancelled`
- `processing` → `shipped`, `cancelled`
- `shipped` → `delivered`
- `delivered` → `refunded`

---

## Payment Status (`PaymentStatus`)

| Value | Label | Description |
|-------|-------|-------------|
| `pending` | Pending | Payment not yet received. |
| `paid` | Paid | Successfully captured. |
| `failed` | Failed | Payment attempt failed. |
| `refunded` | Refunded | Fully returned to customer. |
| `partially_refunded` | Partially Refunded | Some items refunded. |

---

## Coupon Types (`CouponType`)

| Value | Description |
|-------|-------------|
| `percentage` | Percentage discount on subtotal (e.g., -10%). |
| `fixed` | Fixed amount discount (e.g., -15€). |
| `free_shipping` | Removes shipping costs. |
| `buy_x_get_y` | BOGO or similar promotional offers. |

---

## Shipment Status (`ShipmentStatus`)

| Value | Description |
|-------|-------------|
| `pending` | Shipment record created. |
| `processing` | Being prepared for shipping. |
| `shipped` | Handed to the carrier. |
| `in_transit` | On its way to the destination. |
| `out_for_delivery` | Arrival at local facility, final leg. |
| `delivered` | Successfully delivered. |
| `failed` | Delivery failed. |
| `returned` | Sent back to the sender. |

---

## Review Status (`ReviewStatus`)

| Value | Description |
|-------|-------------|
| `pending` | Awaiting moderation. |
| `approved` | Publicly visible. |
| `rejected` | Hidden from public view. |

---

## Stock Movement Type (`StockLogType`)

| Value | Description |
|-------|-------------|
| `in` | Stock added (purchase, restock). |
| `out` | Stock removed (sale, damage). |
| `adjustment` | Manual admin adjustment. |
| `reserved` | Stock reserved for a pending order. |
| `released` | Reserved stock released (order cancelled). |
| `returned` | Items returned to stock. |

---

## Return Status (`ReturnStatus`)

| Value | Description |
|-------|-------------|
| `requested` | Return request submitted. |
| `approved` | Return approved by admin. |
| `rejected` | Return rejected by admin. |
| `received` | Returned item received at warehouse. |
| `refunded` | Refund processed. |
| `exchanged` | Item exchanged. |

---

## Product Status (`ProductStatus`)

| Value | Description |
|-------|-------------|
| `draft` | Not visible to customers. |
| `published` | Active and visible. |
| `archived` | Removed from listings. |

---

## Blog Post Status (`BlogPostStatus`)

| Value | Description |
|-------|-------------|
| `draft` | Not published. |
| `published` | Visible to readers. |
| `archived` | Hidden from listings. |

---

## Payment Method (`PaymentMethod`)

| Value | Description |
|-------|-------------|
| `stripe` | Stripe card payment. |
| `paypal` | PayPal payment. |
| `wallet` | Internal wallet credit. |
| `cod` | Cash on delivery. |
| `bank_transfer` | Bank transfer. |

---

## Address Type (`AddressType`)

| Value | Description |
|-------|-------------|
| `shipping` | Delivery address. |
| `billing` | Billing address. |
| `both` | Used for both shipping and billing. |

---

## Attribute Type (`AttributeType`)

| Value | Description |
|-------|-------------|
| `select` | Dropdown selection. |
| `color` | Color swatch with hex code. |
| `button` | Button-style selection. |
| `image` | Image-based selection. |

---

## Banner Link Type (`BannerLinkType`)

| Value | Description |
|-------|-------------|
| `url` | External or custom URL. |
| `product` | Links to a product. |
| `category` | Links to a category. |
| `collection` | Links to a collection. |
| `page` | Links to a static page. |

---

## Promotion Applies To (`PromotionAppliesTo`)

| Value | Description |
|-------|-------------|
| `all` | Applies to all products. |
| `categories` | Applies to specific categories. |
| `products` | Applies to specific products. |
| `brands` | Applies to specific brands. |

---

## Shipping Rate Type (`ShippingRateType`)

| Value | Description |
|-------|-------------|
| `flat` | Fixed cost. |
| `weight_based` | Based on cart weight. |
| `price_based` | Based on order total. |
| `free` | Always free. |

---

## User Gender (`UserGender`)

| Value | Description |
|-------|-------------|
| `male` | Male. |
| `female` | Female. |
| `other` | Other / prefer not to say. |
