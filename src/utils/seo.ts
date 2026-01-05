// src/utils/seo.ts
import { seoConfig } from '../config/seo';

export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: 'in stock' | 'out of stock';
  brand?: string;
  category?: string;
}

export const defaultSEO: SEOData = {
  title: `${seoConfig.siteName} - Premium Fragrances & Perfumes Online`,
  description: seoConfig.siteDescription,
  keywords: seoConfig.defaultKeywords,
  image: `${seoConfig.baseUrl}${seoConfig.images.defaultOgImage}`,
  type: 'website'
};

export const generateSEO = (data: Partial<SEOData>): SEOData => {
  return {
    ...defaultSEO,
    ...data,
    title: data.title ? `${data.title} | ${seoConfig.siteName}` : defaultSEO.title,
    keywords: data.keywords ? [...(defaultSEO.keywords || []), ...data.keywords] : defaultSEO.keywords,
    image: data.image ? (data.image.startsWith('http') ? data.image : `${seoConfig.baseUrl}${data.image}`) : defaultSEO.image
  };
};

export const generateProductSEO = (product: {
  name: string;
  description?: string;
  category?: string;
  sellingPrice?: number;
  images?: Array<{ url: string }>;
  ecommerceData?: {
    seoTitle?: string;
    seoDescription?: string;
    tags?: string[];
  };
}): SEOData => {
  const title = product.ecommerceData?.seoTitle || product.name;
  const description = product.ecommerceData?.seoDescription || 
    product.description || 
    `Buy ${product.name} at ${seoConfig.siteName}. Authentic ${product.category || 'perfume'} with fast delivery and best prices in Ghana.`;
  
  const keywords = [
    product.name.toLowerCase(),
    ...(product.category ? [product.category.toLowerCase()] : []),
    ...(product.ecommerceData?.tags || []),
    'buy online Ghana',
    'authentic perfume',
    'fast delivery Ghana',
    'perfume price Ghana'
  ];

  return generateSEO({
    title,
    description,
    keywords,
    image: product.images?.[0]?.url,
    type: 'product',
    price: product.sellingPrice,
    currency: 'GHS',
    availability: 'in stock',
    category: product.category
  });
};

export const generateCategorySEO = (category: string, productCount?: number): SEOData => {
  const formattedCategory = category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return generateSEO({
    title: `${formattedCategory} Perfumes & Fragrances in Ghana`,
    description: `Shop ${formattedCategory.toLowerCase()} perfumes and fragrances at ${seoConfig.siteName}. ${productCount ? `${productCount} products available.` : ''} Authentic designer fragrances with free shipping over ₵200.`,
    keywords: [
      `${category} perfume Ghana`,
      `${category} fragrance Ghana`,
      `${formattedCategory.toLowerCase()} cologne Ghana`,
      `buy ${category} perfume Ghana`,
      `${category} perfume price Ghana`,
      `authentic ${category} fragrance`
    ],
    type: 'website'
  });
};

export const generateSearchSEO = (query: string, resultCount?: number): SEOData => {
  return generateSEO({
    title: `Search Results for "${query}" - Perfumes & Fragrances`,
    description: `Find ${query} perfumes and fragrances at ${seoConfig.siteName}. ${resultCount ? `${resultCount} products found.` : ''} Shop authentic designer perfumes with fast delivery in Ghana.`,
    keywords: [
      query.toLowerCase(),
      `${query} perfume Ghana`,
      `buy ${query} Ghana`,
      'search perfumes Ghana',
      `${query} fragrance price`
    ],
    type: 'website'
  });
};