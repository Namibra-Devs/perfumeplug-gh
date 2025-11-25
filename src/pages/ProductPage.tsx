import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
import { Star, Heart, ShoppingCart, Truck, Shield, ZoomIn, ChevronLeft, ChevronRight, User2, HeartOff } from 'lucide-react';
import ProductCard from '../components/product/ProductCard';
import Header from '../components/layout/Header';
import { useCart } from '../hooks/useCart';
import { useProducts } from '../hooks/useProducts';

const ProductPage: React.FC = () => {
  const { id } = useParams();
  const { addToCart, updateQuantity, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('100ml');
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { products, error } = useProducts();

  console.log(error);

  // Find product by ID
  const product = products.find(p => p._id === id);

  // If product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
          <Link to="/shop" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Related products (same category, excluding current product)
  const relatedProducts = products
    .filter(p => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  // Size options
  const sizeOptions = [
    { value: '50ml', price: product.sellingPrice * 0.6 },
    { value: '100ml', price: product.sellingPrice },
    { value: '150ml', price: product.sellingPrice * 1.4 }
  ];

  const selectedPrice = sizeOptions.find(size => size.value === selectedSize)?.price || product.sellingPrice;

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

  //Handle Next image preview product
  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % product.images.length);
  };

  //Handle pevious image preview product
  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + product.images.length) % product.images.length);
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
      <Header title={product.name} descripton={product.description}/>

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
                  src={product.images[selectedImage].url}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                        backgroundImage: `url(${product.images[selectedImage].url})`,
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`
                      }}
                    />
                  </div>
                )}

                {/* Navigation Arrows */}
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
                  {selectedImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-yellow-500' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6 text-white">
              <div>
                <span className="text-yellow-400 font-semibold">{product?.brand}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-50 mt-2">{product.name}</h1>
                
                {/* Rating */}
                {/* <div className="flex items-center space-x-2 mt-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-200 text-sm">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div> */}
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-green-500">₵{selectedPrice.toFixed(2)}</span>
                {product.sellingPrice && selectedPrice < product.sellingPrice && (
                  <span className="text-sm text-gray-300 line-through">₵{product.sellingPrice.toFixed(2)}</span>
                )}
                {product.sellingPrice && selectedPrice < product.sellingPrice && (
                  <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-semibold">
                    Save ₵{(product.sellingPrice - selectedPrice).toFixed(2)}
                  </span>
                )}
              </div>

              {/* Size Options */}
              <div>
                <h3 className="font-semibold text-gray-300 mb-3">Select Size:</h3>
                <div className="flex gap-3">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => setSelectedSize(size.value)}
                      className={`px-4 md:px-6 py-3 border-2 rounded-lg transition-all ${
                        selectedSize === size.value
                          ? 'bg-black/20 backdrop-blur-lg border-2 border-yellow-400 text-white'
                          : 'border border-yellow-600/20 text-yellow-400 hover:border-yellow-700'
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-semibold">{size.value}</div>
                        <div className="text-sm">₵{size.price.toFixed(2)}</div>
                      </div>
                    </button>
                  ))}
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

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6">
                <div className="text-center">
                  <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-50">Free Shipping</div>
                </div>
                <div className="text-center">
                  <Shield className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-50">Authentic Guarantee</div>
                </div>
                <div className="text-center">
                  <span className="text-lg">📦</span>
                  <div className="text-sm text-gray-50">Easy Returns</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="bg-black/20 backdrop-blur-lg border border-yellow-500/20 rounded-2xl shadow-sm">
            {/* Tabs */}
            <div className="border-b border-yellow-600/20 text-white">
              <nav className="flex flex-wrap gap-x-3 md:gap-x-8 px-3 md:px-6">
                {['Description', 'Fragrance Notes', 'Reviews', 'Shipping'].map((tab) => (
                  <button
                    key={tab}
                    className="py-2 md:py-4 px-2 text-sm md:text-lg border-b-2 border-transparent hover:text-blue-600 transition-colors font-medium"
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6 text-white">
              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                <p className="text-gray-300 leading-relaxed text-sm">{product.description}</p>
              </div>

              {/* Fragrance Notes */}
              {/* <div className="mt-8">
                <h3 className="text-lg text-yellow-400 font-semibold mb-6">Fragrance Notes</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-blue-600 font-semibold mb-2">Top Notes</div>
                    <div className="text-sm text-gray-600">
                      {product.fragranceNotes.top.join(', ')}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-green-600 font-semibold mb-2">Middle Notes</div>
                    <div className="text-sm text-gray-600">
                      {product.fragranceNotes.middle.join(', ')}
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-purple-600 font-semibold mb-2">Base Notes</div>
                    <div className="text-sm text-gray-600">
                      {product.fragranceNotes.base.join(', ')}
                    </div>
                  </div>
                </div>
              </div> */}

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
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-300 mb-8">Related Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct._id} product={relatedProduct} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductPage;