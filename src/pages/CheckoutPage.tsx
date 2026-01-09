/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

import Header from "../components/layout/Header";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { checkoutService } from "../services/checkoutService";
import { ShippingAddress } from "../types/order";
import { useToast } from "../hooks/useToast";

// --- Checkout Steps ---
import StepIndicator from "../components/checkout/StepIndicator";
import CustomerDetailsForm from "../components/checkout/CustomerDetailsForm";
import DeliveryDetailsForm from "../components/checkout/DeliveryDetailsForm";
import ShippingMethodSelector from "../components/checkout/ShippingMethodSelector";
import PaymentForm from "../components/checkout/PaymentForm";
import OrderSummary from "../components/checkout/OrderSummary";

type CheckoutStep = "customer" | "delivery" | "payment";

const CheckoutPage: React.FC = () => {
  const { customer, isAuthenticated } = useAuth();
  const { items, getTotalPrice } = useCart();
  const toast = useToast();
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to cart page if no history
      navigate('/cart');
    }
  };

  // --------------------------
  // STATE
  // --------------------------
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --------------------------
  // PREFILL CUSTOMER DETAILS
  // --------------------------
  const [customerDetails, setCustomerDetails] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });

  // --------------------------
  // DELIVERY DETAILS
  // --------------------------
  const [deliveryDetails, setDeliveryDetails] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    phone: "",
    email: customer?.email ?? "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
  });

  // const [notes, setNotes] = useState("");

  // --------------------------
  // SHIPPING METHOD
  // --------------------------
  const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery');

  // ------------------------------
  // AUTO-SKIP FOR GUEST CHECKOUT
  // ------------------------------
  useEffect(() => {
    if (!isAuthenticated) {
      // Guest → Skip customer form
      setCurrentStep("delivery");
    }
  }, [isAuthenticated]);

  // ------------------------------
  // FORM FLOW
  // ------------------------------
  const goToDelivery = () => setCurrentStep("delivery");
  const goToPayment = () => setCurrentStep("payment");
  const goBackToCustomer = () => setCurrentStep("customer");
  const goBackToDelivery = () => setCurrentStep("delivery");

  // ------------------------------
  // SUBMIT PAYMENT (FINAL STEP)
  // ------------------------------
  const handlePaymentSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if(!isAuthenticated){
      setError("Please login to place an order.");
      toast.error("Please login to place an order.");
      navigate('/account', { 
        state: { from: '/checkout' } // Pass current location for redirect after login
      });
      return;
    }

    try {
      // Validate required fields
      if (!deliveryDetails.firstName || !deliveryDetails.lastName || !deliveryDetails.phone) {
        setError("Please fill in all required customer information.");
        toast.error("Please fill in all required customer information.");
        setLoading(false);
        return;
      }

      if (currentStep === "delivery" && !deliveryDetails.addressLine1) {
        setError("Please fill in all required address information.");
        toast.error("Please fill in all required address information.");
        setLoading(false);
        return;
      }
      
      // Map cart items to order items format
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.sellingPrice, // Include for reference, backend will validate
      }));

      console.log('Creating order with:', {
        items: orderItems,
        shippingAddress: deliveryDetails,
        shippingMethod,
      });

      // Store checkout data in localStorage for confirmation page
      const checkoutData = {
        items: orderItems,
        customerDetails,
        deliveryDetails,
        shippingMethod,
        total: getTotalPrice()
      };
      localStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      await checkoutService.checkout(orderItems, deliveryDetails, shippingMethod);
      toast.success("Order created successfully! Redirecting to payment...");
    } catch (err: any) {
      console.error('Checkout error:', err);
      const errorMessage = err.message || "Failed to create order. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    }

    setLoading(false);
  };

  // ------------------------------
  // EMPTY CART
  // ------------------------------
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-4">
          <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-8">
            {/* Back Navigation for Empty Cart */}
            <div className="flex justify-start mb-4">
              <button
                onClick={handleGoBack}
                className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                title="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Back</span>
              </button>
            </div>
            
            <h1 className="text-2xl text-white mb-4">Your cart is empty</h1>
            <p className="text-gray-300 mb-6">Add some items to your cart before proceeding to checkout.</p>
            <Link 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300"
              to="/shop"
            >
              Return to shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = getTotalPrice();
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  return (
    <>
      <Header title="Checkout Page" descripton="Checkout and provide your details" />

      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="px-6 lg:px-32 py-20">

          {/* Back Navigation */}
          <div className="mb-6">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors group"
              title="Go back"
            >
              <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
          </div>

          {/* STEP INDICATOR */}
          <StepIndicator current={currentStep} />

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FORMS */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* CUSTOMER STEP */}
                {currentStep === "customer" && isAuthenticated && (
                  <motion.div
                    key="customer"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <CustomerDetailsForm
                      data={customerDetails}
                      setData={setCustomerDetails}
                      onNext={goToDelivery}
                    />
                  </motion.div>
                )}

                {/* DELIVERY STEP */}
                {currentStep === "delivery" && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >

                    {/* SHIPPING METHOD SELECTOR */}
                    <ShippingMethodSelector
                      value={shippingMethod}
                      onChange={setShippingMethod}
                    />

                    {/* DELIVERY DETAILS FORM */}
                    <DeliveryDetailsForm
                      data={deliveryDetails}
                      setData={setDeliveryDetails}
                      onNext={goToPayment}
                      onBack={isAuthenticated ? goBackToCustomer : undefined}
                      value={shippingMethod}
                    />
                  </motion.div>
                )}

                {/* PAYMENT STEP */}
                {currentStep === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <PaymentForm
                      loading={loading}
                      error={error}
                      total={total}
                      onSubmit={handlePaymentSubmit}
                      onBack={goBackToDelivery}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ORDER SUMMARY */}
            <OrderSummary items={items} subtotal={subtotal} total={total} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;