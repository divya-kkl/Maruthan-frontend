import React, { useState, useEffect } from 'react';
import './JablaShowcase.css';
import { GraphQLClient, gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';

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

const JablaShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openQuickView = (product) => { setSelectedProduct(product); };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCTS, { search: '' });
        
    
        const fetchedProducts = data.getProduct?.products ? data.getProduct?.products.slice(0, 5) : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="jabla-section">
      <div className="jabla-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px', marginBottom: '10px' }}></div>
            <div className="shimmer-text" style={{ width: '400px', height: '20px' }}></div>
          </div>
        ) : (
          <>
            <h2 className="jabla-title">Jabla, Co-od & Frock</h2>
            <p className="jabla-subtitle">Breathable cotton frock made for summer comfort and everyday charm!</p>
          </>
        )}
        
        <div className="jabla-grid">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div className="jabla-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="jabla-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                  <div className="shimmer-button"></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="jabla-card" key={product.id}>
                <div className="jabla-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                  <img 
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'} 
                    alt={product.name} 
                    className="jabla-image"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src="/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="jabla-info">
                  <h3 className="jabla-name" title={product.name}>{product.name}</h3>
                  <div className="jabla-price">
                    Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button className="jabla-select-btn" onClick={() => openQuickView(product)}>Select Options</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No products found.</p>
          )}
        </div>

        <div className="jabla-view-all-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', borderRadius: '4px' }}></div>
          ) : (
            <button className="jabla-view-all-btn" onClick={() => navigate('/categories/GIRLS')}>
              View All
            </button>
          )}
        </div>
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default JablaShowcase;
