import React, { useState, useEffect } from 'react';
import { FiSearch, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import './Header.css';

import { MdKeyboardArrowDown } from 'react-icons/md';
import { useNavigate, NavLink, Link } from 'react-router-dom';
import SearchDrawer from '../SearchDrawer/SearchDrawer';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/Slice/headerSlice';


const Header = () => {
  const dispatch = useDispatch()
  const { categories, loading } = useSelector((state) => state.category)
  const { cartItems } = useSelector((state) => state.cart);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories())
  }, [dispatch]);

  return (
    <header className="site-header">
      <div className="header-container">
        <button className="mobile-menu-btn icon-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
     
        <div className="header-logo">
          <Link to="/">
            <img src="/images/log1.png" alt="Little RR" className="logo-image" />
          </Link>
        </div>

        <nav className="header-nav">
          <ul className="nav-list">
            <li className="nav-item">
              <NavLink to="/" end>Home</NavLink>
            </li>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <li className="nav-item" key={`shimmer-nav-${i}`}>
                  <div className="header-shimmer-item skeleton-shimmer"></div>
                </li>
              ))
            ) : (
              categories.map((category) => (
                <li className="nav-item" key={category.id}>
                  <NavLink to={`/categories/${category.code}`}>
                    {category.name}
                    {category.subCategories && category.subCategories.length > 0 && (
                      <MdKeyboardArrowDown className="nav-arrow" />
                    )}
                  </NavLink>
                </li>
              ))
            )}
            <li className="nav-item">
              <NavLink to="/stores">Our Stores</NavLink>
            </li>
            {/* <li className="nav-item">
              <NavLink to="/blog">Blog</NavLink>
            </li> */}
          </ul>
        </nav>

      
        <div className="header-icons">
          <button className="icon-btn" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
            <FiSearch />
          </button>
          <button className="icon-btn" aria-label="User Profile" onClick={() => {
            const token = localStorage.getItem('token');
            if (token) {
              navigate('/profile', { state: { activeTab: 'profile' } });
            } else {
              navigate('/login');
            }
          }}>
            <FiUser />
          </button>
          <button className="icon-btn cart-btn" aria-label="Shopping Cart" onClick={() => navigate('/cart')}>
            <FiShoppingBag className="header-icon" />
            <span className="cart-badge">{cartCount}</span>
          </button>
        </div>
      </div>

      <div className={`mobile-nav ${isMobileMenuOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          <li className="mobile-nav-item">
            <NavLink to="/" end onClick={() => setIsMobileMenuOpen(false)}>Home</NavLink>
          </li>
          {loading ? (
            [...Array(4)].map((_, i) => (
              <li className="mobile-nav-item" key={`shimmer-mobile-nav-${i}`}>
                <div className="header-shimmer-item skeleton-shimmer" style={{ width: '80px', height: '18px', margin: '15px 20px' }}></div>
              </li>
            ))
          ) : (
            categories.map((category) => (
              <li className="mobile-nav-item" key={category.id}>
                <NavLink to={`/categories/${category.code}`} onClick={() => setIsMobileMenuOpen(false)}>
                  {category.name}
                </NavLink>
              </li>
            ))
          )}
          <li className="mobile-nav-item">
            <NavLink to="/stores" onClick={() => setIsMobileMenuOpen(false)}>Our Stores</NavLink>
          </li>
          {/* <li className="mobile-nav-item">
            <NavLink to="/blog" onClick={() => setIsMobileMenuOpen(false)}>Blog</NavLink>
          </li> */}
        </ul>
      </div>

      <SearchDrawer isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;
