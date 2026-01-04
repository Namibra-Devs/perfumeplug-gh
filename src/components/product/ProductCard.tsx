import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, HeartOff, Tag, Zap } from 'lucide-react';

import { Product } from '../../types/product';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product & { _id: string; sellingPrice: number };
  viewMode?: 'grid' | 'list';
  key?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid', key: cardKey }) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  // Get product image with fallback
  const productImage = (() => {
    if (product.ecommerceData?.images && product.ecommerceData.images.length > 0) {
      const primaryImage = product.ecommerceData.images.find(img => img.isPrimary);
      return primaryImage || product.ecommerceData.images[0];
    }
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    return { url: '/placeholder-product.svg', altText: product.name };
  })();

  // Calculate savings and discount percentage
  const savings = product.originalPrice && product.sellingPrice < product.originalPrice 
    ? product.originalPrice - product.sellingPrice 
    : 0;
  
  const discountPercentage = product.originalPrice && savings > 0
    ? Math.round((savings / product.originalPrice) * 100)
    : 0;

  // Check if product is featured
  const isFeatured = product.ecommerceData?.displayOrder !== undefined && product.ecommerceData.displayOrder < 5;

  if (viewMode === 'list') {
    return (
      <motion.div
        key={cardKey}
        whileHover={{ x: 5, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
        transition={{ duration: 0.2 }}
        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-white border border-gray-100"
        onClick={handleCardClick}
      >
        <div className="flex h-40 md:h-48">
          <div className="w-40 md:w-56 relative flex-shrink-0">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={productImage.url || '/placeholder-product.svg'}
              alt={productImage.altText || product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.svg';
              }}
            />

            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <motion.div 
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: -12 }}
                className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg"
              >
                -{discountPercentage}%
              </motion.div>
            )}

            {/* Featured Badge */}
            {isFeatured && !discountPercentage && (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1"
              >
                <Zap size={10} />
                Featured
              </motion.div>
            )}

            {/* Wishlist Button */}
            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
            >
              {isInWishlist(product._id) ? 
                <Heart size={16} className='text-red-500 fill-current' /> : 
                <HeartOff size={16} className='text-gray-400 hover:text-red-400' />
              }
            </motion.button>

            {/* Rating Overlay - Bottom of Image */}
            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
              <div className="flex items-center space-x-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-xs text-white ml-1">(4.5)</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
            <div>
              {/* Category and Brand Tags */}
              <div className='flex items-center gap-2 mb-3'>
                {product?.category && (
                  <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full capitalize">
                    {product.category}
                  </span>
                )}
                {product?.brand && (
                  <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                    {product.brand}
                  </span>
                )}
              </div>

              {/* Product Name */}
              <h3 className="font-bold text-gray-900 text-base md:text-lg mb-2 line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                {product.ecommerceData?.seoDescription || product.description || 'Premium quality perfume with long-lasting fragrance.'}
              </p>

              {/* Product Tags */}
              {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {product.ecommerceData.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border"
                    >
                      <Tag size={10} />
                      {tag}
                    </span>
                  ))}
                  {product.ecommerceData.tags.length > 3 && (
                    <span className="text-xs text-gray-500 px-2 py-1">+{product.ecommerceData.tags.length - 3} more</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              {/* Price Section */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xl md:text-2xl font-bold text-gray-900">₵{product.sellingPrice.toFixed(2)}</span>
                  {product.originalPrice && product.sellingPrice < product.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₵{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                {product.wholesalePrice && (
                  <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full w-fit">
                    Bulk: ₵{product.wholesalePrice.toFixed(2)}
                  </span>
                )}
                {savings > 0 && (
                  <span className="text-xs text-green-600 font-medium mt-1">
                    You save ₵{savings.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Add to Cart Button */}
              <div className="flex flex-col items-end gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="bg-gradient-to-r from-black to-yellow-700 hover:from-gray-800 hover:to-yellow-600 text-white py-2 px-6 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View - Fixed Height Design
  return (
    <motion.div
      key={cardKey}
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
      className="h-[400px] sm:h-[420px] group rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white border border-gray-100"
      onClick={handleCardClick}
    >
      <div className="h-full flex flex-col">
        {/* Image Section - Fixed Height */}
        <div className="relative h-44 sm:h-48 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.4 }}
            src={productImage.url || '/placeholder-product.svg'}
            alt={productImage.altText || product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.svg';
            }}
          />
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <motion.div 
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: -12 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-lg z-10"
            >
              -{discountPercentage}%
            </motion.div>
          )}

          {/* Featured Badge */}
          {isFeatured && !discountPercentage && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 px-2 py-1 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1 z-10"
            >
              <Zap size={10} />
              Featured
            </motion.div>
          )}
          
          {/* Wishlist Button */}
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200 z-10"
          >
            {isInWishlist(product._id) ? 
              <Heart size={16} className='text-red-500 fill-current' /> : 
              <HeartOff size={16} className='text-gray-400 hover:text-red-400' />
            }
          </motion.button>

          {/* Rating Overlay - Bottom of Image */}
          <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1 z-10">
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-xs text-white ml-1">(4.5)</span>
            </div>
          </div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
        
        {/* Content Section - Optimized for Mobile */}
        <div className="flex-1 p-3 sm:p-4 flex flex-col">
          {/* Category and Brand Tags */}
          <div className="flex items-center gap-1 sm:gap-2 mb-2 min-h-[20px]">
            {product?.category && (
              <span className="text-xs font-medium text-purple-700 bg-purple-100 px-2 py-1 rounded-full capitalize">
                {product.category}
              </span>
            )}
            {product?.brand && (
              <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
                {product.brand}
              </span>
            )}
          </div>
          
          {/* Product Name - Fixed Height */}
          <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-tight mb-2 line-clamp-2 h-8 sm:h-10 flex items-start">
            {product.name}
          </h3>

          {/* Product Tags - Limited and Responsive */}
          {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2 min-h-[16px]">
              {product.ecommerceData.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs border"
                >
                  <Tag size={8} />
                  {tag}
                </span>
              ))}
              {product.ecommerceData.tags.length > 2 && (
                <span className="text-xs text-gray-500">+{product.ecommerceData.tags.length - 2}</span>
              )}
            </div>
          )}

          {/* SKU - Mobile Optimized */}
          {product.sku && (
            <div className="mb-2">
              <span className="text-xs text-gray-400">#{product.sku.slice(-4)}</span>
            </div>
          )}
          
          {/* Price Section - Fixed at Bottom with Mobile Optimization */}
          <div className="mt-auto">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <span className="text-sm sm:text-lg font-bold text-gray-900">₵{product.sellingPrice.toFixed(2)}</span>
                  {product.originalPrice && product.sellingPrice < product.originalPrice && (
                    <span className="text-xs sm:text-sm text-gray-500 line-through">₵{product.originalPrice.toFixed(2)}</span>
                  )}
                </div>
                {savings > 0 && (
                  <span className="text-xs text-green-600 font-medium">
                    Save ₵{savings.toFixed(2)}
                  </span>
                )}
              </div>
            </div>

            {/* Wholesale Price - Mobile Optimized */}
            {product.wholesalePrice && (
              <div className="mb-2">
                <span className="text-xs text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
                  Bulk: ₵{product.wholesalePrice.toFixed(2)}
                </span>
              </div>
            )}
            
            {/* Add to Cart Button - Mobile Optimized */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              className="w-full bg-gradient-to-r from-black to-yellow-700 hover:from-gray-800 hover:to-yellow-600 text-white py-2 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;