
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/common/ScrollToTop';
import ErrorBoundary from './components/common/ErrorBoundary';
import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AccountPage from './pages/AccountPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import PaymentCallback from './pages/PaymentCallback';
import NotFoundPage from './pages/NotFoundPage';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <HelmetProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <ScrollToTop />
              <ErrorBoundary>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/payment/callback" element={<PaymentCallback />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                    <Route path="/account" element={<AccountPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    {/* 404 Catch-all route - must be last */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </Layout>
              </ErrorBoundary>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}

export default App;