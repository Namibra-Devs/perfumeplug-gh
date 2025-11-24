
import { parseApiError } from "../lib/apiError";
import { OrderItem, ShippingAddress } from "../types/order";

class EcommerceCheckout {
  private baseUrl = 'https://pos-api-pm1f.onrender.com';
  private tenantDomain = 'https://perfumeplug-gh.onrender.com';

  private getHeaders(includeAuth = false) {
    const headers: HeadersInit = {
      'X-Tenant-Domain': this.tenantDomain,
      'Content-Type': 'application/json'
    };

    if (includeAuth) {
      const token = localStorage.getItem('customerToken');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async checkout(
    items: OrderItem[],
    shippingAddress: ShippingAddress,
    customerNotes?: string
  ) {
    try {
      // Step 1: Create order
      const orderResponse = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify({
          items,
          shippingAddress,
          customerNotes,
          paymentMethod: 'paystack'
        })
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const orderData = await orderResponse.json();
      const order = orderData.data.order;

      // Step 2: Initialize payment
      const paymentResponse = await fetch(
        `${this.baseUrl}/orders/${order._id}/initialize-payment`,
        {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            email: shippingAddress.email,
            callbackUrl: `${window.location.origin}/payment/callback?orderId=${order._id}`
          })
        }
      );

      if (!paymentResponse.ok) {
        throw new Error('Failed to initialize payment');
      }

      const paymentData = await paymentResponse.json();

      // Step 3: Redirect to payment
      window.location.href = paymentData.data.authorizationUrl;

    } catch (error) {
      console.error('Checkout failed:', error);
      throw parseApiError(error);
    }
  }

  async handlePaymentCallback(orderId: string, reference: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/orders/${orderId}/verify-payment?reference=${reference}`,
        {
          headers: this.getHeaders()
        }
      );

      if (!response.ok) {
        throw new Error('Payment verification failed');
      }

      const data = await response.json();
      return data.data;

    } catch (error) {
      console.error('Payment verification failed:', error);
      throw parseApiError(error);
    }
  }
}

export const checkoutService = new EcommerceCheckout();