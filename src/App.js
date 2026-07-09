import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import TopBanner from './components/TopBanner/TopBanner';
import Header from './components/Header/Header';
import StoreQuality from './components/StoreQuality/StoreQuality';
import StoreFeatures from './components/StoreFeatures/StoreFeatures';
import Footer from './components/Footer/Footer';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import SignIn from './pages/signIn.js/signIn';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import HomePage from './pages/HomePage/HomePage';
import OrderStatusPage from './pages/OrderStatusPage/OrderStatusPage';
import PaymentPage from './pages/PaymentPage/PaymentPage';
import ExchangePage from './pages/ExchangePage/ExchangePage';
import ShippingPage from './pages/ShippingPage/ShippingPage';
import CancellationPage from './pages/CancellationPage/CancellationPage';
import AboutUsPage from './pages/AboutUsPage/AboutUsPage';
import ContactPage from './pages/ContactUsPage/ContactPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage/TermsPage';
import WhatsAppFloat from './components/WhatsAppFloat/WhatsAppFloat';

import OurStoresPage from './pages/OurStoresPage/OurStoresPage';
import ProductPage from './pages/ProductPage/ProductPage';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};


const SignInWrapper = () => {
  const navigate = useNavigate();
  return (
    <SignIn 
      onBack={() => navigate(-1)} 
      onSignIn={() => navigate('/')} 
      onGuest={() => navigate('/')} 
    />
  );
};


const CategoryPageWrapper = () => {
  const { categoryCode } = useParams();
  return <CategoryPage key={categoryCode} />;
};

const BottomSections = () => {
  const { pathname } = useLocation();

  if (pathname === '/order-status' || pathname === '/payment' || pathname === '/exchange' || pathname === '/shipping' || pathname === '/cancellation' || pathname === '/about-us' || pathname === '/contact-us' || pathname === '/privacy-policy' || pathname === '/terms') {
    return null;
  }
  return (
    <>
      <StoreQuality />
      <StoreFeatures />
    </>
  );
};

let appHasLoadedOnce = false;

function App() {
  const [globalLoading, setGlobalLoading] = useState(() => {
    return !appHasLoadedOnce;
  });

  useEffect(() => {
    if (appHasLoadedOnce) return;
    const timer = setTimeout(() => {
      setGlobalLoading(false);
      appHasLoadedOnce = true;
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="App">
          {globalLoading && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#fff',
              zIndex: 99999,
              overflow: 'hidden'
            }}>
              {/* Header Skeleton */}
              <div className="shimmer-card" style={{ width: '100%', height: '80px', marginBottom: '0' }}></div>
              
              {/* Hero/Page Skeleton */}
              <div className="shimmer-card" style={{ width: '100%', height: '60vh', marginBottom: '40px' }}></div>
              
              {/* Grid Skeleton */}
              <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
                  <div className="shimmer-text title" style={{ width: '300px', height: '32px', marginBottom: '10px' }}></div>
                  <div className="shimmer-text" style={{ width: '400px', height: '20px' }}></div>
                </div>
                <div style={{ display: 'flex', gap: '20px' }}>
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="shimmer-card" style={{ flex: 1, height: '350px', borderRadius: '8px' }}>
                      <div className="shimmer-image" style={{ height: '60%', marginBottom: '15px' }}></div>
                      <div style={{ padding: '0 15px' }}>
                        <div className="shimmer-text title"></div>
                        <div className="shimmer-text price"></div>
                        <div className="shimmer-button" style={{ marginTop: '20px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div style={{ opacity: globalLoading ? 0 : 1, transition: 'opacity 0.4s ease-in-out' }}>
            <TopBanner />
            <Header />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
              <Route path="/order-details/:orderId" element={<OrderSuccessPage />} />
              <Route path="/product/:id" element={<ProductPage />} />
              <Route path="/categories/:categoryCode" element={<CategoryPageWrapper />} />
              <Route path="/stores" element={<OurStoresPage />} />
              <Route path="/login" element={<SignInWrapper />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/order-status" element={<OrderStatusPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/exchange" element={<ExchangePage />} />
              <Route path="/shipping" element={<ShippingPage />} />
              <Route path="/cancellation" element={<CancellationPage />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/contact-us" element={<ContactPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />
            </Routes>
            <BottomSections />
            <Footer />
          <WhatsAppFloat />
        </div>
      </div>
    </Router>
  );
}

export default App;
