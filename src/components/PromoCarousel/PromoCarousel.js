import React, { useEffect } from 'react';
import './PromoCarousel.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';


const PromoCarousel = () => {
  const dispatch = useDispatch()
  const { product, status: productStatus } = useSelector((state) => state.product);
  const navigate = useNavigate();
  const loading = productStatus === 'loading' || productStatus === 'idle';
  const products = product && product.length > 0 ? [...product].reverse().slice(0, 5) : [];
  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch]);

  return (
    <section className="promo-carousel-section">
      <div className="promo-header-bar">
        <div className="marquee-container">
          <div className="marquee-text">
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
          </div>
        </div>
      </div>

      <div className="promo-container">
        <div className="promo-grid">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div className="promo-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="promo-info" style={{ width: '100%' }}>
                  <div className="shimmer-text" style={{ width: '80%', margin: '0 auto 10px' }}></div>
                  <div className="shimmer-button" style={{ margin: '0 auto' }}></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((item) => (
              <div className="promo-card" key={item.id}>
                <div className="promo-image-wrapper">
                  <img
                    src={item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.png'}
                    alt={item.name}
                    className="promo-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="promo-info">
                  <p className="promo-desc" title={item.name}>{item.name}</p>
                  <button className="promo-shop-btn" onClick={() => navigate(`/product/${item.id}`)}>Shop Now</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No promos found.</p>
          )}
        </div>

        <div className="promo-view-all-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', borderRadius: '4px' }}></div>
          ) : (
            <button className="promo-view-all-btn" onClick={() => navigate('/CartPage')}>
              View All
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
export default PromoCarousel;
