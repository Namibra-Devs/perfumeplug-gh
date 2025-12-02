
import { parseApiError } from "../lib/apiError";
import { Order, OrderItem, ShippingAddress } from "../types/order";
import { apiFetch } from "../lib/api";

class EcommerceCheckout {

  async checkout(
    items: OrderItem[],
    shippingAddress: ShippingAddress,
    shippingMethod: 'delivery' | 'pickup' = 'delivery',
    customerNotes?: string
  ) {
    try {
      // Map frontend address fields to backend expected format
      const mappedAddress = {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        street: shippingAddress.addressLine1, // Backend expects 'street'
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country
      };

      // Step 1: Create order
      const orderData = await apiFetch<{ order: Order }>(
        '/api/ecommerce/orders',
        {
          method: 'POST',
          body: JSON.stringify({
            items,
            shippingMethod,
            shippingAddress: mappedAddress,
            customerNotes,
            paymentMethod: 'paystack'
          })
        },
        true
      );

      const order = orderData.order;

      // Step 2: Initialize payment
      const paymentData = await apiFetch<{ authorizationUrl: string }>(
        `/api/ecommerce/orders/${order._id}/initialize-payment`,
        {
          method: 'POST',
          body: JSON.stringify({
            paymentMethod: 'paystack',
            callbackUrl: `${window.location.origin}/payment/callback?orderId=${order._id}`
          })
        }
      );

      // Step 3: Redirect to payment
      window.location.href = paymentData.authorizationUrl;

    } catch (error) {
      console.error('Checkout failed:', error);
      throw parseApiError(error);
    }
  }

  async handlePaymentCallback(orderId: string, reference: string) {
    try {
      const data = await apiFetch(
        `/api/ecommerce/orders/${orderId}/verify-payment?reference=${reference}`
      );

      return data;

    } catch (error) {
      console.error('Payment verification failed:', error);
      throw parseApiError(error);
    }
  }
}

export const checkoutService = new EcommerceCheckout();