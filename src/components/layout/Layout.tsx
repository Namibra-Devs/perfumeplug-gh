import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';
import { AlertCartItems } from '../cart/AlertCartItems';
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
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        {!shouldHideFooter && <Footer />}
      </div>

      {/* Only show alert when state is true */}
      {showAlertCart && <AlertCartItems onClose={handleCloseAlert} />}
    </>
  );
};

export default Layout;
