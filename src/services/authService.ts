// src/services/authService.ts
import { apiFetch } from '../lib/api';
import { parseApiError } from '../lib/apiError';
import type { Customer } from '../types/customer';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export async function register(payload: RegisterPayload): Promise<{ customer: Customer; token: string }> {
 try {
    const data = await apiFetch<{ customer: Customer; token: string }>(
      '/api/ecommerce/customers/register',
      { method: 'POST', body: JSON.stringify(payload) },
      false
    );
    if (data.token) localStorage.setItem('customerToken', data.token);
    return data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function login(email: string, password: string): Promise<{ customer: Customer; token: string }> {
  try {
    const data = await apiFetch<{ customer: Customer; token: string }>(
      '/api/ecommerce/customers/login',
      { method: 'POST', body: JSON.stringify({ email, password }) },
      false
    );
    if (data.token) localStorage.setItem('customerToken', data.token);
    return data;
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function fetchProfile() {
  try {
    return await apiFetch<{ customer: Customer }>('/api/ecommerce/customers/profile', {}, true);
  } catch (err) {
    throw parseApiError(err);
  }
}

export async function updateProfile(payload: Partial<RegisterPayload>) {
  try {
    return await apiFetch<{ customer: Customer; message?: string }>(
      '/api/ecommerce/customers/profile',
      { method: 'PUT', body: JSON.stringify(payload) },
      true
    );
  } catch (err) {
    throw parseApiError(err);
  }
}


export function logout(): void {
  localStorage.removeItem('customerToken');
}
