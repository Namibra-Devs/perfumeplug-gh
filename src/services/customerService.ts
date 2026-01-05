// src/services/customerService.ts
// USED SERVICE - Only getCustomer is potentially needed
// Address management functions are unused

import { apiFetch } from '../lib/api';
import { parseApiError } from '../lib/apiError';

import type { Customer } from '../types/customer';

export async function getCustomer() {
  try {
    return await apiFetch<{ customer: Customer }>('/api/ecommerce/customers/profile', {}, true);
  } catch (err) {
    throw parseApiError(err);
  }
}
