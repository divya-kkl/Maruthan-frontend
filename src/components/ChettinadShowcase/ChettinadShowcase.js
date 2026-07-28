import React, { useState, useEffect, useRef } from 'react';
import './ChettinadShowcase.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';



const ChettinadShowcase = () => {
  const dispatch = useDispatch();
  const { product, status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);

  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';

  const genericProducts = product && product.length > 0
    ? [...product].filter(p => !p.tags || p.tags.length === 0)
    : [];
  const taggedProducts = productsByTag['CHETTINAD COTTON'] || [];

  const combinedProducts = [...taggedProducts, ...genericProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values()).slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openQuickView = (product) => { setSelectedProduct(product); };

  const handleDotClick = (index) => {
    setActiveIndex(index);
    if (scrollRef.current && scrollRef.current.children[index]) {
      const child = scrollRef.current.children[index];
      scrollRef.current.scrollTo({
        left: child.offsetLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const children = Array.from(scrollRef.current.children);
      let closestIndex = 0;
      let minDiff = Infinity;

      children.forEach((child, index) => {
        const diff = Math.abs(scrollLeft - child.offsetLeft);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = index;
        }
      });

      if (closestIndex !== activeIndex) {
        setActiveIndex(closestIndex);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'CHETTINAD COTTON', limit: 5 }));
  }, [dispatch]);

  return (
    <section className="chettinad-section">
      <div className="chettinad-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
          </div>
        ) : (
          <h2 className="chettinad-title">Chettinad Cotton</h2>
        )}

        <div className="chettinad-grid" ref={scrollRef} onScroll={handleScroll}>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div className="chettinad-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="chettinad-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                  <div className="shimmer-button"></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="chettinad-card" key={product.id}>
                <div className="chettinad-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="chettinad-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="chettinad-info">
                  <h3 className="chettinad-name" title={product.name}>{product.name}</h3>
                  <div className="chettinad-price">
                    Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button className="chettinad-select-btn" onClick={() => openQuickView(product)}>Select Options</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No products found.</p>
          )}
        </div>

        <div className="chettinad-dots">
          {!loading && products.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === activeIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              style={{ cursor: 'pointer' }}
            ></span>
          ))}
        </div>

        <div className="chettinad-view-all-wrapper">
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
          ) : (
            <button className="chettinad-view-all-btn" onClick={() => navigate('/categories/GIRLS')}>
              View All
            </button>
          )}
        </div>
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default ChettinadShowcase;
