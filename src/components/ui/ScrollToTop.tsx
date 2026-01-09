import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  // Routes where scroll to top should be available
  const showScrollToTopRoutes = [
    '/',
    '/shop',
    '/about',
    '/contact',
    '/privacy-policy',
    '/terms-of-service',
    '/product/:id',
  ];

  // Check if current route should show scroll to top
  const shouldShowScrollToTop = showScrollToTopRoutes.some(route => 
    location.pathname === route || location.pathname.startsWith(route)
  );

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Don't render if not on a route that should show scroll to top
  if (!shouldShowScrollToTop) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-3 sm:p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
          aria-label="Scroll to top"
        >
          <ChevronUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default ScrollToTop;