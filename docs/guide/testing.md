# Testing & Quality Assurance

LaraCommerce ships with an incredibly robust test suite designed to guarantee application stability. The project includes **over 1,590 automated tests** and **3,500+ assertions**, covering both API endpoints and core business logic.

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
│   │   ├── Admin/      # Admin endpoints (e.g., AdminProductTest)
│   │   ├── Auth/       # Login, Register, Password Reset
│   │   ├── Cart/       # Cart logic, coupons
│   │   ├── Catalogue/  # Browsing, Search, filtering
│   │   ├── Content/    # Blog, Pages
│   │   └── Marketing/  # Affiliates, Loyalty
│   └── Webhook/        # Stripe webhook simulation
├── Unit/
│   ├── Services/       # Business logic (OrderServiceTest, etc.)
│   └── Models/         # Custom model behaviors
└── TestCase.php        # Base test configuration
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

### Unit Tests
Unit tests focus on isolated business logic within `app/Services/`.
- **OrderService**: Testing complex checkout logic, stock deduction, and total calculations.
- **PaymentService**: Testing interaction with the Stripe SDK (often mocked).

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
- **MinIO/S3**: The `Storage::fake('s3')` facade is used to simulate image uploads without hitting the actual bucket.
- **Mail**: `Mail::fake()` is used to assert that emails (like verification links or invoices) were queued or sent.
- **Notifications**: `Notification::fake()` verifies that push notifications or webhooks were dispatched.
