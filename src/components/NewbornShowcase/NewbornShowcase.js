import React, { useState, useEffect } from 'react';
import './NewbornShowcase.css';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';


const NewbornShowcase = () => {
  const dispatch = useDispatch();
  const  { product, status:productStatus} = useSelector ((state) => state.product);
  const  products = product && product.length > 0 ? [...product].reverse().slice( 0,8 ) : [];
  const loading = productStatus === 'loading';
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

  return (
    <section className="newborn-showcase-section">
      <div className="newborn-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
          </div>
        ) : (
          <h2 className="newborn-title">Newborn Pattu Frock</h2>
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
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="newborn-card" key={product.id}>
                <div className="newborn-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
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
            <button className="newborn-view-all-btn" onClick={() => navigate('/categories/NEWBORN')}>
              View All
            </button>
          )}
        </div>
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default NewbornShowcase;
