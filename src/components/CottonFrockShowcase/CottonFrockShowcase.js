import React, { useEffect } from 'react';
import './CottonFrockShowcase.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag, openQuickView as openGlobalQuickView } from '../../redux/Slice/tagProductsSlice';
import { isNew } from '../../redux/Slice/productDetailsSlice';
import { useNavigate } from 'react-router-dom';

const CottonFrockShowcase = () => {
  const dispatch = useDispatch();
  const { status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);

  const loading = (productStatus === 'loading' || productStatus === 'idle' || productStatus === 'idel') && tagStatus !== 'succeeded';


  const taggedProducts = productsByTag['COTTON & MODERN FROCK'] || [];

  const combinedProducts = [...taggedProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values()).slice(0, 5);
  const navigate = useNavigate();
  const openQuickView = (product) => { dispatch(openGlobalQuickView(product)); };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'COTTON & MODERN FROCK', limit: 5 }));
  }, [dispatch]);

  if (tagStatus === 'failed') {
    return (
      <section className="cotton-frock-showcase-section">
        <div className="cotton-frock-container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ff4d4f' }}>Oops! Something went wrong.</h2>
          <p style={{ fontSize: '1rem', color: '#666' }}>Failed to load products. Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="cotton-frock-section">
      <div className="cotton-frock-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px', marginBottom: '10px' }}></div>
            <div className="shimmer-text" style={{ width: '400px', height: '20px' }}></div>
          </div>
        ) : (
          <>
            <h2 className="cotton-frock-title">Cotton & Modern frock</h2>
            <p className="cotton-frock-subtitle">Breathable cotton frock made for summer comfort and everyday charm!</p>
          </>
        )}

        <div className="cotton-frock-grid">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div className="cotton-frock-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="cotton-frock-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                  <div className="shimmer-button"></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="cotton-frock-card" key={product.id}>
                <div className="cotton-frock-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/product/${product.id}`)}>
                  {isNew(product.createdAt) && (
                    <span className="new-badge">NEW</span>
                  )}
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="cotton-frock-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="cotton-frock-info">
                  <h3 className="cotton-frock-name" title={product.name}>{product.name}</h3>
                  <div className="cotton-frock-price">
                    Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button className="cotton-frock-select-btn" onClick={() => openQuickView(product)}>Select Options</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No products found.</p>
          )}
        </div>

        <div className="cotton-frock-view-all-wrapper">
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
          ) : (
            <button className="cotton-frock-view-all-btn" onClick={() => navigate('/categories/GIRLS')}>
              View All
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default CottonFrockShowcase;
