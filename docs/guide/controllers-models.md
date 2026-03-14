# Controllers & Models Reference

LaraCommerce is a massive API with over **80 Eloquent Models** and **70 Controllers**. This page provides a complete map of the project structure, grouped by domain.

---

## 🔐 Authentication & Users
| Domain | Models | Controllers |
|--------|--------|-------------|
| **Core Auth** | `User`, `SocialAccount`, `PushToken` | `RegisterController`, `LoginController`, `TokenController`, `ForgotPasswordController`, `ResetPasswordController`, `VerifyEmailController`, `SocialAuthController` |
| **Profile** | `UserProfile`, `Address` | `User/ProfileController`, `User/AddressController` |
| **Customer Mgmt** | `CustomerGroup` | `Admin/UserController`, `Admin/CustomerGroupController` |

---

## 🛍️ Catalog & Products
| Domain | Models | Controllers |
|--------|--------|-------------|
| **Products** | `Product`, `ProductVariant`, `ProductImage`, `ProductTranslation` | `ProductController`, `Admin/ProductController`, `Admin/ProductVariantController`, `Admin/ProductTranslationController` |
| **Taxonomy** | `Category`, `Brand`, `Tag`, `Collection` | `CategoryController`, `BrandController`, `Admin/CategoryController`, `Admin/BrandController`, `Admin/TagController`, `Admin/CollectionController` |
| **Attributes** | `Attribute`, `AttributeValue` | `Admin/AttributeController` |
| **Interactions** | `Review`, `ReviewImage`, `ReviewVote`, `Question`, `QuestionAnswer`, `Wishlist`, `WishlistItem`, `ProductView` | `ReviewController`, `QuestionController`, `WishlistController`, `ProductViewController`, `Admin/ReviewController` |

---

## 🛒 Shopping & Orders
| Domain | Models | Controllers |
|--------|--------|-------------|
| **Cart** | `Cart`, `CartItem` | `CartController` |
| **Orders** | `Order`, `OrderItem`, `OrderAddress`, `OrderStatusHistory` | `OrderController`, `Admin/OrderController` |
| **Returns** | `Return`, `ReturnItem`, `Refund` | `ReturnController`, `Admin/ReturnController`, `Admin/RefundController` |
| **Fulfillment** | `Shipment`, `ShipmentTracking` | `Admin/ShipmentController` |

---

## 📦 Inventory & Logistics
| Domain | Models | Controllers |
|--------|--------|-------------|
| **Stock** | `Warehouse`, `Inventory`, `StockLog`, `StockAlert` | `Admin/WarehouseController`, `Admin/StockController` |
| **Shipping** | `ShippingZone`, `ShippingMethod`, `ShippingRate`, `Country`, `State` | `ShippingController`, `Admin/ShippingZoneController`, `Admin/ShippingMethodController` |

---

## 📣 Marketing & Growth
| Domain | Models | Controllers |
|--------|--------|-------------|
| **Discounts** | `Coupon`, `CouponUsage`, `Promotion`, `PriceTier` | `Admin/CouponController`, `Admin/PromotionController`, `Admin/PriceTierController` |
| **Campaigns** | `Banner`, `FlashSale`, `FlashSaleItem`, `Bundle`, `BundleItem` | `BannerController`, `FlashSaleController`, `BundleController`, `Admin/BannerController`, `Admin/FlashSaleController`, `Admin/BundleController` |
| **Retention** | `LoyaltyPoint`, `LoyaltyTransaction`, `GiftCard`, `GiftCardUsage`, `AbandonedCartEmail` | `GiftCardController`, `Admin/LoyaltyController`, `Admin/GiftCardController` |
| **Affiliates** | `Affiliate`, `AffiliateConversion` | `Admin/AffiliateController` |

---

## 📝 Content & System
| Domain | Models | Controllers |
|--------|--------|-------------|
| **CMS** | `Page`, `Faq`, `BlogPost`, `BlogCategory`, `Contact` | `PageController`, `FaqController`, `BlogController`, `ContactController`, `Admin/PageController`, `Admin/FaqController`, `Admin/BlogPostController`, `Admin/BlogCategoryController`, `Admin/ContactController` |
| **Config** | `Setting`, `Currency`, `Language`, `TaxCategory`, `TaxRate` | `SettingController`, `CurrencyController`, `Admin/SettingController`, `Admin/CurrencyController`, `Admin/LanguageController`, `Admin/TaxCategoryController`, `Admin/TaxRateController` |
| **DevOps** | `ActivityLog`, `ApiLog`, `SearchLog`, `WebhookEndpoint`, `WebhookDelivery` | `Admin/LogController`, `Admin/WebhookController`, `Admin/AnalyticsController`, `Admin/DashboardController`, `Admin/MediaController` |

---

## 🛠️ Internal Services (`app/Services`)

The "Brain" of the application. These classes handle the actual complex logic.

- **`AuthService`**: Registration logic and token issuance.
- **`OrderService`**: Atomic checkout, transaction management, and order number generation.
- **`InventoryService`**: Thread-safe stock reservation and deduction.
- **`PaymentService`**: Stripe PaymentIntent lifecycle and saved cards.
- **`CartService`**: Total calculations, coupon application, and guest-to-user merging.
- **`ProductService`**: Complex product creation with variants, attributes, and image processing.
- **`ShippingCalculatorService`**: Multi-zone shipping cost calculation.
- **`CouponService`**: Rules-based discount validation.
- **`MediaService`**: S3/MinIO upload, deletion, and resizing.
- **`SearchService`**: Meilisearch index management and advanced filtering logic.
- **`WebhookService`**: Outgoing webhook dispatching with retries.
