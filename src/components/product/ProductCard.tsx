import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, HeartOff } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist  } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      >
        <Link to={`/product/${product.id}`} className="block">
          <div className="flex">
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-l-xl"
              />
            </div>
            
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    {product.brand}
                  </span>
                  <h3 className="font-semibold text-gray-900 text-lg mt-2">{product.name}</h3>
                </div>
                <button title='Heart' className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Heart className="h-4 w-4 text-gray-600" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-gray-900">₵{product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₵{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{product.rating}</span>
                  </div>
                  <button
                    onClick={handleAddToCart}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid View (original implementation)
  return (
    <motion.div
      transition={{ duration: 0.3 }}
      className="min-h-[420px] group rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="block">
        <div className="relative overflow-hidden rounded-t-xl">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={product.images[0]}
            alt={product.name}
            className="w-full h-56 object-cover"
          />
          {product.originalPrice && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
            >
              Save ₵{(product.originalPrice - product.price).toFixed(2)}
            </motion.span>
          )}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => isInWishlist(product.id)
                  ? removeFromWishlist(product.id)
                  : addToWishlist(product)}
            className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
             {isInWishlist(product.id) ? <Heart size={20} className='text-red-500 '/> : <HeartOff className='text-gray-400' />}
          </motion.button>
        </div>
        
        <Link to={`/product/${product.id}`}>
        <div className="p-4 bg-white rounded-b-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
              {product.brand}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600">{product.rating}</span>
            </div>
          </div>
          
          <Link to={`/product/${product.id}`} className="font-semibold text-gray-900 mb-3 line-clamp-2 text-sm leading-tight">
            {product.name}
          </Link>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-gray-900">₵{product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₵{product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">{product.size}</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-black to-yellow-700 text-white py-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center"
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