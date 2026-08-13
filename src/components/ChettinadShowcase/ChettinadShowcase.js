import React, { useEffect, useRef } from 'react';
import './ChettinadShowcase.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag, openQuickView as openGlobalQuickView, setActiveIndex as setGlobalActiveIndex } from '../../redux/Slice/tagProductsSlice';
import { isNew } from '../../redux/Slice/productDetailsSlice';
import { useNavigate } from 'react-router-dom';



const ChettinadShowcase = () => {
  const dispatch = useDispatch();
  const { status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus, activeIndices } = useSelector((state) => state.tagProducts);

  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';


  const taggedProducts = productsByTag['MADE FOR EVERY PART OF YOUR LIFE'] || [];

  const combinedProducts = [...taggedProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values()).slice(0, 5);
  const activeIndex = activeIndices?.['chettinad'] || 0;
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const openQuickView = (product) => { dispatch(openGlobalQuickView(product)); };

  const handleDotClick = (index) => {
    dispatch(setGlobalActiveIndex({ section: 'chettinad', index }));
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
        dispatch(setGlobalActiveIndex({ section: 'chettinad', index: closestIndex }));
      }
    }
  };

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'MADE FOR EVERY PART OF YOUR LIFE', limit: 5 }));
  }, [dispatch]);

  if (tagStatus === 'failed') {
    return (
      <section className="chettinad-section">
        <div classsName="chettinad-container" style={{ textAlign: 'center', pedding: '50px 0', color: 'red' }}>
          <h2>OOps! Something went wrong.</h2>
          <p>Failed to load products. Please try refreshing the page.</p>
        </div>
      </section>
    )
  }
  return (
    <section className="chettinad-section">
      <div className="chettinad-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
          </div>
        ) : (
          <h2 className="chettinad-title">Made for Every Part of Your Life </h2>
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
                <div className="chettinad-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/product/${product.id}`)}>
                  {isNew(product.createdAt) && (
                    <span className="new-badge">NEW</span>
                  )}
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
      </div>
    </section>
  );
};

export default ChettinadShowcase;
