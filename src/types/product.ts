// src/types/product.ts
export interface Image {
  url: string;
  altText?: string;
  isPrimary?: boolean;
  order?: number;
}

export interface Inventory {
  quantity: number;
  trackInventory: boolean;
  lowStockThreshold?: number;
}

export interface Product {
  _id: string;
  name: string;
  sku?: string;
  barcode?: string;
  brand?: string;
  description?: string;
  category?: string;
  purchasePrice?: number;
  sellingPrice: number;
  originalPrice?: number;
  wholesalePrice?: number;
  images: Image[];
  seo?: { title?: string; description?: string; tags?: string[]; };
  ecommerce?: { visible?: boolean; displayOrder?: number };
  inventory?: Inventory;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  currentPage: number;
  totalItems: number;
  limit: number;
  totalPages?: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchProducts: (page: number) => Promise<void>;
}

export interface SearchProductsRawResponse {
  success: boolean;
  data: {
    products: Product[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalProducts: number;
      limit: number;
    };
  };
}
