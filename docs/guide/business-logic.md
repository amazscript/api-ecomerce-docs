# Commerce Business Logic

LaraCommerce isn't just a set of CRUD endpoints; it's a complete commerce engine designed for scalability and data integrity. This page explains the internal logic of the core modules.

---

## 1. Checkout Lifecycle

The checkout process is handled by the `OrderService` and follows a strict atomic transaction flow to prevent data corruption.

### The Checkout Flow:
1.  **Availability Check**: The system verifies that every item in the cart is still in stock.
2.  **Tax Calculation**: Taxes are computed via `TaxService::calculate()` using the delivery address country/state and the `standard` tax category.
3.  **Snapshotting**: Prices, product names, and addresses are "snapshotted" into the `order_items` and `order_addresses` tables. This ensures that if a product's price changes later, the original order record remains accurate for accounting.
4.  **Stock Deduction**: Stock for each variant with `track_inventory` enabled is **deducted** from inventory via `InventoryService::deduct()`. If stock is insufficient, the entire transaction is rolled back with an `InsufficientStockException`.
5.  **Coupon Usage**: If a coupon was applied, usage is recorded and the coupon's `usage_count` is incremented.
6.  **Cart Cleanup**: The user's cart is cleared.
7.  **Event Dispatch**: An `OrderPlaced` event is fired, triggering emails and push notifications.

::: info Atomicity
All these steps happen within a single Database Transaction. If any step fails (e.g., stock runs out during the process), the entire operation is rolled back.
:::

---

## 2. Multi-Warehouse Inventory

Stock is tracked at the **Product Variant** level across multiple **Warehouses**.

- **`on_hand`**: Physical stock present in the warehouse.
- **`reserved`**: Items currently in a customer's checkout process but not yet paid.
- **`available`**: `on_hand - reserved`. This is what the API returns to customers.

### Stock Movement Logs
Every single stock change (manual adjustment, order placement, return) is recorded in the `stock_logs` table with before/after quantities. This creates an immutable audit trail for warehouse managers.

### Inventory Guards
- **Deduction protection**: `InventoryService::deduct()` throws `InsufficientStockException` if the requested quantity exceeds `quantity_on_hand`, preventing negative stock.
- **Reservation flow**: `reserve()` moves stock from available to reserved, `release()` reverses it. Both operations are atomic.
- **Audit trail**: Every stock movement is logged in `stock_logs` with `quantity_before` and `quantity_after`.

---

## 3. Promotions & Pricing Engine

LaraCommerce implements a multi-layered pricing strategy:

1.  **Base Price**: Set on the product or variant.
2.  **Comparison Price**: Used for "original price" strike-through display.
3.  **Promotions**: Automatic cart-level or product-level discounts based on date ranges and categories.
4.  **Coupons**: Manual codes applied by the user (Percentage, Fixed, Free Shipping, Buy-X-Get-Y).
5.  **Price Tiers**: Bulk discounts based on quantity (e.g., Buy 10+ for 15% off).

**Priority**: Coupons are applied *after* promotion prices are calculated.

### Buy-X-Get-Y Coupons
The `buy_x_get_y` coupon type implements real cart-aware logic:
- Identifies the cheapest eligible items in the cart as the "free" items
- Applies the coupon's percentage value as discount on those free items
- Falls back to a simple percentage discount if coupon metadata (`buy_quantity`, `get_quantity`) is not configured

---

## 4. Stripe Payment Lifecycle

We use the **Stripe PaymentIntents API**, which is the most secure and modern way to handle payments.

- **`createIntent`**: Creates a PaymentIntent on Stripe and a `Payment` record in our DB with `pending` status. Supports pre-selecting a saved card via `payment_method_id`.
- **Idempotency**: Each PaymentIntent creation uses a unique idempotency key to prevent duplicate charges on retry.
- **Webhooks**: We listen for 6 event types: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.requires_action`, `charge.refunded`, `charge.dispute.created`, and `refund.updated`.
- **Refunds**: Handled via `RefundService`, which calls the Stripe API and creates a corresponding `Refund` record and `Transaction` log in our system.
- **Refund Validation**: Before processing, the system validates that the refund amount is positive and does not exceed the original payment amount.
- **3D Secure**: If a card requires authentication, the API returns a `requires_action` status, which the mobile/web frontend uses to trigger the Stripe authentication modal. A push notification is sent to the customer.
- **Disputes**: Stripe `charge.dispute.created` events are captured and logged as `dispute` transactions for admin review.
- **Deduplication**: Webhook events are cached for 48 hours to prevent double-processing.

---

## 5. Refunds & Returns (RMA)

The Return Merchandise Authorization flow:
1.  Customer requests a return for specific items.
2.  Admin reviews and **approves** or **rejects** the request.
3.  Once items are received, admin marks them as **received**, which automatically triggers the `RefundService`.
4.  Refunds can be issued to the **original payment method** (Stripe) or to the internal **Wallet balance**.

Additionally, when a **shipment** is marked as `returned` by the carrier, the `ShipmentController` automatically updates the parent order's status to `returned`.

### Refund Safeguards
- Refund amount must be greater than zero
- Refund amount cannot exceed the original payment amount (`REFUND_EXCEEDS_PAYMENT` error)
- Wallet refunds credit the user's balance atomically with a pessimistic lock

---

## 6. Wallet System

Each user has an internal wallet created automatically on registration by the `UserObserver`.

- **Credits & Debits** use pessimistic locking (`SELECT ... FOR UPDATE`) to prevent race conditions on concurrent operations.
- **Balance tracking**: Every transaction records `balance_before` and `balance_after` for a complete audit trail.
- **Debit guard**: Debits are rejected with `INSUFFICIENT_WALLET_BALANCE` if the balance is too low.
- **Wallet deactivation**: Inactive wallets cannot be debited.
