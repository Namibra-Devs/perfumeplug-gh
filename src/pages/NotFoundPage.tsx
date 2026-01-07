import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, ShoppingBag } from 'lucide-react';
import { SEOHead } from '../components/seo';
import { generateSEO } from '../utils/seo';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  const seo = generateSEO({
    title: '404 - Page Not Found | Perfume Plug',
    description: 'The page you are looking for could not be found. Browse our collection of authentic perfumes and fragrances.',
    keywords: ['404', 'page not found', 'perfume shop', 'fragrance store']
  });

  return (
    <>
      <SEOHead seo={seo} />
      
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="relative">
              {/* Large 404 Text */}
              <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500 leading-none">
                404
              </h1>
              
              {/* Floating Elements */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20"
              />
              
              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                  rotate: [0, -5, 5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -bottom-4 -left-4 w-12 h-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-full opacity-20"
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-300 text-lg mb-2">
              The page you're looking for seems to have vanished into thin air.
            </p>
            <p className="text-gray-400 text-sm">
              Don't worry, even the best perfumes sometimes get lost in the mix!
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            {/* Go Home Button */}
            <Link
              to="/"
              className="group flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Home className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Go Home
            </Link>

            {/* Go Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-3 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 hover:bg-yellow-700/20 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Go Back
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl p-6"
          >
            <h3 className="text-white font-semibold mb-4">Maybe you're looking for:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/shop"
                className="group flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-yellow-700/20 transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Browse All Products</span>
              </Link>
              
              <Link
                to="/shop?category=designer"
                className="group flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-yellow-700/20 transition-all duration-300"
              >
                <Search className="h-4 w-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm">Popular Categories</span>
              </Link>
              
              <Link
                to="/about"
                className="group flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-yellow-700/20 transition-all duration-300"
              >
                <div className="h-4 w-4 bg-yellow-400 rounded-full group-hover:scale-110 transition-transform" />
                <span className="text-sm">About Us</span>
              </Link>
              
              <Link
                to="/contact"
                className="group flex items-center gap-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-yellow-700/20 transition-all duration-300"
              >
                <div className="h-4 w-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full group-hover:scale-110 transition-transform" />
                <span className="text-sm">Contact Support</span>
              </Link>
            </div>
          </motion.div>

          {/* Fun Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8"
          >
            <p className="text-gray-500 text-xs italic">
              "Like a rare fragrance, some pages are meant to be discovered by chance." 🌸
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;