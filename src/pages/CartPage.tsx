import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Header from '../components/layout/Header';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm p-8">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/shop"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Start Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <Header title='Cart Page' descripton="Check listed cart item"/>
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto  px-6 sm:px-6 lg:px-32 py-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{items.length} item(s) in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm"
            >
              {/* Cart Header */}
              <div className="border-b border-gray-200 p-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <motion.div
                    key={`${item.product.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6"
                  >
                    <div className="flex space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product.id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">{item.product.brand}</p>
                        <p className="text-sm text-gray-600">{item.product.size}</p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-3 mt-3">
                          <span className="text-sm text-gray-600">Quantity:</span>
                          <div className="flex items-center space-x-2">
                            <button
                              title="Reduce"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-8 text-center font-semibold">{item.quantity}</span>
                            <button
                              title="Add"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-col items-end space-y-2">
                        <span className="text-lg font-semibold text-gray-900">
                          ₵{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded transition-colors"
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
              className="bg-white rounded-2xl shadow-sm sticky top-24"
            >
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>₵{getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>₵{(getTotalPrice() * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₵{(getTotalPrice() * 1.05).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link
                    to="/checkout"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                  <Link
                    to="/shop"
                    className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center block"
                  >
                    Continue Shopping
                  </Link>
                </div>

                {/* Security Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-gray-500">
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