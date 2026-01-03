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

// New inventory structure from API response
export interface InventoryStatus {
  available: number;
  inStock: boolean;
  lowStock: boolean;
  criticalStock: boolean;
}

export interface EcommerceImage {
  url: string;
  publicId?: string;
  isPrimary: boolean;
  altText?: string;
  _id?: string;
}

export interface EcommerceData {
  enabled?: boolean;
  images: EcommerceImage[];
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  displayOrder?: number;
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
  images: Image[]; // Legacy images field
  ecommerceData?: EcommerceData; // New ecommerce data structure
  seo?: { title?: string; description?: string; tags?: string[]; }; // Legacy SEO field
  ecommerce?: { visible?: boolean; displayOrder?: number }; // Legacy ecommerce field
  inventory?: InventoryStatus;
  trackInventory?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  currentPage: number;
  limit: number;
  totalPages: number;
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
