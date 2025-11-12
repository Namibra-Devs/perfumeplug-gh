
export interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
}
export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  category: string;
  gender: 'men' | 'women' | 'unisex';
  size: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  fragranceNotes: {
    top: string[];
    middle: string[];
    base: string[];
  };
  featured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'mobile-money' | 'cash-on-delivery';
  createdAt: string;
  trackingNumber?: string;
}

export type PaymentMethod = 'mobile-money' | 'card' | 'cash-on-delivery';
export type DeliveryMethod = 'standard' | 'express';


export type DeliveryDetails =  {
  address: string,
  city: string,
  region: string,
  postalCode: string,
  deliveryMethod: DeliveryMethod,
}


export type PaymentDetails  = {
  method: PaymentMethod | 'cash-on-delivery',
  phoneNumber: string,
  network: 'mtn' | 'vodafone' | 'airteltigo',
}
