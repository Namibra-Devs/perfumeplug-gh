import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import CategoriesCarousel from '../components/ui/CategoriesCarousel';
import { SEOHead } from '../components/seo';
import { defaultSEO } from '../utils/seo';
import { seoConfig } from '../config/seo';
import {
  FeaturedProductsSection,
  LimitedTimeOfferSection,
  TestimonialsCarousel,
  NewsletterSection
} from '../components/home';

const HomePage: React.FC = () => {
  const seo = {
    ...defaultSEO,
    title: `${seoConfig.siteName} - Premium Fragrances & Perfumes Online`,
    description: 'Discover authentic designer perfumes, luxury fragrances, and body sprays at PerfumePlug Ghana. Free shipping on orders over ₵200. Shop men\'s, women\'s & unisex perfumes with fast delivery.',
  };

  return (
    <div className="">
      <SEOHead seo={seo} canonical={seoConfig.baseUrl} />
      <Navbar />

      {/* 1. Categories Carousel */}
      <CategoriesCarousel />

      {/* 2. Featured Products Section */}
      <FeaturedProductsSection />

      {/* 3. Limited-time Offers Section */}
      <LimitedTimeOfferSection />

      {/* 4. Customer Testimonials Carousel */}
      <TestimonialsCarousel />

      {/* 5. Newsletter Signup Section */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;