import React, { useEffect, useRef, useState } from 'react';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';
import { AlertCartItems } from '../cart/AlertCartItems';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { items } = useCart();
  const [showAlertCart, setShowAlertCart] = useState(false);

  // Store previous item count
  const prevCount = useRef(items.length);

  useEffect(() => {
    // Only show alert if item count increased (i.e. item added)
    if (items.length > prevCount.current) {
      setShowAlertCart(true);
    }
    prevCount.current = items.length;
  }, [items.length]);

  //Close alert after 6 seconds
  useEffect(() => {
    if (showAlertCart) {
      const timer = setTimeout(() => setShowAlertCart(false), 9000);
      return () => clearTimeout(timer);
    }
  }, [showAlertCart]);

  //Close alert function
  const handleCloseAlert = () => {
    setShowAlertCart(false);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>

      {/* Only show alert when state is true */}
      {showAlertCart && <AlertCartItems onClose={handleCloseAlert} />}
    </>
  );
};

export default Layout;
