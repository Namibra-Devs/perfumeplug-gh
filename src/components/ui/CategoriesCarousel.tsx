// src/components/ui/CategoriesCarousel.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Crown, Sparkles, Gift, Droplets, Heart } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import { formatCategoryName } from '../../utils/searchUtils';

const CategoriesCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch products to extract categories
  const { products: allProducts, loading } = useProducts({
    page: 1,
    limit: 500,
  });

  // Extract categories with enhanced styling
  const categories = useMemo(() => {
    if (!allProducts || allProducts.length === 0) {
      return [];
    }

    const categoryMap = new Map<string, number>();
    allProducts.forEach(product => {
      if (product.category) {
        const cat = product.category.toLowerCase();
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
      }
    });

    // Category styling configuration
    const categoryStyles: Record<string, { icon: React.ReactNode; color: string; gradient: string; image: string }> = {
      'men': {
        icon: <Users className="h-6 w-6" />,
        color: 'from-blue-500 to-blue-600',
        gradient: 'from-blue-500/20 to-blue-600/20',
        image: '/categories/men.jpg'
      },
      'women': {
        icon: <Heart className="h-6 w-6" />,
        color: 'from-pink-500 to-pink-600',
        gradient: 'from-pink-500/20 to-pink-600/20',
        image: '/categories/women.jpg'
      },
      'unisex': {
        icon: <Sparkles className="h-6 w-6" />,
        color: 'from-purple-500 to-purple-600',
        gradient: 'from-purple-500/20 to-purple-600/20',
        image: '/categories/unisex.jpg'
      },
      'luxury': {
        icon: <Crown className="h-6 w-6" />,
        color: 'from-yellow-500 to-amber-600',
        gradient: 'from-yellow-500/20 to-amber-600/20',
        image: '/categories/luxury.jpeg'
      },
      'body-sprays': {
        icon: <Droplets className="h-6 w-6" />,
        color: 'from-green-500 to-green-600',
        gradient: 'from-green-500/20 to-green-600/20',
        image: '/categories/unisex.jpg'
      },
      'gift-sets': {
        icon: <Gift className="h-6 w-6" />,
        color: 'from-red-500 to-red-600',
        gradient: 'from-red-500/20 to-red-600/20',
        image: '/categories/unisex.jpg'
      }
    };

    return Array.from(categoryMap.entries())
      .map(([id, count]) => ({
        id,
        name: formatCategoryName(id),
        href: `/shop?category=${id}`,
        count,
        icon: categoryStyles[id]?.icon || <Sparkles className="h-6 w-6" />,
        color: categoryStyles[id]?.color || 'from-gray-500 to-gray-600',
        gradient: categoryStyles[id]?.gradient || 'from-gray-500/20 to-gray-600/20',
        image: categoryStyles[id]?.image || '/categories/unisex.jpg'
      }))
      .sort((a, b) => b.count - a.count);
  }, [allProducts]);

  // Create infinite loop by duplicating categories
  const infiniteCategories = useMemo(() => {
    if (categories.length === 0) return [];
    // Duplicate categories for infinite scroll effect
    return [...categories, ...categories, ...categories];
  }, [categories]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || infiniteCategories.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % infiniteCategories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, infiniteCategories.length]);

  // Navigation functions
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % infiniteCategories.length);
  };

  const goToPrev = () => {
    setCurrentIndex(prev => (prev - 1 + infiniteCategories.length) % infiniteCategories.length);
  };

  // Get visible categories for current view
  const getVisibleCategories = () => {
    if (infiniteCategories.length === 0) return [];
    
    const visibleCount = 4; // Show 4 categories at once on desktop
    const result = [];
    
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % infiniteCategories.length;
      result.push({ ...infiniteCategories[index], displayIndex: i });
    }
    
    return result;
  };

  if (loading) {
    return (
      <section className="bg-gradient-to-r from-black/95 to-yellow-700/95 py-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-32">
          <div className="text-center mb-12">
            <div className="h-8 bg-yellow-900/20 animate-pulse rounded-lg w-48 mx-auto mb-4"></div>
            <div className="h-4 bg-yellow-900/20 animate-pulse rounded w-64 mx-auto"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="bg-black/20 backdrop-blur-lg border border-yellow-600/20 rounded-2xl p-6 animate-pulse">
                <div className="aspect-square bg-yellow-900/20 rounded-xl mb-4"></div>
                <div className="h-4 bg-yellow-900/20 rounded mb-2"></div>
                <div className="h-3 bg-yellow-900/20 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  const visibleCategories = getVisibleCategories();

  return (
    <section className="bg-gradient-to-r from-black/95 to-yellow-700/95 py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black px-4 py-2 rounded-xl font-semibold mb-4 shadow-lg"
            >
              <Sparkles className="h-4 w-4" />
              <span className="text-sm uppercase tracking-wide">Shop by Category</span>
            </motion.div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Discover Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500"> Fragrance</span>
            </h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Explore our curated collections designed for every personality and occasion
            </p>
          </div>

          {/* Carousel Container */}
          <div 
            className="relative"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Navigation Buttons */}
            <button
              onClick={goToPrev}
              className="absolute left-0 -bottom-3 -translate-y-0 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Previous categories"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-0 -bottom-3 -translate-y-0 z-10 bg-black/50 backdrop-blur-sm hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Next categories"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6 px-4 md:px-12">
              <AnimatePresence mode="wait">
                {visibleCategories.map((category, index) => (
                  <motion.div
                    key={`${category.id}-${currentIndex}-${index}`}
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="group"
                  >
                    <Link
                      to={category.href}
                      className="block relative overflow-hidden rounded-2xl bg-black/20 backdrop-blur-lg border border-yellow-600/20 shadow-xl hover:shadow-2xl transition-all duration-300"
                    >
                      {/* Background Image */}
                      <div className="aspect-square relative overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/categories/unisex.jpg';
                          }}
                        />
                        
                        {/* Gradient Overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} to-black/60 group-hover:to-black/40 transition-all duration-300`} />
                        
                        {/* Icon */}
                        <div className="absolute top-4 right-4">
                          <div className={`w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            {category.icon}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-white font-bold text-lg mb-1 group-hover:text-yellow-300 transition-colors duration-300">
                            {category.name}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {category.count} product{category.count !== 1 ? 's' : ''}
                          </p>
                        </div>

                        {/* Hover Effect */}
                        <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-8 gap-2">
              {categories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex % categories.length
                      ? 'bg-yellow-400 w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to category ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>View All Products</span>
              <ChevronRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesCarousel;