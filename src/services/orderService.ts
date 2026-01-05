// src/services/orderService.ts
// USED SERVICE - Only getCustomerOrders is actively used
// Other functions are unused but kept for potential future use

import { apiFetch } from '../lib/api';
import type { CustomerOrderSummary, Pagination } from '../types/order';


// ACTIVELY USED FUNCTION
export async function getCustomerOrders() {
  return await apiFetch<{
    orders: CustomerOrderSummary[];
    pagination: Pagination;
  }>("/api/ecommerce/customers/orders", {}, true);
}