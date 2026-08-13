import React, { useEffect } from 'react';
import './NewbornShowcase.css';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';
import { isNew } from '../../redux/Slice/productDetailsSlice';


const NewbornShowcase = () => {
  const dispatch = useDispatch();
  const { status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);
  const navigate = useNavigate();

  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';


  const taggedProducts = productsByTag['HAMPERS'] || [];

  // Combine tagged products first, then generic products, removing duplicates by ID
  const combinedProducts = [...taggedProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const displayProducts = Array.from(uniqueProductsMap.values()).slice(0, 8);


  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'HAMPERS', limit: 8 }));
  }, [dispatch]);

  if (tagStatus === 'failed') {
    return (
      <section className="newborn-showcase-section">
        <div className="newborn-container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ff4d4f' }}>Oops! Something went wrong.</h2>
          <p style={{ fontSize: '1rem', color: '#666' }}>Failed to load products. Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="newborn-showcase-section">
      <div className="newborn-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
          </div>
        ) : (
          <h2 className="newborn-title">Hampers</h2>
        )}

        <div className="newborn-grid">
          {loading ? (
            [...Array(8)].map((_, index) => (
              <div className="newborn-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="newborn-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                </div>
              </div>
            ))
          ) : displayProducts.length > 0 ? (
            displayProducts.map((product) => (
              <div className="newborn-card" key={product.id}>
                <div className="newborn-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/product/${product.id}`)}>
                  {isNew(product.createdAt) && (
                    <span className="new-badge">NEW</span>
                  )}
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="newborn-image"
                  />
                </div>
                <div className="newborn-info">
                  <h3 className="newborn-name" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="newborn-price">
                    Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>

                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>

        <div className="newborn-view-all-container">
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
          ) : (
            <button className="newborn-view-all-btn" onClick={() => navigate('/categories/GIRLS')}>
              View All
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewbornShowcase;
