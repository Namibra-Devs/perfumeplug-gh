// src/config/seo.ts
export const seoConfig = {
  // Base URL - update this when deploying
  baseUrl: import.meta.env.VITE_SITE_URL || 
           (import.meta.env.PROD ? 'https://perfume-plug.com' : 'http://localhost:5173'),
  
  // Default site information
  siteName: 'PerfumePlug Ghana',
  siteDescription: 'Discover authentic designer perfumes, luxury fragrances, and body sprays at PerfumePlug Ghana. Free shipping on orders over ₵200. Shop men\'s, women\'s & unisex perfumes.',
  
  // Analytics
  analytics: {
    googleAnalyticsId: import.meta.env.VITE_GA_TRACKING_ID || '',
    facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID || '',
  },
  
  // Social media handles
  social: {
    twitter: import.meta.env.VITE_TWITTER_HANDLE || '@perfumepluggh',
    facebook: 'perfumeplugghana',
    instagram: '@perfumepluggh',
  },
  
  // Business information
  business: {
    name: 'PerfumePlug Ghana',
    phone: '+233-50-666-2618',
    email: 'info@perfumeplug.com',
    address: {
      country: 'Ghana',
      region: 'Greater Accra',
      city: 'Accra'
    },
    hours: 'Mo-Fr 08:00-20:00',
    currencies: ['GHS'],
    paymentMethods: ['Cash', 'Credit Card', 'Mobile Money']
  },
  
  // Default keywords for the site
  defaultKeywords: [
    'perfume Ghana',
    'fragrances Ghana',
    'designer perfumes',
    'luxury perfumes',
    'body spray',
    'men perfume',
    'women perfume',
    'unisex fragrance',
    'perfume shop Ghana',
    'authentic perfumes',
    'cologne Ghana',
    'fragrance store',
    'perfume online Ghana',
    'buy perfumes Ghana',
    'perfume delivery Ghana'
  ],
  
  // Image settings
  images: {
    defaultOgImage: '/favicon.png',
    logoUrl: '/favicon.png'
  }
};