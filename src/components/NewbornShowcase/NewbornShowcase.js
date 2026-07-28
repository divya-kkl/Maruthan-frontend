import React, { useState, useEffect } from 'react';
import './NewbornShowcase.css';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';


const NewbornShowcase = () => {
  const dispatch = useDispatch();
  const { product, status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';

  const genericProducts = product && product.length > 0 
    ? [...product].filter(p => !p.tags || p.tags.length === 0).reverse() 
    : [];
  const taggedProducts = productsByTag['newborn'] || [];

  // Combine tagged products first, then generic products, removing duplicates by ID
  const combinedProducts = [...taggedProducts, ...genericProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const displayProducts = Array.from(uniqueProductsMap.values()).slice(0, 8);


  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'newborn', limit: 8 }));
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
          ) : displayProducts.length > 0 ? (
            displayProducts.map((product) => (
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
