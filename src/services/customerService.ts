// src/services/customerService.ts
import { ShippingAddress } from '../types/order';
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

export async function addAddress(address: ShippingAddress) {
  try {
    return await apiFetch<{ address: ShippingAddress }>('/api/ecommerce/customers/addresses', {
      method: 'POST',
      body: JSON.stringify(address),
    }, true);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function updateAddress(addressId: string, address: Partial<ShippingAddress>) {
  try {
    return await apiFetch<{ address: ShippingAddress }>(`/api/ecommerce/customers/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(address),
    }, true);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function deleteAddress(addressId: string) {
  try {
    return await apiFetch(`/api/ecommerce/customers/addresses/${addressId}`, { method: 'DELETE' }, true);
  } catch (err) {
    throw parseApiError(err);
  }
}
