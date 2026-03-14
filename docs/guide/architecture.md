# Architecture & Models

LaraCommerce is designed using a modular, domain-driven approach within the Laravel ecosystem. The database consists of over **80 Eloquent Models** and **72 Migrations**, covering every aspect of a modern ecommerce platform.

---

## Core Domains

The application is structured around several key domains, each managed by its own set of models and services.

### 1. Catalog & Products
The core of the store, supporting complex product structures.
- **`Product`**: The base item. Supports soft deletes, scouting (Meilisearch), and tracks view/sold counts.
- **`ProductVariant`**: Handles physical inventory, specific SKUs, pricing, and stock levels. A product can have one or many variants.
- **`Attribute` & `AttributeValue`**: Dynamic properties (e.g., Size = Large, Color = Red).
- **`Category` & `Brand`**: Hierarchical classification and manufacturer grouping.
- **`ProductImage` & `ProductTranslation`**: Multi-media and multi-lingual support.

### 2. Orders & Checkout
Handles the customer purchasing lifecycle.
- **`Cart` & `CartItem`**: Persistent shopping carts for users and guests.
- **`Order` & `OrderItem`**: Immutable records of a completed checkout.
- **`OrderStatusHistory`**: Audit trail of state changes (Pending -> Processing -> Shipped).
- **`Invoice`**: Auto-generated billing documents.
- **`Return` & `Refund`**: Workflows for handling RMA (Return Merchandise Authorization).

### 3. Inventory & Logistics
Warehouse-level tracking and shipping calculations.
- **`Warehouse`**: Physical locations.
- **`Inventory`**: Pivot tracking stock quantity per variant per warehouse.
- **`StockLog`**: Immutable ledger of all stock movements (adjustments, orders, returns) with `StockLogType` enums.
- **`ShippingZone`, `ShippingMethod`, `ShippingRate`**: Geographic delivery calculation engines.
- **`Shipment` & `ShipmentTracking`**: Carrier integrations and delivery tracking events.

### 4. Users & Authentication
- **`User`**: Core authentication model.
- **`UserProfile` & `Address`**: Customer details and multiple saved addresses (shipping/billing).
- **`CustomerGroup`**: Segmentation for bulk discounts or special pricing.
- **`PaymentMethod`**: Tokenized cards (via Stripe) saved for future use.

### 5. Marketing & Promotions
A comprehensive suite for driving sales.
- **`Coupon`**: Configurable discount codes (`CouponType`: Fixed, Percentage, Free Shipping, BOGO).
- **`Promotion`**: Automatic cart-level discounts based on rules.
- **`FlashSale` & `FlashSaleItem`**: Time-limited urgency campaigns.
- **`Bundle` & `BundleItem`**: Grouped products sold at a combined discount.
- **`PriceTier`**: Volume-based discounts (e.g., buy 10+, get 15% off).

### 6. Loyalty & Affiliates
Customer retention mechanics.
- **`LoyaltyPoint` & `LoyaltyTransaction`**: Earn/redeem points system.
- **`Affiliate` & `AffiliateConversion`**: Referral tracking and commission management.
- **`GiftCard` & `GiftCardUsage`**: Digital balance cards.
- **`Wallet` & `WalletTransaction`**: Internal store credit system.

---

## Design Patterns

### Services Layer
Controllers are kept extremely thin. All business logic (e.g., the complex checkout process, stock deduction, payment intent creation) is delegated to dedicated classes in `app/Services/` (e.g., `OrderService`, `PaymentService`, `ProductService`).

### Type Safety (Enums)
LaraCommerce heavily utilizes PHP 8.1+ Enums in `app/Enums/` to guarantee type safety for statuses across the database and application logic. Examples include `OrderStatus`, `PaymentStatus`, and `ShipmentStatus`.

### Traits
Reusable behaviors are abstracted into traits:
- `HasSlug`: Auto-generates unique, SEO-friendly URLs.
- `Filterable`: Standardizes dynamic API query filtering (e.g., `?category=1&min_price=100`).
- `ValidatesOnSave`: Intercepts Eloquent `saving` events to ensure model integrity.

### API Resources
All API responses use Laravel API Resources (`app/Http/Resources/`) to strictly control JSON output, hide sensitive fields (like `cost_price` or internal IDs), and format dates/currencies consistently.
