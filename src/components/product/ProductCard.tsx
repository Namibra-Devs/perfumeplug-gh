import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingCart, HeartOff, Tag, Calendar } from 'lucide-react';

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

  // Calculate savings
  const savings = product.originalPrice && product.sellingPrice < product.originalPrice 
    ? product.originalPrice - product.sellingPrice 
    : 0;

  if (viewMode === 'list') {
    return (
      <motion.div
        key={cardKey}
        whileHover={{ x: 5 }}
        transition={{ duration: 0.2 }}
        className="rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex bg-white">
          <div className="w-36 md:w-48 min-h-full relative">
            <img
              src={productImage.url || '/placeholder-product.svg'}
              alt={productImage.altText || product.name}
              className="w-full h-full object-cover rounded-l-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/placeholder-product.svg';
              }}
            />

            {savings > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold"
              >
                Save ₵{savings.toFixed(2)}
              </motion.span>
            )}

            <motion.button 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleWishlistToggle}
              className="absolute top-2 right-2 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
            >
              {isInWishlist(product._id) ? 
                <Heart size={18} className='text-red-500 fill-current' /> : 
                <HeartOff size={18} className='text-gray-400' />
              }
            </motion.button>
          </div>
          
          <div className="flex-1 p-4 md:p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className='flex items-center gap-2 mb-2'>
                  {product?.brand && (
                    <span className="text-xs md:text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      {product.brand}
                    </span>
                  )}
                  {product?.category && (
                    <span className="text-xs md:text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded capitalize">
                      {product.category}
                    </span>
                  )}
                  {product.sku && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      SKU: {product.sku}
                    </span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 text-sm md:text-base mb-1 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{product.name}</h3>
                {product.ecommerceData?.seoTitle && product.ecommerceData.seoTitle !== product.name && (
                  <p className="text-xs text-gray-600 mb-2">{product.ecommerceData.seoTitle}</p>
                )}
              </div>

              <div className="flex items-center space-x-1 ml-4">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600">4.5</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-xs md:text-sm mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {product.ecommerceData?.seoDescription || product.description || 'Premium quality perfume with long-lasting fragrance.'}
            </p>

            {/* Product Tags */}
            {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.ecommerceData.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    <Tag size={10} />
                    {tag}
                  </span>
                ))}
                {product.ecommerceData.tags.length > 3 && (
                  <span className="text-xs text-gray-500">+{product.ecommerceData.tags.length - 3} more</span>
                )}
              </div>
            )}

            {/* Product Info */}
            <div className="flex items-center gap-4 mb-3 text-xs text-gray-500">
              {product.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={12} />
                  <span>Added {new Date(product.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {product._id && (
                <span>ID: {product._id.slice(-6)}</span>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg md:text-xl font-bold text-gray-900">₵{product.sellingPrice.toFixed(2)}</span>
                {product.originalPrice && product.sellingPrice < product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through">₵{product.originalPrice.toFixed(2)}</span>
                )}
                {product.wholesalePrice && (
                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    Wholesale: ₵{product.wholesalePrice.toFixed(2)}
                  </span>
                )}
              </div>
       
              <button
                onClick={handleAddToCart}
                className="w-full md:w-auto bg-gradient-to-r from-black to-yellow-700 hover:from-gray-800 hover:to-yellow-600 text-white py-2 px-4 md:px-6 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // Grid View (enhanced implementation)
  return (
    <motion.div
      key={cardKey}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="max-h-[480px] group rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
      onClick={handleCardClick}
    >
      <div className="h-full flex flex-col">
        <div className="relative overflow-hidden rounded-t-xl">
          <motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            src={productImage.url || '/placeholder-product.svg'}
            alt={productImage.altText || product.name}
            className="w-full h-48 md:h-56 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-product.svg';
            }}
          />
          
          {savings > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 bg-red-500 text-white px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold"
            >
              Save ₵{savings.toFixed(2)}
            </motion.span>
          )}

          {product.ecommerceData?.displayOrder !== undefined && product.ecommerceData.displayOrder < 5 && (
            <span className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              Featured
            </span>
          )}
          
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-1 md:p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors"
          >
            {isInWishlist(product._id) ? 
              <Heart size={18} className='text-red-500 fill-current' /> : 
              <HeartOff size={18} className='text-gray-400' />
            }
          </motion.button>
        </div>
        
        <div className="p-3 md:p-4 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {product?.brand && (
                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {product.brand}
                </span>
              )}
              {product?.category && (
                <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded capitalize">
                  {product.category}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="h-3 w-3 md:h-4 md:w-4 text-yellow-400 fill-current" />
              <span className="text-xs md:text-sm text-gray-600">4.5</span>
            </div>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 overflow-hidden text-xs md:text-sm leading-tight flex-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {product.name}
          </h3>

          {/* Product metadata */}
          <div className="flex items-center gap-2 mb-2 text-xs text-gray-500">
            {product.sku && (
              <span className="bg-gray-100 px-2 py-1 rounded">SKU: {product.sku}</span>
            )}
            {product.createdAt && (
              <span>Added {new Date(product.createdAt).toLocaleDateString()}</span>
            )}
          </div>

          {/* Product Tags */}
          {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {product.ecommerceData.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
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
          
          <div className="flex flex-col items-start justify-between mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm md:text-base font-bold text-gray-900">₵{product.sellingPrice.toFixed(2)}</span>
              {product.originalPrice && product.sellingPrice < product.originalPrice && (
                <span className="text-xs md:text-sm text-gray-500 line-through">₵{product.originalPrice.toFixed(2)}</span>
              )}
            </div>
            {product.wholesalePrice && (
              <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                Wholesale: ₵{product.wholesalePrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-black to-yellow-700 hover:from-gray-800 hover:to-yellow-600 text-white py-2 md:py-3 rounded-lg text-xs md:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 mt-auto"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;