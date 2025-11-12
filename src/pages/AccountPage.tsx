import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, Heart, MapPin, CreditCard, LogOut, Edit, Plus, Trash2} from 'lucide-react';
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../context/CartContext';
import Header from '../components/layout/Header';
import { Link, useLocation } from 'react-router-dom';
import { Product } from '../types/index';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  region: string;
  phone: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile-money';
  last4: string;
  network?: string;
  isDefault: boolean;
}

type TabType = 'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments';

const AccountPage: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'addresses' | 'payments'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const {wishlist, removeFromWishlist, addToCart, orders} = useCart();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('activeTab');

    // Only set tab if it's one of the valid ones
    const validTabs: TabType[] = ['profile', 'orders', 'wishlist', 'addresses', 'payments'];
    if (tabParam && validTabs.includes(tabParam as TabType)) {
      setActiveTab(tabParam as TabType);
    }
  }, [location.search]);

  // Mock data
  // const orders: Order[] = [
  //   {
  //     id: 'PP123456',
  //     date: '2024-01-15',
  //     status: 'delivered',
  //     items: [
  //       { name: 'Bleu de Chanel Eau de Parfum', quantity: 1, price: 450.00, image: '/1.jpg' },
  //       { name: 'Miss Dior Blooming Bouquet', quantity: 1, price: 380.00, image: '/1.jpg' }
  //     ],
  //     total: 830.00,
  //     trackingNumber: 'GH123456789'
  //   },
  //   {
  //     id: 'PP123457',
  //     date: '2024-01-10',
  //     status: 'shipped',
  //     items: [
  //       { name: 'Sauvage Eau de Toilette', quantity: 1, price: 420.00, image: '/1.jpg' }
  //     ],
  //     total: 420.00,
  //     trackingNumber: 'GH987654321'
  //   },
  //   {
  //     id: 'PP123458',
  //     date: '2024-01-05',
  //     status: 'confirmed',
  //     items: [
  //       { name: 'Black Opium Eau de Parfum', quantity: 2, price: 390.00, image: '/1.jpg' }
  //     ],
  //     total: 780.00
  //   }
  // ];

  const addresses: Address[] = [
    {
      id: '1',
      name: 'Home',
      street: '123 Main Street, East Legon',
      city: 'Accra',
      region: 'Greater Accra',
      phone: '+233 12 345 6789',
      isDefault: true
    },
    {
      id: '2',
      name: 'Work',
      street: '456 Business Avenue, Airport City',
      city: 'Accra',
      region: 'Greater Accra',
      phone: '+233 50 123 4567',
      isDefault: false
    }
  ];

  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      isDefault: true
    },
    {
      id: '2',
      type: 'mobile-money',
      last4: '1234',
      network: 'MTN',
      isDefault: false
    }
  ];

  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    // In real app, this would update via API
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  if (!isAuthenticated || !user) {
    return <LoginRegisterSection />;
  }

  return (
    <>
      <Header title='My Account' descripton='Account details'/>
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="px-6 sm:px-6 lg:px-32 py-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-purple-600">My Account</h1>
            <p className="text-sm text-gray-300">Welcome back, {user.firstName}!</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar */}
            <div className="">
              <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6 sticky top-24">
                {/* User Info */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-purple-600">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>
                </div>
                
                {/* Navigation */}
                <nav className="space-y-1">
                  {[
                    { id: 'profile' as const, name: 'Profile Information', icon: User },
                    { id: 'orders' as const, name: 'Order History', icon: Package },
                    { id: 'wishlist' as const, name: 'Wishlist', icon: Heart },
                    { id: 'addresses' as const, name: 'Saved Addresses', icon: MapPin },
                    { id: 'payments' as const, name: 'Payment Methods', icon: CreditCard },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full text-left text-sm px-3 py-3 rounded-lg transition-colors flex items-center space-x-3 ${
                        activeTab === item.id
                          ? 'bg-yellow-600/20 text-purple-600 font-medium'
                          : 'text-gray-50 hover:bg-yellow-600/10'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </button>
                  ))}
                  
                  <button
                    onClick={logout}
                    className="w-full text-left text-sm px-3 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-3 mt-4"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {/* Profile Information */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-semibold text-purple-600">Profile Information</h2>
                      {!isEditing && (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Edit Profile</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <form onSubmit={handleProfileUpdate} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              First Name *
                            </label>
                            <input
                              title="First Name"
                              type="text"
                              value={profileData.firstName}
                              onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Last Name *
                            </label>
                            <input
                              title='Last Name'
                              type="text"
                              value={profileData.lastName}
                              onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Email Address *
                            </label>
                            <input
                            title='Email'
                              type="email"
                              value={profileData.email}
                              onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={profileData.phone}
                              onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                              className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                              placeholder="+233 XX XXX XXXX"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-3 pt-4">
                          <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                          >
                            Save Changes
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditing(false)}
                            className="px-6 py-2 border-2 border-yellow-600/20 text-sm text-center text-yellow-500 hover:bg-yellow-800/40 hover:text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            First Name:
                          </label>
                          <p className="text-gray-300">{profileData.firstName}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Last Name:
                          </label>
                          <p className="text-gray-300">{profileData.lastName}</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address:
                          </label>
                          <p className="text-gray-300">{profileData.email}</p>
                        </div>
                        {profileData.phone && (
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                              Phone Number:
                            </label>
                            <p className="text-gray-300">{profileData.phone}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Order History */}
                {activeTab === 'orders' && (
                  <motion.div
                    key="orders"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm"
                  >
                    <div className="p-6 border-b border-yellow-600/20">
                      <h2 className="text-xl font-semibold text-purple-600">Order History</h2>
                      <p className="text-gray-300 mt-1">View and track your orders</p>
                    </div>
                    
                    <div className="divide-y divide-yellow-600/20">
                      {orders.map((order) => (
                        <div key={order.id} className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="font-semibold text-purple-600">Order #{order.id}</div>
                              <div className="text-sm text-gray-300">Placed on {new Date(order.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold text-white">₵{order.total.toFixed(2)}</div>
                              <div className={`text-sm capitalize px-2 py-1 ${
                                order.status === 'delivered' ? 'text-green-400 rounded-full text-xs bg-green-700/20 border border-green-600/40' :
                                order.status === 'shipped' ? 'text-blue-400 rounded-full text-xs bg-blue-700/20 border border-blue-600/40' :
                                order.status === 'confirmed' ? 'text-orange-400 rounded-full text-xs bg-orange-700/20 border border-orange-600/40' : 'rounded-full text-xs bg-yellow-500/20 border border-yellow-500/40 text-yellow-500'
                              }`}>
                                {order.status}
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div key={index} className="flex items-center space-x-3">
                                <div>
                                  <Link to={`/product${item.product.id}`}><img src={item.product.images[0]} alt={item.product.name} className="w-12 h-12 object-cover rounded" /></Link>
                                </div>
                                <div className="flex-1">
                                  <Link to={`/product${item.product.id}`} className="font-medium text-sm leading-tight text-white">{item.product.name}</Link>
                                  <div className="text-sm text-gray-300">Qty: {item.quantity}</div>
                                </div>
                                <div className="text-sm font-semibold text-white">₵{item.product.price.toFixed(2)}</div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-between items-center mt-4">
                            {order.trackingNumber && (
                              <div className="text-sm text-yellow-400">
                                Tracking: <span className="font-mono">{order.trackingNumber}</span>
                              </div>
                            )}
                            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3">
                              <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium text-left md:text-center">
                                View Details
                              </button>
                              <button className="text-blue-600 hover:text-blue-700 text-xs md:text-sm font-medium text-left md:text-center">
                                Reorder
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Wishlist */}
                {activeTab === 'wishlist' && (
                  <motion.div
                    key="wishlist"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm"
                  >
                    <div className="p-6 border-b border-yellow-600/20">
                      <h2 className="text-xl font-semibold text-purple-600">Wishlist</h2>
                      <p className="text-gray-300 mt-1">Your saved items</p>
                    </div>
                    
                    <div className="grid lg:grid-cols-1 gap-4 p-6">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex flex-col md:flex-row items-start justify-between gap-4 p-2 bg-black/20 rounded-lg">
                          <div className='flex items-start justify-between gap-2'>
                            <img src={item.images[0]} alt={item.name} className="w-16 h-16 object-cover rounded" />
                            <div className="flex-1">
                              <div className="text-xs md:text-sm font-semibold text-white">{item.name}</div>
                              <div className='flex flex-col md:flex-row itemsc-enter gap-2'>
                                <span className="text-xs md:text-sm text-gray-300">{item.brand}</span>
                                <span className="text-xs md:text-sm font-semibold text-blue-600">₵{item.price.toFixed(2)}</span>
                              </div>
                              
                              <div className={`text-xs w-fit ${item.inStock ? 'text-green-400 rounded-full px-2 py-1 text-xs bg-green-700/20 border border-green-600/40' : 'text-red-400 rounded-full px-2 py-1 text-xs bg-red-700/20 border border-red-600/40'}`}>
                                {item.inStock ? 'In Stock' : 'Out of Stock'}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <button onClick={() => removeFromWishlist(item.id)} title="Delete item" className="w-8 h-8 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-red-600 rounded-lg flex items-center justify-center  hover:bg-yellow-700/20 hover:text-red-500 transition-colors">
                              <Trash2 className="h-4 w-4" />
                            </button>
                            <button onClick={() => handleAddToCart(item)} title='Add to cart' className="w-8 h-8 bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg flex items-center justify-center text-white text-sm md:text-xs hover:bg-yellow-700/20 transition-colors">
                              <Plus className="h-4 w-4"/>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Saved Addresses */}
                {activeTab === 'addresses' && (
                  <motion.div
                    key="addresses"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm"
                  >
                    <div className="p-6 border-b border-yellow-600/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h2 className="text-xl font-semibold text-purple-600">Saved Addresses</h2>
                        <p className="text-gray-300 mt-1">Manage your delivery addresses</p>
                      </div>
                      <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Address
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6 p-6">
                      {addresses.map((address) => (
                        <div key={address.id} className="border border-yellow-600/20 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div className="font-semibold text-white">{address.name}</div>
                            {address.isDefault && (
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 text-sm text-gray-300">
                            <p>{address.street}</p>
                            <p>{address.city}, {address.region}</p>
                            <p>{address.phone}</p>
                          </div>
                          <div className="flex space-x-3 mt-4">
                            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                            {!address.isDefault && (
                              <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                            )}
                            {!address.isDefault && (
                              <button className="text-green-600 hover:text-green-700 text-sm">Set as Default</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Payment Methods */}
                {activeTab === 'payments' && (
                  <motion.div
                    key="payments"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm"
                  >
                    <div className="p-6 border-b border-yellow-600/20 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h2 className="text-xl font-semibold text-purple-600">Payment Methods</h2>
                        <p className="text-gray-300 mt-1">Manage your saved payment methods</p>
                      </div>
                      <button className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Add New Method
                      </button>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      {paymentMethods.map((method) => (
                        <div key={method.id} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-2 border border-yellow-600/20 rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-8 rounded flex items-center justify-center">
                              {method.type === 'card' ? (
                                <img src="/creditcard.jpeg" alt="Credit Card"/>
                              ) : (
                                <div className='inline-flex'>
                                  <img src="/momo.png" alt="Mobile Money"/>
                                </div>
                              )}
                            </div>
                            <div className='flex items-start justify-between gap-3'>
                              <div>
                                <div className="text-sm font-semibold capitalize text-yellow-400">
                                  {method.type === 'card' ? 'Credit Card' : `${method.network} Mobile Money`}
                                </div>
                                <div className="text-sm text-gray-300">
                                  {method.type === 'card' ? `•••• ${method.last4}` : `•••• ${method.last4}`}
                                </div>
                              </div>
                              {method.isDefault && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Default</span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-3">
                            <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                            {!method.isDefault && (
                              <button className="text-red-600 hover:text-red-700 text-sm">Remove</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Login/Register Section (same as before, but extracted)
const LoginRegisterSection: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await register({ ...formData });
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
      <div className="max-w-md w-full p-6 relative z-50">
        <div className="bg-black/10 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-xl px-4 py-6">
          <div className="text-center mb-6">
            <div className='flex items-center justify-center pb-4 '><img src="/favicon.png" alt="PP" className='w-28 ' /></div>
            <h1 className="text-xl font-bold text-purple-600">
              {isLogin ? 'Sign In to Your Account' : 'Create New Account'}
            </h1>
            <p className="text-gray-300 mt-2 text-sm">
              {isLogin ? 'Enter your credentials to access your account' : 'Join us to start shopping'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">
                    First Name *
                  </label>
                  <input
                    title='First Name'
                    type="text"
                    required={!isLogin}
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-yellow-400 mb-1">
                    Last Name *
                  </label>
                  <input
                    title="Last Name"
                    type="text"
                    required={!isLogin}
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-1">
                Email Address *
              </label>
              <input
                title='Email'
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-yellow-400 mb-1">
                Password *
              </label>
              <input
                title="Password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-yellow-400 mb-1">
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2.5 bg-transparent text-white text-sm placeholder:text-gray-300 border border-yellow-600/20 rounded-lg outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  placeholder="+233 XX XXX XXXX"
                />
              </div>
            )}
            
            <button
              type="submit"
              className=" w-full group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-sm rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>

      <div className='inset-0 absolute flex items-center justify-center'><img src="/favicon.png" alt="PP" className='w-28' /></div>
    </div>
  );
};

export default AccountPage;