# Testing & Quality Assurance

LaraCommerce ships with an incredibly robust test suite designed to guarantee application stability. The project achieves **100% code coverage** across all classes — Controllers, Services, Models, Middleware, Requests, Resources, Observers, Policies, Notifications, Enums, and Traits.

---

## Test Infrastructure

We use **PHPUnit** natively integrated with Laravel's testing framework.

### Environment
The test environment (`APP_ENV=testing`) is optimized for speed:
- **Database**: Uses an **in-memory SQLite** database (`:memory:`). This means tests run extremely fast without writing to disk or requiring a dedicated test MySQL server.
- **Cache & Session**: Uses the `array` driver (wiped clean after every test).
- **Queue**: Uses the `sync` connection to execute jobs immediately during tests.
- **Search**: Uses the `collection` driver for Laravel Scout, mocking Meilisearch.

### Directory Structure

```text
tests/
├── Feature/
│   ├── Api/
│   │   ├── Admin/         # Admin endpoints (Products, Orders, Refunds, Shipments...)
│   │   ├── Auth/          # Login, Register, Password Reset, Social Auth, Tokens
│   │   ├── Cart/          # Cart logic, coupons
│   │   ├── Catalogue/     # Browsing, Search, Collections, Currencies
│   │   ├── Content/       # Blog, Pages
│   │   ├── Marketing/     # Affiliates, Loyalty, Gift Cards, Newsletters
│   │   ├── Orders/        # Checkout, Cancel, Returns
│   │   ├── Payments/      # Payment intents, webhooks
│   │   └── User/          # Profile, Addresses, Wallet, Payment Methods
│   ├── Policies/          # Authorization policy tests
│   └── Webhooks/          # Stripe webhook simulation
├── Unit/
│   ├── Coverage/          # Remaining coverage gap tests
│   ├── Enums/             # Enum value and label tests
│   ├── Events/            # Event dispatch tests
│   ├── Exceptions/        # Exception formatting tests
│   ├── Jobs/              # Queue job tests
│   ├── Middleware/         # Middleware behavior tests
│   ├── Models/            # Model relations, accessors, scopes
│   ├── Notifications/     # Notification content and channel tests
│   ├── Observers/         # Observer side-effect tests
│   ├── Requests/          # Form request validation rules
│   ├── Resources/         # API resource transformation tests
│   ├── Services/          # Business logic (Order, Payment, Refund, Wallet...)
│   └── Traits/            # Trait behavior tests
└── TestCase.php           # Base test configuration
```

---

## Code Coverage

LaraCommerce achieves **100% line coverage** on the entire `app/` directory.

| Layer | Coverage |
|-------|----------|
| Controllers (55+) | 100% |
| Services (25+) | 100% |
| Models (50+) | 100% |
| Middleware (6) | 100% |
| Form Requests (60+) | 100% |
| API Resources (60+) | 100% |
| Observers (8) | 100% |
| Policies (18) | 100% |
| Notifications (18) | 100% |
| Enums (16) | 100% |
| Traits (8) | 100% |
| Jobs (8) | 100% |
| Events (5) | 100% |
| Exceptions (6) | 100% |

To generate a coverage report:
```bash
php artisan test --coverage
```

For an HTML report:
```bash
php -d xdebug.mode=coverage vendor/bin/phpunit --coverage-html=coverage-report
```

---

## Test Categories

### Feature Tests (API Integration)
The vast majority of the suite consists of Feature tests. These tests boot the Laravel application, make an HTTP request to an API endpoint, and assert the response status, JSON structure, and database changes.

**What we test:**
- **Status Codes**: Ensuring `200`, `201`, `403`, `404`, and `422` are returned correctly.
- **Authentication**: Verifying that protected routes reject guests and unauthorized roles.
- **Validation**: Testing that missing or invalid payload data returns the exact expected validation errors.
- **Cascading Deletes**: We have a dedicated `DeletionCascadeTest` to ensure that deleting a user or a product cleanly removes all associated data (addresses, cart items, images) without leaving orphans in the database.
- **Webhook Handlers**: Full coverage of all 6 Stripe webhook event types (`payment_intent.succeeded`, `payment_failed`, `requires_action`, `charge.refunded`, `charge.dispute.created`, `refund.updated`) with real DB data.
- **Policy Tests**: Every authorization policy tested for owner, non-owner, and admin access patterns.

### Unit Tests
Unit tests focus on isolated business logic within `app/Services/`.
- **OrderService**: Checkout flow, stock deduction, tax calculation, status transitions, cancellation.
- **PaymentService**: Stripe intent creation with/without saved cards, payment confirmation (success & failure branches), all 6 webhook handlers with real DB state, deduplication, idempotent shipment creation.
- **RefundService**: Refund to original payment (Stripe & non-Stripe), refund to wallet, amount validation, webhook refund processing.
- **WalletService**: Credit/debit with pessimistic locking, balance checks, insufficient balance rejection.
- **InventoryService**: Reserve, release, deduct with negative stock prevention.
- **CouponService**: Percentage, fixed, free shipping, buy-X-get-Y with real cart item matching.

---

## Running the Tests

To run the test suite locally, use the Artisan command or PHPUnit directly.

### Run all tests
```bash
php artisan test
```

### Run tests in parallel (Fastest)
If you have a multi-core machine, you can run tests in parallel to cut execution time down to seconds:
```bash
php artisan test --parallel
```

### Run a specific test class
```bash
php artisan test tests/Feature/Api/Cart/CartTest.php
```

### Run tests with a specific keyword
```bash
php artisan test --filter=AdminProductTest
```

---

## Mocking External Services

To prevent tests from making actual external network requests (which would be slow and brittle), LaraCommerce heavily utilizes mocking:
- **Stripe**: The Stripe API client is mocked during checkout tests to simulate successful and failed charges.
- **Webhook Events**: Stripe webhook handlers are tested by calling `processWebhookEvent()` directly with synthetic event objects, bypassing `Stripe\Webhook::constructEvent()` signature verification. This allows full coverage of deduplication, match dispatching, and all 6 handler branches.
- **MinIO/S3**: The `Storage::fake('s3')` facade is used to simulate image uploads without hitting the actual bucket.
- **Mail**: `Mail::fake()` is used to assert that emails (like verification links or invoices) were queued or sent.
- **Notifications**: `Notification::fake()` verifies that push notifications or webhooks were dispatched.
