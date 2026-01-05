// src/services/productService.ts
import { apiFetch } from '../lib/api';
import { parseApiError } from '../lib/apiError';
import type { Product, Pagination } from '../types/product';

export interface FetchProductsOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Frontend fallback sorting function
function sortProductsOnFrontend(products: Product[], sortBy: string): Product[] {
  const sortedProducts = [...products];
  
  switch (sortBy) {
    case 'newest':
      return sortedProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA; // Newest first
      });
      
    case 'oldest':
      return sortedProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateA - dateB; // Oldest first
      });
      
    case 'price-low-high':
      return sortedProducts.sort((a, b) => a.sellingPrice - b.sellingPrice);
      
    case 'price-high-low':
      return sortedProducts.sort((a, b) => b.sellingPrice - a.sellingPrice);
      
    case 'name':
      return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      
    case 'name-desc':
      return sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      
    default:
      return sortedProducts;
  }
}

export async function fetchProducts(opts: FetchProductsOptions = {}) {
  try {
    const params = new URLSearchParams();
    if (opts.page) params.set('page', String(opts.page));
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.search) params.set('search', opts.search);
    if (opts.category) params.set('category', opts.category);
    if (opts.minPrice !== undefined) params.set('minPrice', String(opts.minPrice));
    if (opts.maxPrice !== undefined) params.set('maxPrice', String(opts.maxPrice));
    
    // Map frontend sort values to backend expected values
    if (opts.sortBy) {
      const sortMapping: Record<string, { field: string; order: string }> = {
        'newest': { field: 'createdAt', order: 'desc' },
        'oldest': { field: 'createdAt', order: 'asc' },
        'price-low-high': { field: 'sellingPrice', order: 'asc' },
        'price-high-low': { field: 'sellingPrice', order: 'desc' },
        'name': { field: 'name', order: 'asc' },
        'name-desc': { field: 'name', order: 'desc' }
      };
      
      const mapping = sortMapping[opts.sortBy];
      if (mapping) {
        params.set('sortBy', mapping.field);
        params.set('sortOrder', mapping.order);
      }
    }
    
    if (opts.sortOrder && !opts.sortBy) {
      params.set('sortOrder', opts.sortOrder);
    }

    const path = `/api/ecommerce/products${params.toString() ? `?${params.toString()}` : ''}`;
    
    // API returns different structure than expected
    const apiResponse = await apiFetch<{
      products: Array<{
        _id: string;
        name: string;
        description?: string;
        category?: string;
        sellingPrice: number;
        createdAt?: string;
        updatedAt?: string;
        ecommerceData?: {
          images?: Array<{ url: string; altText?: string; isPrimary?: boolean }>;
          seoTitle?: string;
          seoDescription?: string;
          tags?: string[];
          displayOrder?: number;
        };
      }>;
      pagination?: {
        currentPage: number;
        totalPages: number;
        totalCount: number;
        limit: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    }>(path);

    // Transform API response to match frontend expectations
    let transformedProducts: Product[] = apiResponse.products.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      sellingPrice: product.sellingPrice,
      images: product.ecommerceData?.images?.map(img => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary
      })) || [],
      ecommerceData: product.ecommerceData ? {
        enabled: true,
        images: product.ecommerceData.images?.map(img => ({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary ?? false
        })) || [],
        seoTitle: product.ecommerceData.seoTitle,
        seoDescription: product.ecommerceData.seoDescription,
        tags: product.ecommerceData.tags || [],
        displayOrder: product.ecommerceData.displayOrder
      } : undefined,
      seo: {
        title: product.ecommerceData?.seoTitle || '',
        description: product.ecommerceData?.seoDescription || '',
        tags: product.ecommerceData?.tags || []
      },
      ecommerce: {
        visible: true,
        displayOrder: product.ecommerceData?.displayOrder || 0
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    // Frontend fallback sorting if backend doesn't handle it properly
    if (opts.sortBy && transformedProducts.length > 0) {
      transformedProducts = sortProductsOnFrontend(transformedProducts, opts.sortBy);
    }

    const transformedPagination: Pagination | undefined = apiResponse.pagination ? {
      currentPage: apiResponse.pagination.currentPage,
      limit: apiResponse.pagination.limit,
      totalPages: apiResponse.pagination.totalPages,
      totalProducts: apiResponse.pagination.totalCount, // Map totalCount to totalProducts
      hasNextPage: apiResponse.pagination.hasNextPage,
      hasPrevPage: apiResponse.pagination.hasPrevPage
    } : undefined;

    return {
      products: transformedProducts,
      pagination: transformedPagination
    };
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function getProduct(productId: string) {
  try {
    const apiResponse = await apiFetch<{
      product: {
        _id: string;
        name: string;
        description?: string;
        category?: string;
        sellingPrice: number;
        createdAt?: string;
        updatedAt?: string;
        ecommerceData?: {
          images?: Array<{ url: string; altText?: string; isPrimary?: boolean }>;
          seoTitle?: string;
          seoDescription?: string;
          tags?: string[];
          displayOrder?: number;
        };
      };
    }>(`/api/ecommerce/products/${productId}`);

    // Transform single product response
    const transformedProduct: Product = {
      _id: apiResponse.product._id,
      name: apiResponse.product.name,
      description: apiResponse.product.description || '',
      category: apiResponse.product.category || '',
      sellingPrice: apiResponse.product.sellingPrice,
      images: apiResponse.product.ecommerceData?.images?.map(img => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary
      })) || [],
      ecommerceData: apiResponse.product.ecommerceData ? {
        enabled: true,
        images: apiResponse.product.ecommerceData.images?.map(img => ({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary ?? false
        })) || [],
        seoTitle: apiResponse.product.ecommerceData.seoTitle,
        seoDescription: apiResponse.product.ecommerceData.seoDescription,
        tags: apiResponse.product.ecommerceData.tags || [],
        displayOrder: apiResponse.product.ecommerceData.displayOrder
      } : undefined,
      seo: {
        title: apiResponse.product.ecommerceData?.seoTitle || '',
        description: apiResponse.product.ecommerceData?.seoDescription || '',
        tags: apiResponse.product.ecommerceData?.tags || []
      },
      ecommerce: {
        visible: true,
        displayOrder: apiResponse.product.ecommerceData?.displayOrder || 0
      },
      createdAt: apiResponse.product.createdAt,
      updatedAt: apiResponse.product.updatedAt
    };

    return { product: transformedProduct };
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function searchProducts(query: string, limit = 50) {
  try {
    const params = new URLSearchParams({ search: query, limit: String(limit) });
    
    // Use the same structure as fetchProducts since it's the same endpoint
    const apiResponse = await apiFetch<{
      products: Array<{
        _id: string;
        name: string;
        description?: string;
        category?: string;
        sellingPrice: number;
        createdAt?: string;
        updatedAt?: string;
        ecommerceData?: {
          images?: Array<{ url: string; altText?: string; isPrimary?: boolean }>;
          seoTitle?: string;
          seoDescription?: string;
          tags?: string[];
          displayOrder?: number;
        };
      }>;
    }>(`/api/ecommerce/products?${params.toString()}`);

    // Transform API response to match frontend expectations
    const transformedProducts: Product[] = apiResponse.products.map(product => ({
      _id: product._id,
      name: product.name,
      description: product.description || '',
      category: product.category || '',
      sellingPrice: product.sellingPrice,
      images: product.ecommerceData?.images?.map(img => ({
        url: img.url,
        altText: img.altText,
        isPrimary: img.isPrimary
      })) || [],
      ecommerceData: product.ecommerceData ? {
        enabled: true,
        images: product.ecommerceData.images?.map(img => ({
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary ?? false
        })) || [],
        seoTitle: product.ecommerceData.seoTitle,
        seoDescription: product.ecommerceData.seoDescription,
        tags: product.ecommerceData.tags || [],
        displayOrder: product.ecommerceData.displayOrder
      } : undefined,
      seo: {
        title: product.ecommerceData?.seoTitle || '',
        description: product.ecommerceData?.seoDescription || '',
        tags: product.ecommerceData?.tags || []
      },
      ecommerce: {
        visible: true,
        displayOrder: product.ecommerceData?.displayOrder || 0
      },
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }));

    return transformedProducts;
  } catch (err) {
    throw parseApiError(err);
  }
}