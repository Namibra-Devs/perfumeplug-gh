import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, CreditCard, Truck, User, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import Header from '../components/layout/Header';

type CheckoutStep = 'customer' | 'delivery' | 'payment';

const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('customer');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [customerDetails, setCustomerDetails] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
  });

  const [deliveryDetails, setDeliveryDetails] = useState({
    address: '',
    city: '',
    region: '',
    postalCode: '',
    deliveryMethod: 'standard' as 'standard' | 'express',
  });

  const [paymentDetails, setPaymentDetails] = useState({
    method: 'mobile-money' as 'mobile-money' | 'card' | 'cod',
    phoneNumber: '',
    network: 'mtn' as 'mtn' | 'vodafone' | 'airteltigo',
  });

  const steps = [
    { id: 'customer', name: 'Customer Details', icon: User },
    { id: 'delivery', name: 'Delivery', icon: Truck },
    { id: 'payment', name: 'Payment', icon: CreditCard },
  ];

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05;
  const shipping = deliveryDetails.deliveryMethod === 'express' ? 20 : 0;
  const total = subtotal + tax + shipping;

  const handleCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('delivery');
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear cart and redirect to confirmation
    clearCart();
    navigate('/order-confirmation', { 
      state: { 
        orderId: `PP${Date.now()}`,
        total,
        customerDetails,
        paymentDetails,
        deliveryDetails,
      } 
    });
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
          <Link to="/shop" className="text-blue-600 hover:text-blue-700">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header title="Checkout Page" descripton='Checkout and provide your payment details'/>
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-6 sm:px-6 lg:px-32 py-20">
        {/* Header */}
        <div className=" md:text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center ">
                {/* Step Container */}
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep === step.id 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : steps.findIndex(s => s.id === currentStep) > index 
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-gray-300 text-gray-500'
                  }`}>
                    {steps.findIndex(s => s.id === currentStep) > index ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  
                  {/* Step Name */}
                  <span className={`mt-2 text-xs md:text-sm font-medium text-center ${
                    currentStep === step.id || steps.findIndex(s => s.id === currentStep) > index
                      ? 'text-gray-900'
                      : 'text-gray-500'
                  }`}>
                    {step.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className={`w-10 md:w-20 h-0.5 mx-2 md:mx-4 -mt-6 ${
                    steps.findIndex(s => s.id === currentStep) > index 
                      ? 'bg-green-600' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {/* Customer Details Step */}
              {currentStep === 'customer' && (
                <motion.div
                  key="customer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleCustomerSubmit} className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Customer Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <input
                          title='First Name'
                          type="text"
                          required
                          value={customerDetails.firstName}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name *
                        </label>
                        <input
                          title='Last Name'
                          type="text"
                          required
                          value={customerDetails.lastName}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          title='Email'
                          type="email"
                          required
                          value={customerDetails.email}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={customerDetails.phone}
                          onChange={(e) => setCustomerDetails(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+233 XX XXX XXXX"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end mt-6">
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Continue to Delivery
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Delivery Details Step */}
              {currentStep === 'delivery' && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleDeliverySubmit} className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Delivery Information</h2>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Street Address *
                        </label>
                        <input
                          title='Street Address'
                          type="text"
                          required
                          value={deliveryDetails.address}
                          onChange={(e) => setDeliveryDetails(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          title='City'
                          type="text"
                          required
                          value={deliveryDetails.city}
                          onChange={(e) => setDeliveryDetails(prev => ({ ...prev, city: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Region *
                        </label>
                        <select
                          title='Region'
                          required
                          value={deliveryDetails.region}
                          onChange={(e) => setDeliveryDetails(prev => ({ ...prev, region: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Select Region</option>
                          <option value="greater-accra">Greater Accra</option>
                          <option value="ashanti">Ashanti</option>
                          <option value="western">Western</option>
                          <option value="eastern">Eastern</option>
                          <option value="central">Central</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Postal Code
                        </label>
                        <input
                          title='Postal Code'
                          type="text"
                          value={deliveryDetails.postalCode}
                          onChange={(e) => setDeliveryDetails(prev => ({ ...prev, postalCode: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="font-medium text-gray-900 mb-4">Delivery Method</h3>
                      <div className="space-y-3">
                        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                          <input
                            type="radio"
                            name="delivery"
                            value="standard"
                            checked={deliveryDetails.deliveryMethod === 'standard'}
                            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, deliveryMethod: e.target.value as 'standard' | 'express' }))}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium">Standard Delivery</div>
                            <div className="text-sm text-gray-600">3-5 business days • Free</div>
                          </div>
                        </label>
                        <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                          <input
                            type="radio"
                            name="delivery"
                            value="express"
                            checked={deliveryDetails.deliveryMethod === 'express'}
                            onChange={(e) => setDeliveryDetails(prev => ({ ...prev, deliveryMethod: e.target.value as 'standard' | 'express' }))}
                            className="text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <div className="font-medium">Express Delivery</div>
                            <div className="text-sm text-gray-600">1-2 business days • ₵20.00</div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('customer')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Payment Step */}
              {currentStep === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handlePaymentSubmit} className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                    
                    <div className="space-y-4">
                      {/* Mobile Money */}
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        <input
                          type="radio"
                          name="payment"
                          value="mobile-money"
                          checked={paymentDetails.method === 'mobile-money'}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, method: e.target.value as 'mobile-money' }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Mobile Money</div>
                          <div className="text-sm text-gray-600">Pay with MTN, Vodafone, or AirtelTigo</div>
                          
                          {paymentDetails.method === 'mobile-money' && (
                            <div className="mt-3 space-y-3">
                              <select
                                value={paymentDetails.network}
                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, network: e.target.value as 'mtn' | 'vodafone' | 'airteltigo' }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              >
                                <option value="mtn">MTN Mobile Money</option>
                                <option value="vodafone">Vodafone Cash</option>
                                <option value="airteltigo">AirtelTigo Money</option>
                              </select>
                              <input
                                type="tel"
                                placeholder="Phone Number"
                                value={paymentDetails.phoneNumber}
                                onChange={(e) => setPaymentDetails(prev => ({ ...prev, phoneNumber: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Card Payment */}
                      <label className="flex items-start space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentDetails.method === 'card'}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, method: e.target.value as 'card' }))}
                          className="text-blue-600 focus:ring-blue-500 mt-1"
                        />
                        <div className="flex-1">
                          <div className="font-medium">Credit/Debit Card</div>
                          <div className="text-sm text-gray-600">Pay securely with your card</div>
                          
                          {paymentDetails.method === 'card' && (
                            <div className="mt-3 space-y-3">
                              {/* Card Number */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Card Number *
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pl-10"
                                    onChange={(e) => {
                                      // Format card number with spaces
                                      const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
                                      e.target.value = value;
                                    }}
                                  />
                                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {/* Expiry Date */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Expiry Date *
                                  </label>
                                  <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onChange={(e) => {
                                      // Format expiry date
                                      let value = e.target.value.replace(/\D/g, '');
                                      if (value.length >= 2) {
                                        value = value.slice(0, 2) + '/' + value.slice(2);
                                      }
                                      e.target.value = value.slice(0, 5);
                                    }}
                                  />
                                </div>

                                {/* CVV */}
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    CVV *
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      placeholder="123"
                                      maxLength={4}
                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                                    />
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                      <button type="button" className="text-gray-400 hover:text-gray-600" title="3-digit security code">
                                        ?
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Cardholder Name */}
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Cardholder Name *
                                </label>
                                <input
                                  type="text"
                                  placeholder="John Doe"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                              </div>

                              {/* Save Card Option */}
                              <label className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-600">Save card for future purchases</span>
                              </label>

                              {/* Card Icons */}
                              <div className="flex space-x-2">
                                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-semibold">VISA</span>
                                </div>
                                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-xs font-semibold">MC</span>
                                </div>
                                <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                                  <span className="text-xs">💳</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </label>

                      {/* Cash on Delivery */}
                      <label className="flex items-center space-x-3 p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-blue-500">
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentDetails.method === 'cod'}
                          onChange={(e) => setPaymentDetails(prev => ({ ...prev, method: e.target.value as 'cod' }))}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <div>
                          <div className="font-medium">Cash on Delivery</div>
                          <div className="text-sm text-gray-600">Pay when you receive your order</div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center mt-6 p-4 bg-blue-50 rounded-lg">
                      <Lock className="h-5 w-5 text-blue-600 mr-3" />
                      <span className="text-sm text-blue-700">Your payment information is secure and encrypted</span>
                    </div>

                    <div className="flex justify-between mt-6">
                      <button
                        type="button"
                        onClick={() => setCurrentStep('delivery')}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isProcessing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Processing...
                          </>
                        ) : (
                          `Pay ₵${total.toFixed(2)}`
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                {/* Items List */}
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.product.name}</div>
                        <div className="text-xs text-gray-600">Qty: {item.quantity}</div>
                      </div>
                      <div className="text-sm font-semibold">
                        ₵{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₵{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax (5%)</span>
                    <span>₵{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `₵${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total</span>
                    <span>₵{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;