import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Truck, User } from "lucide-react";

import Header from "../components/layout/Header";
import CustomSelect from "../components/ui/CustomSelect";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { checkoutService } from "../services/checkoutService";
import { ShippingAddress } from "../types/order";

type CheckoutStep = "customer" | "delivery" | "payment";

const CheckoutPage: React.FC = () => {
  const { customer } = useAuth();
  const { items, getTotalPrice } = useCart();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Customer Info
  const [customerDetails, setCustomerDetails] = useState({
    firstName: customer?.firstName || "",
    lastName: customer?.lastName || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
  });

  // Delivery Info
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

  const [notes] = useState("");
  // const [notes, setNotes] = useState("");

  const regionSelect = [
    { value: "Greater Accra", label: "Greater Accra" },
    { value: "Ashanti", label: "Ashanti" },
    { value: "Western", label: "Western" },
    { value: "Northern", label: "Northern" },
  ];

  const steps = [
    { id: "customer", name: "Customer Details", icon: User },
    { id: "delivery", name: "Delivery", icon: Truck },
    { id: "payment", name: "Payment", icon: CreditCard },
  ];

  const subtotal = getTotalPrice();
  const shippingFee = 0;
  const total = subtotal + shippingFee;

  // -------------------------------
  // STEP 1 — Customer Next
  // -------------------------------
  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("delivery");
  };

  // -------------------------------
  // STEP 2 — Delivery Next
  // -------------------------------
  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  // -------------------------------
  // STEP 3 — CALL CHECKOUT SERVICE
  // -------------------------------
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Format cart items for API
      const orderItems = items.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
        price: item.product.sellingPrice,
      }));

      // Call checkout class — this redirects to Paystack
      await checkoutService.checkout(orderItems, deliveryDetails, notes);
    } catch (err) {
      console.log(err);
      setError("Payment failed. Please try again.");
    }

    setLoading(false);
  };

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

  return (
    <>
      <Header
        title="Checkout Page"
        descripton="Checkout and provide your details"
      />

      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="px-6 lg:px-32 py-20">
          {/* STEPS UI */}
          <div className="flex justify-center mb-8">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              return (
                <div key={step.id} className="flex items-center">
                  {/* Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      currentStep === step.id
                        ? "border-purple-600 bg-purple-600 text-white"
                        : "border-gray-500 text-gray-500"
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>

                  {/* Line */}
                  {i < steps.length - 1 && (
                    <div className="w-10 h-1 bg-gray-500 mx-2" />
                  )}
                </div>
              );
            })}
          </div>

          {/* FORM SECTIONS */}
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* CUSTOMER */}
                {currentStep === "customer" && (
                  <motion.div
                    key="customer"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <form
                      onSubmit={handleCustomerSubmit}
                      className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
                    >
                      <h2 className="text-xl text-purple-600 mb-4">
                        Customer Information
                      </h2>

                      <input
                        className="input"
                        placeholder="First Name"
                        required
                        value={customerDetails.firstName}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <input
                        className="input"
                        placeholder="Last Name"
                        required
                        value={customerDetails.lastName}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            lastName: e.target.value,
                          })
                        }
                      />

                      <input
                        className="input mt-4"
                        placeholder="Email"
                        required
                        type="email"
                        value={customerDetails.email}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            email: e.target.value,
                          })
                        }
                      />

                      <input
                        className="input mt-4"
                        placeholder="Phone"
                        required
                        value={customerDetails.phone}
                        onChange={(e) =>
                          setCustomerDetails({
                            ...customerDetails,
                            phone: e.target.value,
                          })
                        }
                      />

                      <button className="btn-primary mt-6">
                        Continue to Delivery
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* DELIVERY */}
                {currentStep === "delivery" && (
                  <motion.div
                    key="delivery"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <form
                      onSubmit={handleDeliverySubmit}
                      className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
                    >
                      <h2 className="text-xl text-purple-600 mb-4">
                        Delivery Address
                      </h2>

                      <input
                        className="input"
                        placeholder="First Name"
                        required
                        value={deliveryDetails.firstName}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            firstName: e.target.value,
                          })
                        }
                      />
                      <input
                        className="input"
                        placeholder="Last Name"
                        required
                        value={deliveryDetails.lastName}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            lastName: e.target.value,
                          })
                        }
                      />

                      <input
                        className="input mt-4"
                        placeholder="Phone"
                        required
                        value={deliveryDetails.phone}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            phone: e.target.value,
                          })
                        }
                      />

                      <input
                        className="input mt-4"
                        placeholder="Address Line 1"
                        required
                        value={deliveryDetails.addressLine1}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            addressLine1: e.target.value,
                          })
                        }
                      />

                      <input
                        className="input mt-4"
                        placeholder="City"
                        required
                        value={deliveryDetails.city}
                        onChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            city: e.target.value,
                          })
                        }
                      />

                      <CustomSelect
                        value={deliveryDetails.country}
                        onChange={(country) =>
                          setDeliveryDetails({ ...deliveryDetails, country })
                        }
                        options={regionSelect}
                      />

                      <button className="btn-primary mt-6">
                        Continue to Payment
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* PAYMENT */}
                {currentStep === "payment" && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <form
                      onSubmit={handlePaymentSubmit}
                      className="bg-black/20 border border-yellow-500/30 rounded-xl p-6"
                    >
                      <h2 className="text-xl text-purple-600 mb-4">
                        Payment Method
                      </h2>

                      {error && (
                        <div className="text-red-400 mb-3">{error}</div>
                      )}

                      <p className="text-sm text-gray-300 mt-4">
                        You will be redirected to Paystack to complete your
                        payment.
                      </p>

                      <button className="btn-primary mt-6" disabled={loading}>
                        {loading ? "Processing..." : `Pay ₵${total.toFixed(2)}`}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-black/20 border border-yellow-500/30 rounded-xl p-6 sticky top-20">
                <h2 className="text-xl text-purple-600 mb-4">Order Summary</h2>

                {items.map((item) => (
                  <div key={item.product._id} className="flex mb-4">
                    <img
                      src={item.product.images[0]?.url}
                      alt={item.product.name}
                      className="w-14 h-14 rounded object-cover"
                    />
                    <div className="ml-3">
                      <p className="text-white">{item.product.name}</p>
                      <p className="text-gray-400 text-sm">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="border-t mt-4 pt-4">
                  <div className="flex justify-between">
                    <span className="text-white">Subtotal</span>
                    <span className="text-yellow-400">
                      ₵{subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between mt-2">
                    <span className="text-white">Total</span>
                    <span className="text-yellow-400">₵{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutPage;