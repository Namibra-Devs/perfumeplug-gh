// src/components/seo/SEOHead.tsx
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { SEOData } from '../../utils/seo';
import { seoConfig } from '../../config/seo';

interface SEOHeadProps {
  seo: SEOData;
  canonical?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({ seo, canonical }) => {
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : seoConfig.baseUrl);
  const siteName = seoConfig.siteName;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords.join(', ')} />}
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content={seo.type || 'website'} />
      <meta property="og:site_name" content={siteName} />
      {currentUrl && <meta property="og:url" content={currentUrl} />}
      {seo.image && <meta property="og:image" content={seo.image} />}
      {seo.image && <meta property="og:image:alt" content={seo.title} />}
      <meta property="og:locale" content="en_GH" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image && <meta name="twitter:image" content={seo.image} />}
      {seoConfig.social.twitter && <meta name="twitter:site" content={seoConfig.social.twitter} />}
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content={siteName} />
      <meta name="publisher" content={siteName} />
      <meta name="robots" content="index, follow, max-image-preview:large" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="GH" />
      <meta name="geo.country" content="Ghana" />
      <meta name="geo.placename" content="Accra, Ghana" />
      
      {/* Product-specific Schema.org structured data */}
      {seo.type === 'product' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": seo.title.replace(` | ${siteName}`, ''),
            "description": seo.description,
            "image": seo.image,
            "brand": {
              "@type": "Brand",
              "name": seo.brand || siteName
            },
            "category": seo.category,
            "offers": {
              "@type": "Offer",
              "price": seo.price,
              "priceCurrency": seo.currency || "GHS",
              "availability": seo.availability === 'in stock' 
                ? "https://schema.org/InStock" 
                : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": siteName,
                "url": seoConfig.baseUrl
              },
              "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.5",
              "reviewCount": "10"
            }
          })}
        </script>
      )}
      
      {/* Website Schema.org structured data */}
      {seo.type === 'website' && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": siteName,
            "description": seo.description,
            "url": currentUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${seoConfig.baseUrl}/shop?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      )}
      
      {/* Breadcrumb Schema (for category and product pages) */}
      {(seo.type === 'product' || seo.category) && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": seoConfig.baseUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": `${seoConfig.baseUrl}/shop`
              },
              ...(seo.category ? [{
                "@type": "ListItem",
                "position": 3,
                "name": seo.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                "item": `${seoConfig.baseUrl}/shop?category=${seo.category}`
              }] : []),
              ...(seo.type === 'product' ? [{
                "@type": "ListItem",
                "position": seo.category ? 4 : 3,
                "name": seo.title.replace(` | ${siteName}`, ''),
                "item": currentUrl
              }] : [])
            ]
          })}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;