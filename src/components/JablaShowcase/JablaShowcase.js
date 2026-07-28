import React, { useState, useEffect } from 'react';
import './JablaShowcase.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';

const JablaShowcase = () => {
  const dispatch = useDispatch();
  const { product, status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);

  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';

  const genericProducts = product && product.length > 0
    ? [...product].filter(p => !p.tags || p.tags.length === 0)
    : [];
  const taggedProducts = productsByTag['JABLA, CO-OD & FROCK'] || [];

  // Combine tagged products first, then generic products, removing duplicates by ID
  const combinedProducts = [...taggedProducts, ...genericProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values()).slice(0, 5);

  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openQuickView = (product) => { setSelectedProduct(product); };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'JABLA, CO-OD & FROCK', limit: 5 }));
  }, [dispatch]);

  if (tagStatus === 'failed') {
    return (
      <section className="jabla-showcase-section">
        <div className="jabla-container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ff4d4f' }}>Oops! Something went wrong.</h2>
          <p style={{ fontSize: '1rem', color: '#666' }}>Failed to load products. Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

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
            products.map((item) => (
              <div className="jabla-card" key={item.id}>
                <div className="jabla-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${item.id}`)}>
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.png'}
                    alt={item.name}
                    className="jabla-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="jabla-info">
                  <h3 className="jabla-name" title={item.name}>{item.name}</h3>
                  <div className="jabla-price">
                    Rs. {Number(item.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button className="jabla-select-btn" onClick={() => openQuickView(item)}>Select Options</button>
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
