import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '../components/layout/Header';
import { useCart } from '../hooks/useCart';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const handleGoBack = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // Fallback to shop page if no history
      navigate('/shop');
    }
  };

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
            
            <ShoppingBag className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-300 mb-2">Your cart is empty</h1>
            <p className="text-gray-300 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="text-sm group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 justify-center gap-2 inline-flex items-center"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header title='Cart Page' descripton="Check listed cart item"/>
    <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
      <div className="mx-auto px-6 sm:px-6 lg:px-32 py-20">
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

        {/* Header */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-200">Shopping Cart</h1>
          <p className="text-gray-300 mt-2">{items.length} item(s) in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl shadow-sm"
            >
              {/* Cart Header */}
              <div className="border-b border-yellow-600/20 px-6 py-3">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-yellow-400">Cart Items</h2>
                  <button
                   title='Clear cart'
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-yellow-600/20">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product._id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 md:p-6"
                  >
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 md:w-20 h-16 md:h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product._id}`}
                          className="text-sm font-semibold text-gray-300 hover:text-blue-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        {/* <p className="text-xs text-gray-300 mt-1">{item.product.brand}</p>
                        <p className="text-xs text-gray-300">{item.product.size}</p> */}
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 md:gap-3 mt-1">
                          <span className="text-sm text-gray-300">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              title="Reduce"
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-4 text-center font-semibold text-yellow-400">{item.quantity}</span>
                            <button
                              title="Add"
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="w-8 h-8 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-700/20"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-sm md:text-lg font-semibold text-gray-300">
                          ₵{(item.product.sellingPrice * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product._id)}
                          className="p-2 bg-black/20 backdrop-blur-lg border border-yellow-400/20 text-red-600 hover:text-red-700 rounded transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm sticky top-24"
            >
              <div className="p-6 text-white">
                <h2 className="text-lg font-semibold mb-4 text-yellow-400">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₵{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="border-t border-yellow-600/20 pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₵{(getTotalPrice() * 1.05).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full text-sm group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 "
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/shop"
                    className="w-full border-2 border-yellow-600/20 rounded-lg text-sm text-center text-yellow-500 px-8 py-3 font-semibold hover:bg-yellow-800/40 hover:text-white transition-colors block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-yellow-600/20">
                  <div className="flex items-center justify-center space-x-4 text-gray-300">
                    <div className="text-center">
                      <div className="text-2xl">🔒</div>
                      <div className="text-xs mt-1">Secure Checkout</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">🚚</div>
                      <div className="text-xs mt-1">Free Shipping</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl">↩️</div>
                      <div className="text-xs mt-1">Easy Returns</div>
                    </div>
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

export default CartPage;