import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'LaraCommerce API',
  description: 'Full-featured Laravel 12 Ecommerce REST API — Documentation',
  base: '/',

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'theme-color', content: '#3b82f6' }],
  ],

  themeConfig: {
    logo: '🛒',
    siteTitle: 'LaraCommerce API',

    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'API Reference', link: '/api/authentication' },
      { text: 'Deployment', link: '/deployment/installation' },
      {
        text: 'v1.0.0',
        items: [
          { text: 'Changelog', link: '/guide/changelog' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: '🚀 Getting Started',
          items: [
            { text: 'Introduction', link: '/guide/introduction' },
            { text: "What's Included", link: '/guide/whats-included' },
            { text: 'Architecture & Models', link: '/guide/architecture' },
            { text: 'Commerce Business Logic', link: '/guide/business-logic' },
            { text: 'Controllers & Models Map', link: '/guide/controllers-models' },
            { text: 'Testing Strategy', link: '/guide/testing' },
            { text: 'Changelog', link: '/guide/changelog' },
          ]
        }
      ],

      '/deployment/': [
        {
          text: '⚙️ Setup',
          items: [
            { text: 'Installation', link: '/deployment/installation' },
            { text: 'Docker', link: '/deployment/docker' },
            { text: 'Configuration (.env)', link: '/deployment/configuration' },
            { text: 'App-Specific Settings', link: '/guide/app-settings' },
            { text: 'MinIO Storage', link: '/deployment/minio' },
            { text: 'Stripe Integration', link: '/deployment/stripe' },
            { text: 'Production Deploy', link: '/deployment/production' },
          ]
        }
      ],

      '/api/': [
        {
          text: '📋 Reference',
          items: [
            { text: 'Route Reference (300 routes)', link: '/api/routes' },
            { text: 'Enums & Status Codes', link: '/api/enums' },
          ]
        },
        {
          text: '🔐 Auth & Security',
          items: [
            { text: 'Authentication', link: '/api/authentication' },
            { text: 'Security & Validation', link: '/api/security' },
          ]
        },
        {
          text: '🛍️ Catalog',
          items: [
            { text: 'Products & Catalog', link: '/api/products' },
          ]
        },
        {
          text: '🛒 Shopping',
          items: [
            { text: 'Cart & Checkout', link: '/api/cart' },
            { text: 'Orders', link: '/api/orders' },
            { text: 'Payments', link: '/api/payments' },
            { text: 'Shipping', link: '/api/shipping' },
          ]
        },
        {
          text: '👤 User',
          items: [
            { text: 'Profile & Addresses', link: '/api/user' },
          ]
        },
        {
          text: '📣 Marketing',
          items: [
            { text: 'Promotions & Coupons', link: '/api/marketing' },
            { text: 'Loyalty & Affiliates', link: '/api/loyalty' },
            { text: 'Search', link: '/api/search' },
          ]
        },
        {
          text: '📝 Content',
          items: [
            { text: 'Blog & Content', link: '/api/content' },
            { text: 'Notifications', link: '/api/notifications' },
          ]
        },
        {
          text: '🔧 Admin API',
          items: [
            { text: 'Admin Endpoints', link: '/api/admin' },
          ]
        },
      ],

    },

    footer: {
      message: 'Licensed for single or extended use.',
      copyright: 'Copyright © 2026 LaraCommerce API'
    },

    search: {
      provider: 'local'
    }
  }
})
