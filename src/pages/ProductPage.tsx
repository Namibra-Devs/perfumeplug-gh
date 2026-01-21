import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, HeartOff, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Header from '../components/layout/Header';
import { SEOHead } from '../components/seo';
import { generateProductSEO } from '../utils/seo';
import { seoConfig } from '../config/seo';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { getProduct, fetchProducts } from '../services/productService';
import type { Product } from '../types/product';
import { Badge } from '../components/ui/Badge';

// Define inventory interface to fix TypeScript errors
interface InventoryData {
  available: number;
  inStock: boolean;
  lowStock: boolean;
  criticalStock: boolean;
}

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist, canAddToCart } = useCart();
  const toast = useToast();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [inventory, setInventory] = useState<InventoryData | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const navigate = useNavigate();

  // Early return if no product ID
  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Invalid Product</h1>
          <p className="text-gray-300 mb-8">No product ID provided.</p>
          <Link to="/shop" className="bg-blue-600 text-sm text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await getProduct(id);
        setProduct(response.product);
        
        // Handle inventory data from the actual API response structure
        // The API returns: { success, message, data: { product, inventory } }
        // But our service only returns { product }
        // We need to make a direct API call to get inventory data
        try {
          const fullResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/ecommerce/products/${id}`, {
            headers: {
              'X-Frontend-Domain': import.meta.env.VITE_TENANT_DOMAIN || 'www.perfume-plug.com'
            }
          });
          const fullData = await fullResponse.json();
          
          if (fullData.success && fullData.data?.inventory) {
            setInventory(fullData.data.inventory);
          }
        } catch (inventoryError) {
          console.error('Failed to fetch inventory data:', inventoryError);
          // Continue without inventory data
        }
        
        // Fetch related products if we have a category
        if (response.product?.category) {
          setRelatedLoading(true);
          try {
            const relatedResponse = await fetchProducts({
              category: response.product.category,
              limit: 8
            });
            
            // Filter out current product and limit to 4
            const filtered = relatedResponse.products
              .filter(p => p._id !== id)
              .slice(0, 4);
            
            setRelatedProducts(filtered);
          } catch (relatedError) {
            console.error('Failed to fetch related products:', relatedError);
            setRelatedProducts([]);
          } finally {
            setRelatedLoading(false);
          }
        }
        
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
          <Link to="/shop" className="bg-blue-600 text-sm text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
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
          <Link to="/shop" className="bg-blue-600 text-sm text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Get product images - simplified version
  const productImages = product.ecommerceData?.images && product.ecommerceData.images.length > 0 
    ? product.ecommerceData.images 
    : product.images && product.images.length > 0 
    ? product.images 
    : [{ url: '/placeholder-product.svg', altText: product.name }];

  // Simple handlers
  const handleAddToCart = () => {
    if (!product) return;

    // Check stock availability
    const stockCheck = canAddToCart(product);
    
    for (let i = 0; i < quantity; i++) {
      const checkBeforeAdd = canAddToCart(product);
      if (!checkBeforeAdd.canAdd) {
        toast.error(checkBeforeAdd.reason || 'Cannot add more items');
        break;
      }
      addToCart(product);
    }
    
    if (stockCheck.canAdd) {
      toast.success(`Added ${quantity} item(s) to cart`);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  // Generate SEO data
  const seo = product ? generateProductSEO(product) : null;

  return (
    <>
      {seo && <SEOHead seo={seo} canonical={`${seoConfig.baseUrl}/product/${id}`} />}
      <Header 
        title={product.name} 
        descripton={product.description}
      />

      <div className="min-h-screen bg-gradient-to-r from-black/95 to-yellow-700/95">
        <div className="mx-auto px-6 sm:px-6 lg:px-32 py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-xs md:text-sm text-gray-200 mb-8">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span>›</span>
            <Link to="/shop" className="hover:text-blue-600">Shop</Link>
            <span>›</span>
            {product.category && (
              <>
                <Link to={`/shop?category=${product.category}`} className="hover:text-blue-600 capitalize">
                  {product.category}
                </Link>
                <span>›</span>
              </>
            )}
            <span className="text-yellow-400">{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square bg-white rounded-2xl shadow-sm overflow-hidden">
                <img
                  src={productImages[selectedImage]?.url || '/placeholder-product.svg'}
                  alt={productImages[selectedImage]?.altText || product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/placeholder-product.svg';
                  }}
                />

                {/* Navigation Arrows - only show if multiple images */}
                {productImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
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
                {product.category && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-400 font-semibold text-sm uppercase tracking-wide">
                      {product.category}
                    </span>
                  </div>
                )}
                <h1 className="text-3xl md:text-3xl font-semibold capitalize text-gray-50 mt-2">
                  {product.name}
                </h1>
                
                {product.description && (
                  <p className="text-gray-300 mt-3 text-sm leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold text-green-500">₵{product.sellingPrice.toFixed(2)}</span>
                {product.originalPrice && product.sellingPrice < product.originalPrice && (
                  <>
                    <span className="text-lg text-gray-300 line-through">₵{product.originalPrice.toFixed(2)}</span>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                      Save ₵{(product.originalPrice - product.sellingPrice).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              {/* Inventory Status */}
              {inventory && (
                <div className="bg-black/10 backdrop-blur-lg border border-yellow-600/20 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <Package className="h-5 w-5 text-yellow-400" />
                    <h3 className="font-semibold text-yellow-400">Stock Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      {inventory.inStock ? (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      <span className="text-gray-300">Status:</span>
                      <span className={`font-medium ${inventory.inStock ? 'text-green-400' : 'text-red-400'}`}>
                        {inventory.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-300">Available:</span>
                      <span className="text-white font-medium">{inventory.available || 0} units</span>
                    </div>
                    
                    {inventory.lowStock && (
                      <div className="col-span-2 flex items-center gap-2 text-orange-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Low stock warning</span>
                      </div>
                    )}
                    
                    {inventory.criticalStock && (
                      <div className="col-span-2 flex items-center gap-2 text-red-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm">Critical stock level</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className='flex items-center gap-3'>
                <h3 className="font-semibold text-gray-300 mb-3">Quantity:</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    className="w-10 h-10 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 bg-black/20 backdrop-blur-lg border border-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center hover:bg-yellow-700/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddToCart}
                  disabled={inventory ? !inventory.inStock : false}
                  className="flex-1 text-sm group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-2 md:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  <span className='hidden md:flex'>
                    {inventory && !inventory.inStock ? 'Out of Stock' : 'Add to Cart'}
                  </span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={inventory ? !inventory.inStock : false}
                  className="flex-1 border-2 border-yellow-600/20 text-sm text-center text-yellow-500 px-8 py-2 md:py-3 hover:bg-yellow-800/40 hover:text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-yellow-500"
                >
                  {inventory && !inventory.inStock ? 'Unavailable' : 'Buy Now'}
                </button>

                {/* Wishlist button */}
                <button 
                  onClick={() => isInWishlist(product._id) ? removeFromWishlist(product._id) : addToWishlist(product)} 
                  className="w-12 h-12 bg-yellow-600/80 border-2 border-yellow-600/20 rounded-lg flex items-center justify-center transition-colors"
                >
                  {isInWishlist(product._id) ? 
                      <Heart size={24} className='text-red-500 fill-current' /> : 
                      <HeartOff size={24} className='text-white' />
                  }
                </button>
              </div>
            </div>
          </div>

          {/* Enhanced Product Details */}
          <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Product Information</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Basic Details */}
              <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-3">Product Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Name:</span>
                    <span className="text-white font-medium">{product.name || 'N/A'}</span>
                  </div>
                  {product.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Category:</span>
                      <span className="text-white font-medium capitalize">{product.category}</span>
                    </div>
                  )}
                  {product.sku && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">SKU:</span>
                      <span className="text-white font-medium">{product.sku}</span>
                    </div>
                  )}
                  {product.brand && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Brand:</span>
                      <span className="text-white font-medium">{product.brand}</span>
                    </div>
                  )}
                  {product.ecommerceData?.tags && product.ecommerceData.tags.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Tags:</span>
                      <span className="text-white font-medium">{product.ecommerceData.tags.slice(0, 2).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-3">Pricing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Price:</span>
                    <span className="text-green-400 font-bold">₵{product.sellingPrice.toFixed(2)}</span>
                  </div>
                  {product.originalPrice && product.originalPrice > product.sellingPrice && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Original Price:</span>
                        <span className="text-gray-400 line-through">₵{product.originalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">You Save:</span>
                        <span className="text-red-400 font-bold">₵{(product.originalPrice - product.sellingPrice).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Discount:</span>
                        <span className="text-red-400 font-bold">
                          {Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)}% OFF
                        </span>
                      </div>
                    </>
                  )}
                  {product.wholesalePrice && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Bulk Price:</span>
                      <span className="text-blue-400 font-medium">₵{product.wholesalePrice.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Availability & Stock */}
              <div className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-lg p-4">
                <h4 className="text-yellow-400 font-semibold mb-3">Availability</h4>
                <div className="space-y-2 text-sm">
                  {inventory ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Status:</span>
                        <div className="flex items-center gap-2">
                          {inventory.inStock ? (
                            <CheckCircle className="h-4 w-4 text-green-400" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={`font-medium ${inventory.inStock ? 'text-green-400' : 'text-red-400'}`}>
                            {inventory.inStock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-300">Available:</span>
                        <span className="text-white font-medium">
                          {inventory.available > 0 ? `${inventory.available} units` : 'Not available'}
                        </span>
                      </div>
                      {inventory.lowStock && (
                        <div className="flex items-center gap-2 text-orange-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">Limited stock remaining</span>
                        </div>
                      )}
                      {inventory.criticalStock && (
                        <div className="flex items-center gap-2 text-red-400">
                          <AlertTriangle className="h-4 w-4" />
                          <span className="text-sm">Very low stock - order soon!</span>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Stock Info:</span>
                      <span className="text-gray-400">Contact us for availability</span>
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
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Shipping:</span>
                    <span className="text-green-400 font-medium">Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {product.description && product.description.trim() && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <h4 className="text-blue-400 font-semibold mb-2">Description</h4>
                <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
              </div>
            )}

            {/* SEO Information */}
            {product.ecommerceData && (product.ecommerceData.seoTitle || product.ecommerceData.seoDescription || (product.ecommerceData.tags && product.ecommerceData.tags.length > 0)) && (
              <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <h4 className="text-purple-400 font-semibold mb-3">Additional Information</h4>
                
                {product.ecommerceData.seoTitle && (
                  <div className="mb-2">
                    <span className="text-gray-300 text-sm">SEO Title: </span>
                    <span className="text-white text-sm">{product.ecommerceData.seoTitle}</span>
                  </div>
                )}
                
                {product.ecommerceData.seoDescription && (
                  <div className="mb-2">
                    <span className="text-gray-300 text-sm">SEO Description: </span>
                    <span className="text-white text-sm">{product.ecommerceData.seoDescription}</span>
                  </div>
                )}
                
                {product.ecommerceData.tags && product.ecommerceData.tags.length > 0 && (
                  <div>
                    <span className="text-gray-300 text-sm">Tags: </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.ecommerceData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-purple-600/20 text-purple-300 rounded text-xs"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Related Products Section */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <div className="text-center mb-12">
                <Badge delay={0.1}>
                  Related Products
                </Badge>
                <p className="text-gray-300">
                  Discover more products from the same category
                </p>
              </div>

              {relatedLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div key={idx} className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl p-6 animate-pulse">
                      <div className="aspect-square bg-yellow-900/20 rounded-xl mb-4"></div>
                      <div className="h-4 bg-yellow-900/20 rounded mb-2"></div>
                      <div className="h-3 bg-yellow-900/20 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                  {relatedProducts.map((relatedProduct) => (
                    <ProductCard
                      key={relatedProduct._id}
                      product={relatedProduct}
                    />
                  ))}
                </div>
              )}

              {/* View More Button */}
              {product.category && (
                <div className="text-center mt-12">
                  <Link
                    to={`/shop?category=${product.category}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                  >
                    View More in {product.category}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;