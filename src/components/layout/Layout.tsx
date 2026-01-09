import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import ScrollToTop from '../ui/ScrollToTop';
import { AlertCartItems } from '../cart/AlertCartItems';
import { StructuredData, organizationStructuredData, websiteStructuredData, storeStructuredData } from '../seo';
import GoogleAnalytics from '../analytics/GoogleAnalytics';
import { seoConfig } from '../../config/seo';
import { useCart } from '../../hooks/useCart';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { showAlertCart, setShowAlertCart } = useCart();
  const location = useLocation();

  // Routes where footer should be hidden
  const hideFooterRoutes = [
    '/account',
    '/checkout',
    '/cart',
    '/order-confirmation',
    '/payment/callback'
  ];

  // Check if current route should hide footer
  const shouldHideFooter = hideFooterRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  //Close alert function
  const handleCloseAlert = () => {
    setShowAlertCart(false);
  };

  return (
    <>
      {/* Google Analytics */}
      <GoogleAnalytics trackingId={seoConfig.analytics.googleAnalyticsId} />
      
      {/* Global Structured Data */}
      <StructuredData data={organizationStructuredData} />
      <StructuredData data={websiteStructuredData} />
      <StructuredData data={storeStructuredData} />
      
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        {!shouldHideFooter && <Footer />}
      </div>

      {/* Only show alert when state is true */}
      {showAlertCart && <AlertCartItems onClose={handleCloseAlert} />}
      
      {/* Scroll to Top Button - Available on all routes */}
      <ScrollToTop />
    </>
  );
};

export default Layout;
