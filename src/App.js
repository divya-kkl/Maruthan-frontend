import React, { useEffect } from 'react';
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

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="App">
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
          </Routes>
          <StoreQuality />
          <StoreFeatures />
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
