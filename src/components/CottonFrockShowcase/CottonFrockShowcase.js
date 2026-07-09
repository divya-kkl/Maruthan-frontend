import React, { useState, useEffect } from 'react';
import './CottonFrockShowcase.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';

const CottonFrockShowcase = () => {
  const dispatch = useDispatch();
  const { product, status: productStatus } = useSelector((state) => state.product);
  const loading = productStatus === "loading" || productStatus === 'idel';
  const products = product && product.length > 0 ? [...product].reverse().slice(0, 5) : [];
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openQuickView = (product) => { setSelectedProduct(product); };

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

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
                <div className="cotton-frock-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
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
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default CottonFrockShowcase;
