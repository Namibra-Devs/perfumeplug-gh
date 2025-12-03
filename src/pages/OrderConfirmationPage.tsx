import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

interface OrderConfirmationData {
  orderId: string;
  orderNumber: string;
  total: number;
  paymentMethod: string;
  reference?: string;
  paidAt?: string;
  shippingAddress?: {
    fullName?: string;
    email?: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  items?: {
    productName: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

const OrderConfirmationPage: React.FC = () => {
  const location = useLocation();
  const orderData = location.state as OrderConfirmationData;

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
          <Link to="/shop" className="text-blue-600 hover:text-blue-700">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  // Safely extract name parts with fallbacks
  const fullName = orderData.shippingAddress?.fullName || 'Customer';
  const nameParts = fullName.split(" ");
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts[1] || "";

  return (
    <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-300">Thank you for your purchase.</p>
          <div className="bg-green-600/20 border border-green-500 px-4 py-2 rounded-lg inline-block mt-4 text-white">
            Order No: <strong>{orderData.orderNumber}</strong>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-500">Order Summary</h2>

            <div className="space-y-3 text-white/90">
              <div className="flex justify-between"><span>Total Amount</span> <span className="font-semibold">₵{orderData.total.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Payment Method</span> {orderData.paymentMethod}</div>
              <div className="flex justify-between"><span>Status</span> <span className="text-green-400">Paid</span></div>
            </div>

            {/* Items */}
            {orderData.items && orderData.items.length > 0 ? (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Items</h3>
                <div className="space-y-2 text-white/80">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>{item.productName} (x{item.quantity})</span>
                      <span>₵{item.subtotal.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Order Details</h3>
                <p className="text-white/80 text-sm">
                  Your order has been confirmed and payment has been processed successfully.
                  You will receive an email confirmation shortly with detailed order information.
                </p>
              </div>
            )}
          </motion.div>

          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-500">Customer Information</h2>

            <div className="space-y-3 text-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">
                    {firstName[0]?.toUpperCase() || 'C'}{lastName[0]?.toUpperCase() || ''}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">{firstName} {lastName}</div>
                </div>
              </div>

              {orderData.shippingAddress?.email && 
               orderData.shippingAddress.email !== 'customer@example.com' && 
               orderData.shippingAddress.email !== 'N/A' && 
               orderData.shippingAddress.email.trim() !== '' && (
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4" /> 
                  <span>{orderData.shippingAddress.email}</span>
                </div>
              )}
              
              {orderData.shippingAddress?.phone && 
               orderData.shippingAddress.phone !== 'N/A' && 
               orderData.shippingAddress.phone.trim() !== '' && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4" /> 
                  <span>{orderData.shippingAddress.phone}</span>
                </div>
              )}
              
              {orderData.shippingAddress?.addressLine1 && 
               orderData.shippingAddress.addressLine1 !== 'N/A' && 
               orderData.shippingAddress.addressLine1.trim() !== '' && (
                <div className="flex items-start space-x-3">
                  <MapPin className="h-4 w-4 mt-0.5" />
                  <span>
                    {orderData.shippingAddress.addressLine1}
                    {orderData.shippingAddress.addressLine2 && orderData.shippingAddress.addressLine2.trim() !== '' && (
                      <><br />{orderData.shippingAddress.addressLine2}</>
                    )}
                    {(orderData.shippingAddress.city && orderData.shippingAddress.city.trim() !== '') || 
                     (orderData.shippingAddress.state && orderData.shippingAddress.state.trim() !== '') ? (
                      <><br />
                        {orderData.shippingAddress.city && orderData.shippingAddress.city.trim() !== '' ? orderData.shippingAddress.city : ''}
                        {orderData.shippingAddress.city && orderData.shippingAddress.city.trim() !== '' && 
                         orderData.shippingAddress.state && orderData.shippingAddress.state.trim() !== '' ? ', ' : ''}
                        {orderData.shippingAddress.state && orderData.shippingAddress.state.trim() !== '' ? orderData.shippingAddress.state : ''}
                      </>
                    ) : null}
                    {orderData.shippingAddress.country && orderData.shippingAddress.country.trim() !== '' && (
                      <><br />{orderData.shippingAddress.country}</>
                    )}
                  </span>
                </div>
              )}

              {(!orderData.shippingAddress?.addressLine1 || 
                orderData.shippingAddress.addressLine1 === 'N/A' || 
                orderData.shippingAddress.addressLine1.trim() === '') && 
               (!orderData.shippingAddress?.email || 
                orderData.shippingAddress.email === 'N/A' || 
                orderData.shippingAddress.email.trim() === '') && 
               (!orderData.shippingAddress?.phone || 
                orderData.shippingAddress.phone === 'N/A' || 
                orderData.shippingAddress.phone.trim() === '') && (
                <div className="text-white/60 text-sm">
                  <p>Order confirmation details have been sent to your email.</p>
                  <p>Thank you for your purchase!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 text-center">
            Continue Shopping
          </Link>

          <Link to="/account?activeTab=orders" className="border border-yellow-600/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 text-center">
            View Order History
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
