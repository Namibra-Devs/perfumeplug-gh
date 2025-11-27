/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

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
import PaymentForm from "../components/checkout/PaymentForm";
import OrderSummary from "../components/checkout/OrderSummary";

type CheckoutStep = "customer" | "delivery" | "payment";

const CheckoutPage: React.FC = () => {
  const { customer, isAuthenticated } = useAuth();
  const { items, getTotalPrice } = useCart();
  const toast = useToast();

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

  const [notes, setNotes] = useState("");

  // --------------------------
  // REGION & COUNTRY SELECT
  // --------------------------
  const regionSelect = [
    { value: "Ahafo", label: "Ahafo" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Bono", label: "Bono" },
    { value: "Bono East", label: "Bono East" },
    { value: "Central", label: "Central" },
    { value: "Eastern", label: "Eastern" },
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "North East", label: "North East" },
    { value: "Northern", label: "Northern" },
    { value: "Oti", label: "Oti" },
    { value: "Savannah", label: "Savannah" },
    { value: "Upper East", label: "Upper East" },
    { value: "Upper West", label: "Upper West" },
    { value: "Volta", label: "Volta" },
    { value: "Western", label: "Western" },
    { value: "Western North", label: "Western North" },
  ];

  const countrySelect = [
    { value: "Ghana", label: "Ghana" },
    { value: "Nigeria", label: "Nigeria" },
    { value: "Kenya", label: "Kenya" },
    { value: "South Africa", label: "South Africa" },
    { value: "United States", label: "United States" },
    { value: "United Kingdom", label: "United Kingdom" },
    { value: "Canada", label: "Canada" },
  ];

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

    try {
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.sellingPrice,
      }));

      await checkoutService.checkout(orderItems, deliveryDetails, notes);
      toast.success("Order created successfully! Redirecting...");
    } catch (err) {
      console.log(err);
      setError("Failed to create order.");
      toast.error("Failed to create order.");
    }

    setLoading(false);
  };

  // ------------------------------
  // EMPTY CART
  // ------------------------------
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-4">Your cart is empty</h1>
          <Link className="text-blue-400" to="/shop">
            Return to shop
          </Link>
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
                    <DeliveryDetailsForm
                      data={deliveryDetails}
                      setData={setDeliveryDetails}
                      notes={notes}
                      setNotes={setNotes}
                      onNext={goToPayment}
                      onBack={isAuthenticated ? goBackToCustomer : undefined}
                      regions={regionSelect}
                      countries={countrySelect}
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
















//OLD CODE//:

// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { CreditCard, Truck, User } from "lucide-react";

// import Header from "../components/layout/Header";
// import CustomSelect from "../components/ui/CustomSelect";
// import { useAuth } from "../hooks/useAuth";
// import { useCart } from "../hooks/useCart";
// import { checkoutService } from "../services/checkoutService";
// import { ShippingAddress } from "../types/order";
// import { useToast } from "../hooks/useToast";

// type CheckoutStep = "customer" | "delivery" | "payment";

// const CheckoutPage: React.FC = () => {
//   const { customer} = useAuth();
//   const { items, getTotalPrice } = useCart();
//   const toast = useToast();

//   const [currentStep, setCurrentStep] = useState<CheckoutStep>("customer");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // Customer Info
//   const [customerDetails, setCustomerDetails] = useState({
//     firstName: customer?.firstName || "",
//     lastName: customer?.lastName || "",
//     email: customer?.email || "",
//     phone: customer?.phone || "",
//   });

//   // Delivery Info
//   const [deliveryDetails, setDeliveryDetails] = useState<ShippingAddress>({
//     firstName: "",
//     lastName: "",
//     phone: "",
//     email: customer?.email ?? "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     country: "",
//     zipCode: "",
//   });

//   const [notes, setNotes] = useState("");

//   const regionSelect = [
//     { value: "Ahafo", label: "Ahafo" },
//     { value: "Ashanti", label: "Ashanti" },
//     { value: "Bono", label: "Bono" },
//     { value: "Bono East", label: "Bono East" },
//     { value: "Central", label: "Central" },
//     { value: "Eastern", label: "Eastern" },
//     { value: "Greater Accra", label: "Greater Accra" },
//     { value: "North East", label: "North East" },
//     { value: "Northern", label: "Northern" },
//     { value: "Oti", label: "Oti" },
//     { value: "Savannah", label: "Savannah" },
//     { value: "Upper East", label: "Upper East" },
//     { value: "Upper West", label: "Upper West" },
//     { value: "Volta", label: "Volta" },
//     { value: "Western", label: "Western" },
//     { value: "Western North", label: "Western North" },
//   ];

//   const countrySelect = [
//     { value: "Ghana", label: "Ghana" },
//     { value: "Nigeria", label: "Nigeria" },
//     { value: "Kenya", label: "Kenya" },
//     { value: "South Africa", label: "South Africa" },
//     { value: "United States", label: "United States" },
//     { value: "United Kingdom", label: "United Kingdom" },
//     { value: "Canada", label: "Canada" }
//   ];

//   const steps = [
//     { id: "customer", name: "Customer Details", icon: User },
//     { id: "delivery", name: "Delivery", icon: Truck },
//     { id: "payment", name: "Payment", icon: CreditCard },
//   ];

//   const subtotal = getTotalPrice();
//   const shippingFee = 0;
//   const total = subtotal + shippingFee;

//   // -------------------------------
//   // STEP 1 — Customer Next
//   // -------------------------------
//   const handleCustomerSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCurrentStep("delivery");
//   };

//   // -------------------------------
//   // STEP 2 — Delivery Next
//   // -------------------------------
//   const handleDeliverySubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setCurrentStep("payment");
//   };

//   // -------------------------------
//   // STEP 3 — CALL CHECKOUT SERVICE
//   // -------------------------------
//   const handlePaymentSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       // Format cart items for API
//       const orderItems = items.map((item) => ({
//         productId: item.product._id,
//         quantity: item.quantity,
//         price: item.product.sellingPrice,
//       }));

//       // Call checkout class — this redirects to Paystack
//       await checkoutService.checkout(orderItems, deliveryDetails, notes);
//       toast.success("Order created successfull!. You'll be redirected to Paystack");
//     } catch (err) {
//       console.log(err);
//       setError("Failed to create order. Please try again.");
//       if(err){
//         toast.error("Failed to create order. Please try again!");
//       }
//     }

//     setLoading(false);
//   };

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
//         <div className="text-center">
//           <h1 className="text-2xl text-white mb-4">Your cart is empty</h1>
//           <Link className="text-blue-400" to="/shop">
//             Return to shop
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header
//         title="Checkout Page"
//         descripton="Checkout and provide your details"
//       />

//       <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
//         <div className="px-6 lg:px-32 py-20">
//           {/* STEPS UI */}
//           <div className="flex justify-center mb-8">
//             {steps.map((step, i) => {
//               const StepIcon = step.icon;
//               return (
//                 <div key={step.id} className="flex items-center">
//                   {/* Circle */}
//                   <div
//                     className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
//                       currentStep === step.id
//                         ? "border-purple-600 bg-purple-600 text-white"
//                         : "border-gray-500 text-gray-500"
//                     }`}
//                   >
//                     <StepIcon className="h-5 w-5" />
//                   </div>

//                   {/* Line */}
//                   {i < steps.length - 1 && (
//                     <div className="w-10 h-1 bg-gray-500 mx-2" />
//                   )}
//                 </div>
//               );
//             })}
//           </div>

//           {/* FORM SECTIONS */}
//           <div className="grid lg:grid-cols-3 gap-8">
//             <div className="lg:col-span-2">
//               <AnimatePresence mode="wait">

//                 {/* CUSTOMER */}
//                 {currentStep === "customer" && (
//                   <motion.div
//                     key="customer"
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                   >
//                     <form
//                       onSubmit={handleCustomerSubmit}
//                       className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
//                     >
//                       <h2 className="text-xl text-purple-600 mb-4">
//                         Customer Information
//                       </h2>

//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="First Name"
//                         required
//                         value={customerDetails.firstName}
//                         onChange={(e) =>
//                           setCustomerDetails({
//                             ...customerDetails,
//                             firstName: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Last Name"
//                         required
//                         value={customerDetails.lastName}
//                         onChange={(e) =>
//                           setCustomerDetails({
//                             ...customerDetails,
//                             lastName: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Email"
//                         required
//                         type="email"
//                         value={customerDetails.email}
//                         onChange={(e) =>
//                           setCustomerDetails({
//                             ...customerDetails,
//                             email: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Phone"
//                         required
//                         value={customerDetails.phone}
//                         onChange={(e) =>
//                           setCustomerDetails({
//                             ...customerDetails,
//                             phone: e.target.value,
//                           })
//                         }
//                       />

//                       </div>

//                       <button className="btn-primary bg-blue-600 text-white px-6 py-2 rounded-lg text-sm outline-none font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 mt-6">
//                         Continue to Delivery
//                       </button>
//                     </form>
//                   </motion.div>
//                 )}

//                 {/* DELIVERY */}
//                 {currentStep === "delivery" && (
//                   <motion.div
//                     key="delivery"
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                   >
//                     <form
//                       onSubmit={handleDeliverySubmit}
//                       className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
//                     >
//                       <h2 className="text-xl text-purple-600 mb-4">
//                         Delivery Address
//                       </h2>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="grid grid-cols-1 md:grid-cols-2 col-span-3 gap-4">
//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="First Name"
//                         required
//                         value={deliveryDetails.firstName}
//                         onChange={(e) =>
//                           setDeliveryDetails({
//                             ...deliveryDetails,
//                             firstName: e.target.value,
//                           })
//                         }
//                       />
//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Last Name"
//                         required
//                         value={deliveryDetails.lastName}
//                         onChange={(e) =>
//                           setDeliveryDetails({
//                             ...deliveryDetails,
//                             lastName: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Phone"
//                         required
//                         value={deliveryDetails.phone}
//                         onChange={(e) =>
//                           setDeliveryDetails({
//                             ...deliveryDetails,
//                             phone: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Address Line 1"
//                         required
//                         value={deliveryDetails.addressLine1}
//                         onChange={(e) =>
//                           setDeliveryDetails({
//                             ...deliveryDetails,
//                             addressLine1: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="Address Line 2"
//                         required
//                         value={deliveryDetails.addressLine2}
//                         onChange={(e) =>
//                           setDeliveryDetails({
//                             ...deliveryDetails,
//                             addressLine2: e.target.value,
//                           })
//                         }
//                       />

//                       <input
//                         className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                         placeholder="City"
//                         required
//                         value={deliveryDetails.city}
//                         onChange={(e) =>
//                           setDeliveryDetails({
//                             ...deliveryDetails,
//                             city: e.target.value,
//                           })
//                         }
//                       />
//                       </div>

//                       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 col-span-3">
//                         <CustomSelect
//                           value={deliveryDetails.state}
//                           placeholder="Select Region"
//                           className="min-w-full px-6 py-2.5"
//                           onChange={(state) =>
//                             setDeliveryDetails({ ...deliveryDetails, state })
//                           }
//                           options={regionSelect}
//                         />

//                         <input
//                           className="input w-full px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                           placeholder="Zip Code"
//                           required
//                           value={deliveryDetails.zipCode}
//                           onChange={(e) =>
//                             setDeliveryDetails({
//                               ...deliveryDetails,
//                               zipCode: e.target.value,
//                             })
//                           }
//                         />

//                         <CustomSelect
//                           value={deliveryDetails.country}
//                           placeholder="Select Country"
//                           className="min-w-full px-6 py-2.5"
//                           onChange={(country) =>
//                             setDeliveryDetails({ ...deliveryDetails, country })
//                           }
//                           options={countrySelect}
//                         />
//                       </div>

//                       <div className="grid col-span-3">
//                         <textarea
                          
//                           className="w-full h-14 resize-none px-3 py-2.5 bg-transparent text-white text-sm outline-none border border-yellow-600/20 rounded-lg focus:ring-2 focus:ring-yellow-500"
//                           placeholder="Additional Notes / Delivery Instructions"
//                           value={notes}
//                           onChange={(e) => setNotes(e.target.value)}
//                         />
//                       </div>

//                     </div>

//                       <button className="btn-primary bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 mt-6">
//                         Continue to Payment
//                       </button>
//                     </form>
//                   </motion.div>
//                 )}

//                 {/* PAYMENT */}
//                 {currentStep === "payment" && (
//                   <motion.div
//                     key="payment"
//                     initial={{ opacity: 0, x: 30 }}
//                     animate={{ opacity: 1, x: 0 }}
//                   >
//                     <form
//                       onSubmit={handlePaymentSubmit}
//                       className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
//                     >
//                       <h2 className="text-xl text-purple-600 mb-4">
//                         Payment Method
//                       </h2>

//                       {error && (
//                         <div className="text-red-400 mb-3">{error}</div>
//                       )}

//                       <p className="text-sm text-gray-300 mt-4">
//                         You will be redirected to Paystack to complete your
//                         payment.
//                       </p>

//                       <button className="btn-primary bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 mt-6" disabled={loading}>
//                         {loading ? "Processing..." : `Pay ₵${total.toFixed(2)}`}
//                       </button>
//                     </form>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* ORDER SUMMARY */}
//             <div className="lg:col-span-1">
//               <div className="bg-black/20 border border-yellow-500/30 rounded-xl p-6 sticky top-20">
//                 <h2 className="text-xl text-purple-600 mb-4">Order Summary</h2>

//                 {items.map((item) => (
//                   <div key={item.product._id} className="flex mb-4">
//                     <img
//                       src={item.product.images[0]?.url}
//                       alt={item.product.name}
//                       className="w-14 h-14 rounded object-cover"
//                     />
//                     <div className="ml-3">
//                       <p className="text-white">{item.product.name}</p>
//                       <p className="text-gray-400 text-sm">
//                         Qty: {item.quantity}
//                       </p>
//                     </div>
//                   </div>
//                 ))}

//                 <div className="border-t border-yellow-500/30 mt-4 pt-4">
//                   <div className="flex justify-between">
//                     <span className="text-white">Subtotal</span>
//                     <span className="text-yellow-400">
//                       ₵{subtotal.toFixed(2)}
//                     </span>
//                   </div>

//                   <div className="flex justify-between mt-2">
//                     <span className="text-white">Total</span>
//                     <span className="text-yellow-400">₵{total.toFixed(2)}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );

// };

// export default CheckoutPage;