import React, { useState, useEffect } from 'react';
import { FiX, FiSearch } from 'react-icons/fi';
import { GraphQLClient, gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';
import './SearchDrawer.css';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCTS = gql`
  query GetProduct($search: String) {
    getProduct(search: $search) {
      products {
      id
      name
      price
      images
    }
  }
}`;

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
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch initial popular products
  useEffect(() => {
    if (isOpen && searchTerm === '') {
      fetchProducts('');
    }
  }, [isOpen, searchTerm]);

  // Debounced search
  useEffect(() => {
    if (!isOpen) return;
    
    const timer = setTimeout(() => {
      fetchProducts(searchTerm);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen]);

  const fetchProducts = async (search) => {
    setLoading(true);
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_PRODUCTS, { search });
      // Limit to 5 results for the drawer
      setProducts((data.getProduct?.products || []).slice(0, 5));
    } catch (err) {
      console.error('Error fetching search results:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

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
          ) : products.length > 0 ? (
            <div className="popular-products-list">
              {products.map(product => (
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
