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

export async function fetchProducts(opts: FetchProductsOptions = {}) {
  try {
    const params = new URLSearchParams();
    if (opts.page) params.set('page', String(opts.page));
    if (opts.limit) params.set('limit', String(opts.limit));
    if (opts.search) params.set('search', opts.search);
    if (opts.category) params.set('category', opts.category);
    if (opts.minPrice !== undefined) params.set('minPrice', String(opts.minPrice));
    if (opts.maxPrice !== undefined) params.set('maxPrice', String(opts.maxPrice));
    if (opts.sortBy) params.set('sortBy', opts.sortBy);
    if (opts.sortOrder) params.set('sortOrder', opts.sortOrder);

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