// SHARED DOMAIN TYPES
export interface ProductImage {
  url: string;
  isPrimary: boolean;
}

export interface ProductSummary {
  _id: string;
  name: string;
  sku?: string;
  images: ProductImage[];
}

export interface OrderItem {
  product?: ProductSummary | string; // API may return ID string
  productName?: string;              // only present on POST /orders
  productId: string;
  quantity: number;
  price: number;
  subtotal?: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;  // Frontend uses this
  addressLine2?: string;
  street?: string;       // Backend expects this (mapped from addressLine1)
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  limit: number;
}

// RAW API RESPONSE SHAPE
export interface RawGetCustomerOrdersResponse {
  success: boolean;
  data: {
    orders: CustomerOrderSummary[];
    pagination: Pagination;
  };
}

// CLEAN, NORMALIZED RESPONSE SHAPE (used by services + hooks)
export interface GetCustomerOrdersResponse {
  orders: CustomerOrderSummary[];
  pagination: Pagination;
}

// CUSTOMER ORDER SUMMARY
export interface CustomerOrderSummary {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingMethod?: 'delivery' | 'pickup';

  items: {
    product: {
      _id: string;
      name: string;
      images: ProductImage[];
    };
    quantity: number;
    price: number;
  }[];

  shippingAddress: ShippingAddress;

  createdAt: string;
  updatedAt: string;
}

// QUERY PARAMS FOR ORDERS
export interface GetCustomerOrdersQuery {
  page?: number;
  limit?: number;
  status?: string;
}

// CREATE ORDER
export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  shippingAddress: ShippingAddress & {
    email: string;
  };
  customerNotes?: string;
  paymentMethod: "paystack";
}

// ORDER FULL DETAIL
export interface Order {
  _id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingMethod?: 'delivery' | 'pickup';
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  createdAt: string;
  updatedAt: string;
}
