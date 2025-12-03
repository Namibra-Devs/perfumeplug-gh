/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { checkoutService } from "../services/checkoutService";
import { useToast } from "../hooks/useToast";
import { useCart } from "../hooks/useCart";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying payment...");
  const toast = useToast();
  const { clearCart } = useCart();

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);

      const orderId = params.get("orderId");
      const reference = params.get("reference");

      if (!orderId || !reference) {
        setStatus("failed");
        setMessage("Missing payment reference or order ID.");
        return;
      }

      try {
        const result = await checkoutService.handlePaymentCallback(orderId, reference);
        
        console.log("Payment verification result:", result);

        if (result.status === 'success') {
          setStatus("success");
          setMessage("Payment verified successfully!");
          toast.success("Payment verified successfully!");

          // Clear cart on successful payment
          clearCart();

          // Get stored checkout data
          const storedCheckoutData = localStorage.getItem('checkoutData');
          let checkoutData = null;
          
          if (storedCheckoutData) {
            try {
              checkoutData = JSON.parse(storedCheckoutData);
            } catch (e) {
              console.error('Failed to parse checkout data:', e);
            }
          }

          // Try to get order details from API as fallback
          let orderDetails = null;
          try {
            const orderResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/ecommerce/orders/${orderId}`, {
              headers: {
                'X-Frontend-Domain': import.meta.env.VITE_TENANT_DOMAIN || 'perfumeplug-gh.onrender.com',
                'Authorization': localStorage.getItem('customerToken') ? `Bearer ${localStorage.getItem('customerToken')}` : '',
                'Content-Type': 'application/json'
              }
            });
            
            if (orderResponse.ok) {
              const orderData = await orderResponse.json();
              orderDetails = orderData.data?.order;
            }
          } catch (error) {
            console.error('Failed to fetch order details:', error);
          }

          // Build confirmation page data from API response, order details, and stored data
          const apiData = result as any;
          
          // Extract customer info from multiple sources with proper fallbacks
          const getCustomerInfo = () => {
            // Priority: orderDetails.customerInfo > checkoutData.deliveryDetails > checkoutData.customerDetails
            if (orderDetails?.customerInfo) {
              return {
                fullName: `${orderDetails.customerInfo.firstName || ''} ${orderDetails.customerInfo.lastName || ''}`.trim() || 'Customer',
                email: orderDetails.customerInfo.email || '',
                phone: orderDetails.customerInfo.phone || '',
                addressLine1: orderDetails.customerInfo.address?.street || '',
                addressLine2: orderDetails.customerInfo.address?.addressLine2 || '',
                city: orderDetails.customerInfo.address?.city || '',
                state: orderDetails.customerInfo.address?.state || '',
                zipCode: orderDetails.customerInfo.address?.zipCode || '',
                country: orderDetails.customerInfo.address?.country || ''
              };
            }
            
            if (checkoutData?.deliveryDetails) {
              return {
                fullName: `${checkoutData.deliveryDetails.firstName || ''} ${checkoutData.deliveryDetails.lastName || ''}`.trim() || 'Customer',
                email: checkoutData.deliveryDetails.email || checkoutData.customerDetails?.email || '',
                phone: checkoutData.deliveryDetails.phone || checkoutData.customerDetails?.phone || '',
                addressLine1: checkoutData.deliveryDetails.addressLine1 || '',
                addressLine2: checkoutData.deliveryDetails.addressLine2 || '',
                city: checkoutData.deliveryDetails.city || '',
                state: checkoutData.deliveryDetails.state || '',
                zipCode: checkoutData.deliveryDetails.zipCode || '',
                country: checkoutData.deliveryDetails.country || ''
              };
            }
            
            // Final fallback
            return {
              fullName: 'Customer',
              email: '',
              phone: '',
              addressLine1: '',
              addressLine2: '',
              city: '',
              state: '',
              zipCode: '',
              country: ''
            };
          };

          const customerInfo = getCustomerInfo();
          
          const confirmationData = {
            orderId: orderId,
            orderNumber: apiData.data?.order?.orderNumber || orderDetails?.orderNumber || 'N/A',
            total: apiData.data?.amount || orderDetails?.grandTotal || checkoutData?.total || 0,
            paymentMethod: 'Paystack',
            reference: apiData.data?.reference || reference,
            paidAt: apiData.data?.paid_at,
            shippingAddress: customerInfo,
            items: orderDetails?.items?.map((item: any) => ({
              productName: item.productName || 'Product',
              quantity: item.quantity || 1,
              price: item.unitPrice || 0,
              subtotal: item.totalPrice || 0
            })) || checkoutData?.items?.map((item: any) => ({
              productName: item.product?.name || 'Product',
              quantity: item.quantity || 1,
              price: item.price || 0,
              subtotal: (item.price || 0) * (item.quantity || 1)
            })) || []
          };

          // Clear stored checkout data
          localStorage.removeItem('checkoutData');

          setTimeout(() => {
            navigate("/order-confirmation", {
              state: confirmationData,
              replace: true,
            });
          }, 1500);
        } else {
          setStatus("failed");
          setMessage("Payment verification failed. Please contact support if you were charged.");
          toast.error("Payment verification failed.");
        }

      } catch (error: any) {
        console.error("Payment verification failed:", error);
        setStatus("failed");
        setMessage("Payment verification failed. Please contact support.");
        toast.error("Payment verification failed. Please contact support.");
      }
    };

    verifyPayment();
  }, [toast, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center p-6">
      <div className="bg-black/40 border border-yellow-500/30 backdrop-blur-xl p-10 rounded-2xl shadow-xl w-full max-w-md text-center">

        {status === "loading" && (
          <>
            <Loader size={24} className="mx-auto animate-spin text-yellow-400 mb-4" />
            <h2 className="text-xl text-white font-semibold">{message}</h2>
            <p className="text-gray-300 mt-2">Please wait…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle size={24} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-xl text-green-500 font-semibold">Payment Successful</h2>
            <p className="text-gray-300 mt-2">Redirecting...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle size={24} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-xl text-red-500 font-semibold">Payment Failed</h2>
            <p className="text-gray-300 mt-2">{message}</p>

            <button
              className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              onClick={() => navigate("/checkout")}
            >
              Try Again
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default PaymentCallback;
