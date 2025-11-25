import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, HeartOff } from 'lucide-react';

import { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product & { _id: string; sellingPrice: number };
  viewMode?: 'grid' | 'list';
  key?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid', key: cardKey }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist  } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        key={cardKey}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
      >
        <div className="block">
          <div className="flex">
            <div className="w-36 min-h-full relative">
              <img
                src={product.images[0]?.url}
                alt={product.images[0]?.altText || product.name}
                className="w-full h-full object-cover rounded-l-xl"
              />

              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => isInWishlist(product._id)
                ? removeFromWishlist(product._id)
                : addToWishlist(product)}
                className="absolute top-3 left-3 p-1 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
              >
                {isInWishlist(product._id) ? <Heart size={18} className='text-red-500 '/> : <HeartOff size={18} className='text-gray-400' />}
              </motion.button>
            </div>
            
            <Link to={`/product/${product._id}`} className="flex-1 p-6 bg-white">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {product?.brand}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-sm mt-2">{product.name}</h3>
                </div>

              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-gray-900">₵{product.sellingPrice.toFixed(2)}</span>
                  {product.wholesalePrice && (
                    <span className="text-sm text-gray-500 line-through">₵{product.wholesalePrice.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    {/* <span className="text-sm text-gray-600">{product.rating}</span> */}
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-gradient-to-r from-black to-yellow-700 text-white py-2 px-6 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-colors flex items-center justify-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </motion.div>
    );
  }

  // Gr_id View (original implementation)
  return (
    <motion.div
      key={cardKey}
      transition={{ duration: 0.3 }}
      className="max-h-[420px] group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="block h-full">
        <div className="relative overflow-h_idden rounded-t-xl">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={product.images[0]?.url}
            alt={product.images[0]?.altText || product.name}
            className="w-full h-56 object-cover"
          />
          {product.wholesalePrice && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold"
            >
              Save ₵{(product.wholesalePrice - product.sellingPrice).toFixed(2)}
            </motion.span>
          )}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => isInWishlist(product._id)
            ? removeFromWishlist(product._id)
            : addToWishlist(product)}
            className="absolute top-3 right-3 p-1 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
             {isInWishlist(product._id) ? <Heart size={18} className='text-red-500 '/> : <HeartOff size={18} className='text-gray-400' />}
          </motion.button>
        </div>
        
        <Link to={`/product/${product._id}`}>
        <div className="p-4 bg-white rounded-b-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {product?.brand}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              {/* <span className="text-sm text-gray-600">{product.rating}</span> */}
            </div>
          </div>
          
          <Link to={`/product/${product._id}`} className="font-semibold text-gray-900 mb-3 line-clamp-2 text-xs md:text-sm leading-tight">
            {product.name}
          </Link>
          
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs md:text-sm font-bold text-gray-900">₵{product.sellingPrice.toFixed(2)}</span>
              {product.wholesalePrice && (
                <span className="text-xs md:text-sm text-gray-500 line-through">₵{product.wholesalePrice.toFixed(2)}</span>
              )}
            </div>
            {/* <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.size}</span> */}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-black to-yellow-700 text-white py-2 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-colors flex items-center justify-center"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </motion.button>
        </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;