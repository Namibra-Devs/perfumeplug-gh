import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader } from "lucide-react";
import { checkoutService } from "../services/checkoutService";
import { useToast } from "../hooks/useToast";
import { OrderItem } from "../types/order";

const PaymentCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying payment...");
  const toast = useToast();

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
        const order = result.order as any;

        console.log("Verified Order:", order);

        setStatus("success");
        toast.success("Payment verified successfully!");

        // Build confirmation page data
        const confirmationData = {
          orderId: order._id,
          orderNumber: order.orderNumber,
          total: order.totalAmount,
          paymentMethod: order.paymentMethod,
          shippingAddress: {
            fullName: order.shippingAddress.fullName,
            email: order.shippingAddress.email,
            phone: order.shippingAddress.phone,
            addressLine1: order.shippingAddress.addressLine1,
            addressLine2: order.shippingAddress.addressLine2,
            city: order.shippingAddress.city,
            state: order.shippingAddress.state,
            zipCode: order.shippingAddress.zipCode,
            country: order.shippingAddress.country,
          },
          items: order.items.map((item: OrderItem) => ({
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal,
          })),
        };

        setTimeout(() => {
          navigate("/order-confirmation", {
            state: confirmationData,
            replace: true,
          });
        }, 1500);

      } catch (error) {
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
