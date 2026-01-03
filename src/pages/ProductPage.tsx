import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, ZoomIn, ChevronLeft, ChevronRight, User2, HeartOff } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Header from '../components/layout/Header';
import { useCart } from '../hooks/useCart';
import { useRelatedProducts } from '../hooks/useRelatedProducts';
import { getProduct } from '../services/productService';
import type { Product } from '../types/product';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch related products using the dedicated hook
  const { 
    relatedProducts, 
    loading: relatedLoading, 
    error: relatedError 
  } = useRelatedProducts({
    productId: id || '',
    category: product?.category,
    limit: 8
  });

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getProduct(id);
        setProduct(response.product);
      } catch (err: any) {
        console.error('Failed to fetch product:', err);
        setError(err.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p>Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Error Loading Product</h1>
          <p className="text-gray-300 mb-8">{error}</p>
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // If product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-300 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }



  // Mock reviews data
  const reviews = [
    {
      id: 1,
      name: 'Kwame Asante',
      rating: 5,
      date: '2024-01-15',
      comment: 'Amazing fragrance! Lasts all day and gets so many compliments.',
      verified: true
    },
    {
      id: 2,
      name: 'Abena Mensah',
      rating: 4,
      date: '2024-01-10',
      comment: 'Love the scent but wish it lasted a bit longer. Still great quality!',
      verified: true
    },
    {
      id: 3,
      name: 'Kofi Boateng',
      rating: 5,
      date: '2024-01-05',
      comment: 'Authentic product, fast delivery. Will definitely buy again!',
      verified: false
    }
  ];

  const handleImageZoom = (e: React.MouseEvent<HTMLImageElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // Get product images with fallback - prioritize ecommerce data
  const productImages = (() => {
    // First try ecommerce data images
    if (product.ecommerceData?.images && product.ecommerceData.images.length > 0) {
      const images = product.ecommerceData.images.map(img => ({
        url: img.url,
        altText: img.altText || product.name,
        isPrimary: img.isPrimary
      }));
      
      // Sort images to show primary image first
      return images.sort((a, b) => {
        if (a.isPrimary && !b.isPrimary) return -1;
        if (!a.isPrimary && b.isPrimary) return 1;
        return 0;
      });
    }
    // Fallback to legacy images field
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    // Final fallback
    return [{ url: '/placeholder-product.svg', altText: product.name }];
  })();

  //Handle Next image preview product
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  //Handle pevious image preview product
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  //Handle Add to Cart
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  //Increase Product Quantity
  const handleIncrease = () => {
    const newQuantity= quantity + 1;
    setQuantity(newQuantity);
    updateQuantity(product._id, newQuantity)
  };

  //Descrease Product Quantity
  const handleDecrease = () => {
    if(quantity > 1){
      const newQuantity = quantity - 1;
      setQuantity(newQuantity);
      updateQuantity(product._id, newQuantity);
    }
  };

  //Buy now instally add the items to cart "In state" and navigate directly to checkout page
  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to checkout page
    navigate("/checkout");
  };

  return (
    <>
      <Header 
        title={product.ecommerceData?.seoTitle || product.name} 
        descripton={product.ecommerceData?.seoDescription || product.description}
      />

      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="mx-auto px-6 sm:px-6 lg:px-32 py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-200 mb-8">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link to="/shop" className="hover:text-blue-600">Shop</Link>
            <span>›</span>
            <Link to={`/shop?category=${product.category}`} className="hover:text-blue-600 capitalize">
              {product.category}
            </Link>
            <span>›</span>
            <span className="text-yellow-400">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image with Zoom */}
              <div 
                className="relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden cursor-zoom-in"
                onDoubleClick={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleImageZoom}
              >
                <img
                  src={productImages[selectedImage]?.url || '/placeholder-product.svg'}
                  alt={productImages[selectedImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                  }}
                />
                
                {/* Zoom Indicator */}
                {showZoom && (
                  <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white" />
                  </div>
                )}

                {/* Zoom Preview */}
                {showZoom && (
                  <div className="absolute top-0 right-0 w-full h-full bg-white border border-gray-200 rounded-2xl overflow-hidden hidden lg:block">
                    <div 
                      className="w-[200%] h-[200%] bg-cover bg-no-repeat"
                      style={{
                        backgroundImage: `url(${productImages[selectedImage]?.url || '/placeholder-product.svg'})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                      }}
                    />
                  </div>
                )}

                {/* Navigation Arrows - only show if multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                     title='Previous'
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      title='Next'
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                      {selectedImage + 1} / {productImages.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery - only show if multiple images */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index ? 'border-yellow-500' : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image.url || '/placeholder-product.svg'}
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 text-white">
              <div>
                {(product?.brand || product?.category) && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">
                      {product.brand || product.category}
                    </span>
                    {product.ecommerceData?.displayOrder !== undefined && (
                      <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded-full text-xs">
                        Featured #{product.ecommerceData.displayOrder}
                      </span>
                    )}
                  </div>
                )}
                <h1 className="text-3xl md:text-4xl font-bold text-gray-50 mt-2">
                  {product.ecommerceData?.seoTitle || product.name}
                </h1>
                
                {/* SEO Description */}
                {product.ecommerceData?.seoDescription && (
                  <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                    {product.ecommerceData.seoDescription}
                  </p>
                )}

                {/* Product ID and timestamps */}
                <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                  <span>ID: {product._id.slice(-8)}</span>
                  {product.createdAt && (
                    <span>Added: {new Date(product.createdAt).toLocaleDateString()}</span>
                  )}
                  {product.sku && (
                    <span>SKU: {product.sku}</span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-green-500">₵{product.sellingPrice.toFixed(2)}</span>
                {product.originalPrice && product.sellingPrice < product.originalPrice && (
                  <span className="text-lg text-gray-300 line-through">₵{product.originalPrice.toFixed(2)}</span>
                )}
                {product.originalPrice && product.sellingPrice < product.originalPrice && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                    Save ₵{(product.originalPrice - product.sellingPrice).toFixed(2)}
                  </span>
                )}

              </div>

              {/* Product Details */}
              <div className="bg-black/10 backdrop-blur-lg border border-yellow-600/20 rounded-xl p-4 space-y-3">
                <h3 className="font-semibold text-yellow-400 mb-3">Product Details</h3>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Category:</span>
                      <span className="text-white font-medium capitalize">{product.category}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Brand:</span>
                      <span className="text-white font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">SKU:</span>
                      <span className="text-white font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Added:</span>
                      <span className="text-white font-medium">
                        {new Date(product.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {product.ecommerceData?.displayOrder !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Priority:</span>
                      <span className="text-white font-medium">#{product.ecommerceData.displayOrder}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity */}
              <div className='flex items-center gap-3'>
                <h3 className="font-semibold text-gray-300 mb-3">Quantity:</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDecrease}
                    className="w-10 h-10 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={handleIncrease}
                    className="w-10 h-10 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-gray-50 hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 text-sm group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  +
                </button>
                <button
                  onClick={handleBuyNow}
                  className="flex-1 border-2 border-yellow-600/20 text-sm text-center text-yellow-500 px-8 py-3 hover:bg-yellow-800/40 hover:text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Buy Now
                </button>

                {/* Wish button */}
                <button onClick={() => isInWishlist(product._id)
                  ? removeFromWishlist(product._id)
                  : addToWishlist(product)} title='Add wish list' className="w-12 h-12 bg-purple-600/20 border border-purple-500 rounded-lg flex items-center justify-center hover:border-orange-400 transition-colors">
                  {isInWishlist(product._id) ? <Heart size={24} className='text-white'/> : <HeartOff />}
                </button>
              </div>

              {/* Product Tags */}
              {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
                <div className="pt-4">
                  <h3 className="font-semibold text-gray-300 mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ecommerceData.tags.slice(0, 8).map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-full text-xs hover:bg-yellow-700/20 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                    {product.ecommerceData.tags.length > 8 && (
                      <span className="px-3 py-1 text-gray-400 text-xs">
                        +{product.ecommerceData.tags.length - 8} more
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm">
            {/* Tabs */}
            <div className="border-b border-yellow-600/20 text-white">
              <nav className="flex flex-wrap gap-x-3 md:gap-x-8 px-3 md:px-6">
                  <button
                    className="py-2 md:py-4 px-2 text-sm md:text-lg border-b-2 border-transparent hover:text-blue-600 transition-colors font-medium"
                  >
                    Description
                  </button>
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 text-white">
              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Information</h3>
                
                {/* Product Overview */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-3">Product Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Product Name:</span>
                        <span className="text-white font-medium">{product.name}</span>
                      </div>
                      {product.category && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Category:</span>
                          <span className="text-white font-medium capitalize">{product.category}</span>
                        </div>
                      )}
                      {product.brand && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Brand:</span>
                          <span className="text-white font-medium">{product.brand}</span>
                        </div>
                      )}
                      {product.sku && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">SKU:</span>
                          <span className="text-white font-medium">{product.sku}</span>
                        </div>
                      )}
                      {product.barcode && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Barcode:</span>
                          <span className="text-white font-medium">{product.barcode}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg p-4">
                    <h4 className="text-yellow-400 font-semibold mb-3">Pricing Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-300">Selling Price:</span>
                        <span className="text-green-400 font-bold">₵{product.sellingPrice.toFixed(2)}</span>
                      </div>
                      {product.originalPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Original Price:</span>
                          <span className="text-gray-400 line-through">₵{product.originalPrice.toFixed(2)}</span>
                        </div>
                      )}
                      {product.purchasePrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Purchase Price:</span>
                          <span className="text-white font-medium">₵{product.purchasePrice.toFixed(2)}</span>
                        </div>
                      )}
                      {product.wholesalePrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Wholesale Price:</span>
                          <span className="text-white font-medium">₵{product.wholesalePrice.toFixed(2)}</span>
                        </div>
                      )}
                      {product.originalPrice && product.sellingPrice < product.originalPrice && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">You Save:</span>
                          <span className="text-red-400 font-bold">₵{(product.originalPrice - product.sellingPrice).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Enhanced description from SEO data */}
                {product.ecommerceData?.seoDescription && (
                  <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="text-blue-400 font-semibold mb-2">Product Description</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {product.ecommerceData.seoDescription}
                    </p>
                  </div>
                )}

                {/* Enhanced description from image alt text if available */}
                {product.ecommerceData?.images?.find(img => img.isPrimary)?.altText && (
                  <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <h4 className="text-yellow-400 font-semibold mb-2">Detailed Features</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {product.ecommerceData.images.find(img => img.isPrimary)?.altText}
                    </p>
                  </div>
                )}
                
                {/* Basic description */}
                {product.description && (
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-2">Description</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
                  </div>
                )}

                {/* Inventory Information */}
                {product.inventory && (
                  <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <h4 className="text-green-400 font-semibold mb-3">Inventory Status</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div><span className={`px-3 py-1 rounded-full ${product.inventory.inStock === true ? 'bg-green-500/20' : 'bg-red-500/20'}`}>{product.inventory.inStock}</span></div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Stock Quantity:</span>
                        <span className="text-white font-medium">{product.inventory.available} units</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Track Inventory:</span>
                        <span className="text-white font-medium">{product.trackInventory ? 'Yes' : 'No'}</span>
                      </div>
                      {product.inventory.lowStock && (
                        <div className="flex justify-between">
                          <span className="text-gray-300">Low Stock Alert:</span>
                          <span className="text-white font-medium">{product.inventory.lowStock} units</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Product Tags as searchable keywords */}
                {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-yellow-400 font-semibold mb-3">Keywords & Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.ecommerceData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-xs border border-gray-600/30 hover:bg-yellow-600/20 transition-colors"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Timestamps */}
                <div className="mt-6 p-4 bg-gray-500/10 border border-gray-500/20 rounded-lg">
                  <h4 className="text-gray-400 font-semibold mb-3">Product History</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {product.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Added on:</span>
                        <span className="text-white font-medium">
                          {new Date(product.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                    {product.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-300">Last updated:</span>
                        <span className="text-white font-medium">
                          {new Date(product.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>   

              {/* Reviews */}
              <div className="mt-8">
                <h3 className="text-lg text-yellow-400 font-semibold mb-6">Customer Reviews</h3>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b pb-6 last:border-b-0 border-yellow-600/20">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 border-2 border-yellow-400/20 rounded-full flex items-center justify-center text-yellow-400"><User2 size={20}/> </div>
                          <div>
                            <div className="font-semibold">{review.name}</div>
                            {review.verified && (
                              <span className="text-xs text-white bg-purple-400/40 px-2 py-1 rounded">Verified Purchase</span>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-200">{review.date}</div>
                      </div>
                      <div className="flex items-center space-x-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 text-sm">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-300 mb-8">
              Related Products
              {product?.category && (
                <span className="text-lg text-gray-400 font-normal ml-2">
                  in {product.category.replace('-', ' ')}
                </span>
              )}
            </h2>
            
            {relatedLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-xl p-4 animate-pulse">
                    <div className="aspect-square bg-yellow-900/20 rounded-lg mb-4"></div>
                    <div className="h-4 bg-yellow-900/20 rounded mb-2"></div>
                    <div className="h-3 bg-yellow-900/20 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : relatedError ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Unable to load related products</p>
                <p className="text-gray-500 text-sm">{relatedError}</p>
              </div>
            ) : relatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-2">No related products found</p>
                <p className="text-gray-500 text-sm">
                  {product?.category 
                    ? `No other products in the ${product.category.replace('-', ' ')} category`
                    : 'Try browsing our shop for more products'
                  }
                </p>
                <Link 
                  to="/shop" 
                  className="inline-block mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductPage;