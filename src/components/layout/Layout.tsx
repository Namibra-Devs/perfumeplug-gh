import React from 'react';
import Footer from './Footer';
import { AlertCartItems } from '../cart/AlertCartItems';
import { useCart } from '../../hooks/useCart';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { showAlertCart, setShowAlertCart } = useCart();

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
