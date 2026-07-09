import React, { useState, useEffect, useMemo } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import './SearchDrawer.css';

const TRENDING_SEARCHES = [
  "Newborn Pattu Frock",
  "Girls Pattu Pavadai",
  "Chettinad Cotton Pattupavadai",
  "Pattu Frock",
  "Tamil Newyear collection",
  "Best selling products"
];

const SearchDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const { product, status } = useSelector((state) => state.product);

  // Fetch products if not already fetched
  useEffect(() => {
    if (isOpen && status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [isOpen, status, dispatch]);

  const loading = status === 'loading';

  // Filter products locally based on search term
  const displayedProducts = useMemo(() => {
    if (!product) return [];
    if (!searchTerm) {
      return product.slice(0, 5);
    }
    const lowerSearch = searchTerm.toLowerCase();
    return product
      .filter((p) => p.name.toLowerCase().includes(lowerSearch))
      .slice(0, 5);
  }, [product, searchTerm]);

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    onClose();
  };

  return (
    <div className={`search-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="search-drawer-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-drawer-header">
          <h2 className="search-drawer-title">Search Our Site</h2>
          <button className="search-close-btn" onClick={onClose}>
            <FiX />
          </button>
        </div>
        
        <div className="search-drawer-body">
          <div className="search-input-wrapper">
            <input 
              type="text" 
              className="search-input" 
              placeholder="I'm looking for..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-input-icon">
              <FiSearch />
            </button>
          </div>

          {!searchTerm && (
            <>
              <h3 className="search-section-title">Trending Search</h3>
              <div className="trending-tags">
                {TRENDING_SEARCHES.map((tag, idx) => (
                  <button 
                    key={idx} 
                    className="trending-tag-btn"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </>
          )}

          <h3 className="search-section-title">
            {searchTerm ? 'Search Results' : 'Popular Products'}
          </h3>
          
          {loading ? (
            <div className="popular-products-list">
              {[...Array(4)].map((_, index) => (
                <div key={`search-shimmer-${index}`} className="popular-product-item shimmer-card" style={{ padding: '10px' }}>
                  <div className="shimmer-image" style={{ width: '60px', height: '60px', borderRadius: '8px', flexShrink: 0, marginBottom: 0 }}></div>
                  <div className="popular-product-details" style={{ width: '100%', marginLeft: '15px' }}>
                    <div className="shimmer-text" style={{ width: '80%', height: '14px', marginBottom: '8px' }}></div>
                    <div className="shimmer-text" style={{ width: '50%', height: '14px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="popular-products-list">
              {displayedProducts.map(product => (
                <div 
                  key={product.id} 
                  className="popular-product-item"
                  onClick={() => handleProductClick(product.id)}
                >
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'} 
                    alt={product.name} 
                    className="popular-product-image"
                    onError={(e) => { e.target.src = '/images/placeholder.png' }}
                  />
                  <div className="popular-product-details">
                    <p className="popular-product-name">{product.name}</p>
                    <p className="popular-product-price">
                      Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="search-no-results">No products found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchDrawer;
