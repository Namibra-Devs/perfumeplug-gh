// src/components/home/FeaturedProductsSection.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import ProductGrid from '../product/ProductGrid';

const FeaturedProductsSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-black/95 to-yellow-700/95 py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-32">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:items-center mb-8">
            <div>
              <Badge delay={0.1}>
                Featured Products
              </Badge>
              <p className="text-white/70 mt-2">Curated selection of our most popular fragrances</p>
            </div>
            <Link to="/shop" className="text-white hover:text-white/50 font-medium flex items-center">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
          
          {/* Featured products list */}
          <ProductGrid />
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;