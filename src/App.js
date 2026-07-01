import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import './App.css';
import TopBanner from './components/TopBanner/TopBanner';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import ProductShowcase from './components/ProductShowcase/ProductShowcase';
import ProductCarousel from './components/ProductCarousel/ProductCarousel';
import NewbornShowcase from './components/NewbornShowcase/NewbornShowcase';
import PromoCarousel from './components/PromoCarousel/PromoCarousel';
import ChettinadShowcase from './components/ChettinadShowcase/ChettinadShowcase';
import JablaShowcase from './components/JablaShowcase/JablaShowcase';
import ClearanceBanner from './components/ClearanceBanner/ClearanceBanner';
import BoysShowcase from './components/BoysShowcase/BoysShowcase';
import CottonFrockShowcase from './components/CottonFrockShowcase/CottonFrockShowcase';
import LovedByCustomers from './components/LovedByCustomers/LovedByCustomers';
import CustomerFavorites from './components/CustomerFavorites/CustomerFavorites';
import OurStores from './components/OurStores/OurStores';
import StoreQuality from './components/StoreQuality/StoreQuality';
import StoreFeatures from './components/StoreFeatures/StoreFeatures';
import Footer from './components/Footer/Footer';
import CartPage from './pages/CartPage/CartPage';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage';
import SignIn from './pages/signIn.js/signIn';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import OrderSuccessPage from './pages/OrderSuccessPage/OrderSuccessPage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
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
import { CartProvider } from './context/CartContext';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Simple wrapper for SignIn to handle navigation
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

// Wrapper for CategoryPage to force remount on category change
const CategoryPageWrapper = () => {
  const { categoryCode } = useParams();
  return <CategoryPage key={categoryCode} />;
};

const BottomSections = () => {
  const { pathname } = useLocation();
  // Hide StoreQuality and StoreFeatures on informational pages
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

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
          <TopBanner />
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <Hero />
                <ProductShowcase />
                <ProductCarousel />
                <NewbornShowcase />
                <PromoCarousel />
                <ChettinadShowcase />
                <JablaShowcase />
                <BoysShowcase />
                <ClearanceBanner />
                <CottonFrockShowcase />
                <LovedByCustomers  />
                <CustomerFavorites  />
                <OurStores />
              
                
              </>
            } />
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
      </Router>
    </CartProvider>
  );
}

export default App;
