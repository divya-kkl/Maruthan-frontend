import React, { useState, useEffect } from 'react';
import './ProductShowcase.css';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';



const ProductShowcase = () => {


  const dispatch = useDispatch();
  const { product, status } = useSelector((state) => state.product);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();
  const loading = status === 'loading' || status === 'idle';
  const displayProducts = product && product.length > 0 ? [...product].reverse().slice(0, 5) : [];


  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

  const openQuickView = (product) => {
    setSelectedProduct({
      ...product,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
      originalPrice: product.mrp
    });
  };

  return (
    <section className="product-showcase-section">
      <div className="showcase-header">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px', marginBottom: '10px' }}></div>
            <div className="shimmer-text" style={{ width: '400px', height: '20px' }}></div>
          </div>
        ) : (
          <>
            <h2 className="showcase-title">Traditional gowns</h2>
            <p className="showcase-subtitle">Loved by parents for its timeless tradition and comfort!</p>
          </>
        )}
      </div>

      <div className="product-grid">
        {loading ? (
          [...Array(5)].map((_, index) => (
            <div className="product-card shimmer-card" key={`shimmer-${index}`}>
              <div className="shimmer-image"></div>
              <div className="product-info" style={{ width: '100%' }}>
                <div className="shimmer-text title"></div>
                <div className="shimmer-text price"></div>
                <div className="shimmer-button"></div>
              </div>
            </div>
          ))
        ) : displayProducts.length > 0 ? (
          displayProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                  alt={product.name}
                  className="product-image"
                />
              </div>
              <div className="product-info">
                <h3 className="product-name" title={product.name}>
                  {product.name}
                </h3>
                <div className="showcase-price">
                  Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <button className="select-options-btn" onClick={() => openQuickView(product)}>Select Options</button>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <div className="shop-more-container">
        {loading ? (
          <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
        ) : (
          <button className="shop-more-btn" onClick={() => navigate('/categories/GIRLS')}>
            View All
          </button>
        )}
      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};

export default ProductShowcase;
