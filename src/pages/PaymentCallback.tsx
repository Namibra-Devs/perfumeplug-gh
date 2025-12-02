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

          // Build confirmation page data from API response and stored data
          const apiData = result as any;
          const confirmationData = {
            orderId: orderId,
            orderNumber: apiData.data?.order?.orderNumber || 'N/A',
            total: apiData.data?.amount || checkoutData?.total || 0,
            paymentMethod: 'Paystack',
            reference: apiData.data?.reference || reference,
            paidAt: apiData.data?.paid_at,
            shippingAddress: checkoutData ? {
              fullName: `${checkoutData.deliveryDetails?.firstName || ''} ${checkoutData.deliveryDetails?.lastName || ''}`.trim(),
              email: checkoutData.deliveryDetails?.email || checkoutData.customerDetails?.email || 'N/A',
              phone: checkoutData.deliveryDetails?.phone || checkoutData.customerDetails?.phone || 'N/A',
              addressLine1: checkoutData.deliveryDetails?.addressLine1 || 'N/A',
              addressLine2: checkoutData.deliveryDetails?.addressLine2 || '',
              city: checkoutData.deliveryDetails?.city || 'N/A',
              state: checkoutData.deliveryDetails?.state || 'N/A',
              zipCode: checkoutData.deliveryDetails?.zipCode || 'N/A',
              country: checkoutData.deliveryDetails?.country || 'N/A'
            } : {
              fullName: 'Customer',
              email: 'N/A',
              phone: 'N/A',
              addressLine1: 'N/A',
              city: 'N/A',
              state: 'N/A',
              zipCode: 'N/A',
              country: 'N/A'
            },
            items: checkoutData?.items?.map((item: any) => ({
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
            <Loader className="mx-auto h-16 w-16 animate-spin text-yellow-400 mb-4" />
            <h2 className="text-xl text-white font-semibold">{message}</h2>
            <p className="text-gray-300 mt-2">Please wait…</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-xl text-green-500 font-semibold">Payment Successful</h2>
            <p className="text-gray-300 mt-2">Redirecting...</p>
          </>
        )}

        {status === "failed" && (
          <>
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
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
