// src/components/home/FeaturedProductsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import ProductGrid from '../product/ProductGrid';
import { useProducts } from '../../hooks/useProducts';

const FeaturedProductsSection: React.FC = () => {
  const { products, loading, error } = useProducts();
  
  // Only show the "View All Products" button when products are successfully loaded
  const shouldShowViewAllButton = !loading && !error && products && products.length > 0;

  return (
    <section className="bg-gradient-to-r from-black/95 to-yellow-700/95 py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col justify-center items-center gap-4 mb-8">
            <Badge delay={0.1}>
              Featured Products
            </Badge>
            <p className="text-white/70 mt-2 text-center">Curated selection of our most popular fragrances</p>
          </div>
          
          {/* Featured products list */}
          <ProductGrid />

          {/* View All Button - Only show when products are loaded successfully */}
          {shouldShowViewAllButton && (
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
                <span className='text-sm'>View All Products</span>
                <ChevronRight className="h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;
