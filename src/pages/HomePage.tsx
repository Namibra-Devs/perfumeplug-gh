import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import CategoriesCarousel from '../components/ui/CategoriesCarousel';
import {
  FeaturedProductsSection,
  LimitedTimeOfferSection,
  TestimonialsCarousel,
  NewsletterSection
} from '../components/home';

const HomePage: React.FC = () => {
  return (
    <div className="">
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