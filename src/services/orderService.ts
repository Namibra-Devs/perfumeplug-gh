// src/services/orderService.ts
import { apiFetch } from '../lib/api';
import type { CustomerOrderSummary, Order,  OrderItem, Pagination, ShippingAddress } from '../types/order';
import { parseApiError } from '../lib/apiError';

export async function createOrder(
  items: { productId: string; quantity: number; price: number }[],
  shippingAddress: ShippingAddress,
  shippingMethod: 'delivery' | 'pickup' = 'delivery',
  customerNotes?: string
) {
  try {
    return await apiFetch<{ order: OrderItem }>(
      '/api/ecommerce/orders',
      {
        method: 'POST',
        body: JSON.stringify({ items, shippingMethod, shippingAddress, customerNotes, paymentMethod: 'paystack' }),
      },
      true
    );
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function getOrder(orderId: string) {
  try {
    return await apiFetch<{ order: Order }>(`/api/ecommerce/orders/${orderId}`, {}, true);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function getCustomerOrders() {
  return await apiFetch<{
    orders: CustomerOrderSummary[];
    pagination: Pagination;
  }>("/api/ecommerce/customers/orders", {}, true);
}












// import { Order } from "../types/order";


// const API_URL = import.meta.env.VITE_API_URL;
// const TENANT = import.meta.env.VITE_TENANT_DOMAIN;

// export async function getCustomerOrders(token?: string | null): Promise<Order[]> {
//   const res = await fetch(`${API_URL}/orders`, {
//     headers: {
//       "Content-Type": "application/json",
//       "X-Tenant-Domain": TENANT,
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch customer orders");
//   }

//   const data = await res.json();
//   return data.data.orders;
// }

// export async function getOrderById(id: string, token: string): Promise<Order> {
//   const res = await fetch(`${API_URL}/orders/${id}`, {
//     headers: {
//       "Content-Type": "application/json",
//       "X-Tenant-Domain": TENANT,
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch order details");
//   }

//   const data = await res.json();
//   return data.data.order;
// }
