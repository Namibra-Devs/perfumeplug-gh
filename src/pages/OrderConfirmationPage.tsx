import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Phone, MapPin } from 'lucide-react';

interface OrderConfirmationData {
  orderId: string;
  total: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentDetails: {
    method: string;
  };
  deliveryDetails: {
    address: string;
    city: string;
    region: string;
    deliveryMethod: string;
  };
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

  return (
    <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
          <p className="text-gray-300">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="bg-green-600/20 text-white border border-green-500 px-4 py-2 rounded-lg inline-block mt-4">
            Order ID: <strong>{orderData.orderId}</strong>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-500">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className='text-white'>Order Total</span>
                <span className="font-semibold text-yellow-400">₵{orderData.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className='text-white'>Payment Method</span>
                <span className='capitalize text-yellow-400'>{orderData.paymentDetails.method}</span>
              </div>
              <div className="flex justify-between">
                <span className='text-white'>Delivery Method</span>
                <span className="capitalize text-yellow-400">{orderData.deliveryDetails.deliveryMethod} Delivery</span>
              </div>
              <div className="flex justify-between">
                <span className='text-white'>Estimated Delivery</span>
                <span className='px-2 py-1 bg-blue-500/10 border border-blue-500 text-blue-500 text-xs rounded-full'>
                  {orderData.deliveryDetails.deliveryMethod === 'express' 
                    ? '1-2 business days' 
                    : '3-5 business days'}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Customer Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-blue-500">Customer Information</h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-semibold">
                    {orderData.customerDetails.firstName[0]}{orderData.customerDetails.lastName[0]}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-white">{orderData.customerDetails.firstName} {orderData.customerDetails.lastName}</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-200">
                <Mail className="h-4 w-4" />
                <span>{orderData.customerDetails.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-200">
                <Phone className="h-4 w-4" />
                <span>{orderData.customerDetails.phone}</span>
              </div>
              <div className="flex items-start space-x-3 text-sm text-gray-200">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className='capitalize'>
                  {orderData.deliveryDetails.address}<br />
                  {orderData.deliveryDetails.city}, {orderData.deliveryDetails.region}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl p-6 mt-8"
        >
          <h3 className="font-semibold text-blue-500 mb-3">What's Next?</h3>
          <div className="space-y-2 text-sm text-white/70">
            <p>• You will receive an order confirmation email shortly</p>
            <p>• We'll notify you when your order ships</p>
            <p>• You can track your order using your order ID</p>
            <p>• For any questions, contact our support team</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link
            to="/shop"
            className="bg-blue-600 text-white text-sm px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <Link
            to="/account?activeTab=orders"
            className="border border-yellow-600/20 text-white text-sm px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400/10 transition-colors text-center"
          >
            View Order History
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;