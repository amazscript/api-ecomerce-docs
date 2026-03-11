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
| `label_created` | Carrier label generated. |
| `picked_up` | Collected by the carrier. |
| `in_transit` | On its way to the destination. |
| `out_for_delivery` | Arrival at local facility, final leg. |
| `delivered` | Successfully delivered. |
| `failed_attempt` | Delivery attempted but failed. |
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
| `adjustment` | Manual admin adjustment. |
| `order_placed` | Automatic deduction after checkout. |
| `order_cancelled` | Automatic restock after cancellation. |
| `return` | Items returned to stock. |
| `received` | New shipment received from supplier. |
| `damaged` | Items removed due to damage. |
| `expired` | Items removed due to expiration. |
