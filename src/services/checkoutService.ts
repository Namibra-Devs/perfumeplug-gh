
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
      // Map frontend items to backend expected format
      const mappedItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
        // Backend will fetch price from product, don't send price
      }));

      // Map frontend address to backend customerInfo format
      const customerInfo = {
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        email: shippingAddress.email,
        phone: shippingAddress.phone,
        address: {
          street: shippingAddress.addressLine1,
          addressLine2: shippingAddress.addressLine2 || '',
          city: shippingAddress.city,
          state: shippingAddress.state,
          zipCode: shippingAddress.zipCode,
          country: shippingAddress.country
        }
      };

      // Check if user is authenticated by looking for token
      const isAuthenticated = typeof window !== 'undefined' && !!localStorage.getItem('customerToken');

      // Step 1: Create order
      const orderResponse = await apiFetch<{ order: Order }>(
        '/api/ecommerce/orders',
        {
          method: 'POST',
          body: JSON.stringify({
            customerInfo,
            items: mappedItems,
            shippingMethod,
            shippingAmount: 0, // Default shipping amount
            discountAmount: 0, // Default discount
            notes: customerNotes
          })
        },
        isAuthenticated // Include authentication if user is logged in
      );

      const order = orderResponse.order;

      // Step 2: Initialize payment
      const paymentResponse = await apiFetch<{ 
        authorization_url: string;
        access_code: string;
        reference: string;
      }>(
        `/api/ecommerce/orders/${order._id}/initialize-payment`,
        {
          method: 'POST',
          body: JSON.stringify({
            callback_url: `${window.location.origin}/payment/callback?orderId=${order._id}`
          })
        },
        isAuthenticated // Include authentication if user is logged in
      );

      // Step 3: Redirect to payment
      window.location.href = paymentResponse.authorization_url;

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