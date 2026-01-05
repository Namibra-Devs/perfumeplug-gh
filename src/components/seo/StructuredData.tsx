// src/components/seo/StructuredData.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { seoConfig } from '../../config/seo';

interface StructuredDataProps {
  data: Record<string, any>;
}

const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export default StructuredData;

// Predefined structured data for common use cases
export const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": seoConfig.siteName,
  "description": seoConfig.siteDescription,
  "url": seoConfig.baseUrl,
  "logo": `${seoConfig.baseUrl}${seoConfig.images.logoUrl}`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": seoConfig.business.phone,
    "contactType": "Customer Service",
    "availableLanguage": "English",
    "areaServed": "GH"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": seoConfig.business.address.country,
    "addressRegion": seoConfig.business.address.region,
    "addressLocality": seoConfig.business.address.city
  },
  "sameAs": [
    // Add social media URLs when available
    ...(seoConfig.social.facebook ? [`https://facebook.com/${seoConfig.social.facebook}`] : []),
    ...(seoConfig.social.instagram ? [`https://instagram.com/${seoConfig.social.instagram}`] : []),
    ...(seoConfig.social.twitter ? [`https://twitter.com/${seoConfig.social.twitter.replace('@', '')}`] : [])
  ].filter(Boolean)
};

export const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": seoConfig.siteName,
  "description": seoConfig.siteDescription,
  "url": seoConfig.baseUrl,
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": `${seoConfig.baseUrl}/shop?q={search_term_string}`
    },
    "query-input": "required name=search_term_string"
  }
};

export const storeStructuredData = {
  "@context": "https://schema.org",
  "@type": "Store",
  "name": seoConfig.siteName,
  "description": seoConfig.siteDescription,
  "url": seoConfig.baseUrl,
  "telephone": seoConfig.business.phone,
  "email": seoConfig.business.email,
  "address": {
    "@type": "PostalAddress",
    "addressCountry": seoConfig.business.address.country,
    "addressRegion": seoConfig.business.address.region,
    "addressLocality": seoConfig.business.address.city
  },
  "openingHours": seoConfig.business.hours,
  "paymentAccepted": seoConfig.business.paymentMethods,
  "currenciesAccepted": seoConfig.business.currencies
};