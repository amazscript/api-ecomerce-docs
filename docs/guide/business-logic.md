# Commerce Business Logic

LaraCommerce isn't just a set of CRUD endpoints; it's a complete commerce engine designed for scalability and data integrity. This page explains the internal logic of the core modules.

---

## 1. Checkout Lifecycle

The checkout process is handled by the `OrderService` and follows a strict atomic transaction flow to prevent data corruption.

### The Checkout Flow:
1.  **Availability Check**: The system verifies that every item in the cart is still in stock.
2.  **Snapshotting**: Prices, product names, and addresses are "snapshotted" into the `order_items` and `order_addresses` tables. This ensures that if a product's price changes later, the original order record remains accurate for accounting.
3.  **Stock Reservation**: Stock is moved from `on_hand` to `reserved` status immediately.
4.  **Cart Cleanup**: The user's cart is cleared.
5.  **Event Dispatch**: An `OrderPlaced` event is fired, triggering emails and push notifications.

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
Every single stock change (manual adjustment, order placement, return) is recorded in the `stock_logs` table. This creates an immutable audit trail for warehouse managers.

---

## 3. Promotions & Pricing Engine

LaraCommerce implements a multi-layered pricing strategy:

1.  **Base Price**: Set on the product or variant.
2.  **Comparison Price**: Used for "original price" strike-through display.
3.  **Promotions**: Automatic cart-level or product-level discounts based on date ranges and categories.
4.  **Coupons**: Manual codes applied by the user (Percentage, Fixed, Free Shipping, Buy-X-Get-Y).
5.  **Price Tiers**: Bulk discounts based on quantity (e.g., Buy 10+ for 15% off).

**Priority**: Coupons are applied *after* promotion prices are calculated.

---

## 4. Stripe Payment Lifecycle

We use the **Stripe PaymentIntents API**, which is the most secure and modern way to handle payments.

- **`createIntent`**: Creates a PaymentIntent on Stripe and a `Payment` record in our DB with `pending` status.
- **Webhooks**: We listen for `payment_intent.succeeded` to mark the order as `confirmed`.
- **Refunds**: Handled via `RefundService`, which calls the Stripe API and creates a corresponding `Refund` record and `Transaction` log in our system.
- **3D Secure**: If a card requires authentication, the API returns a `requires_action` status, which the mobile/web frontend uses to trigger the Stripe authentication modal.

---

## 5. Refunds & Returns (RMA)

The Return Merchandise Authorization flow:
1.  Customer requests a return for specific items.
2.  Admin reviews and **approves** or **rejects** the request.
3.  Once items are received, admin marks them as **received**, which automatically triggers the `RefundService`.
4.  Refunds can be issued to the **original payment method** (Stripe) or to the internal **Wallet balance**.
