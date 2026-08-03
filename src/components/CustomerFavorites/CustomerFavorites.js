import React, { useEffect } from 'react';
import './CustomerFavorites.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';
import { FaInstagram, FaHeart } from 'react-icons/fa';

const CustomerFavorites = () => {
  const { status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);
  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';

  const taggedProducts = productsByTag['Loved by Our Little Customers'] || [];
  const uniqueProductsMap = new Map();
  taggedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) uniqueProductsMap.set(p.id, p);
  });
  const products = Array.from(uniqueProductsMap.values()).slice(0, 10);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'Loved by Our Little Customers', limit: 10 }));
  }, [dispatch]);

  const truncate = (str, n) => (str.length > n ? str.substr(0, n - 1) + '...' : str);

  if (tagStatus === 'failed') {
    return (
      <section className="customer-favorites-section">
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#ff4d4f' }}>
          Failed to load. Please refresh.
        </div>
      </section>
    );
  }

  // Duplicate for seamless loop
  const displayProducts = [...products, ...products];

  return (
    <section className="customer-favorites-section">
      {loading ? (
        <div className="customer-favorites-header">
          <div className="shimmer-text" style={{ width: '300px', height: '32px', margin: '0 auto' }}></div>
          <div className="shimmer-text" style={{ width: '200px', height: '40px', margin: '16px auto 0', borderRadius: '25px' }}></div>
        </div>
      ) : (
        <div className="customer-favorites-header">
          <h2 className="customer-favorites-title">Loved by Our Little Customers 💛</h2>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="customer-favorites-insta-btn">
            <FaInstagram className="cf-insta-icon" />
            Follow Us on Instagram
          </a>
        </div>
      )}

      {/* Marquee Slider */}
      <div className="cf-outer">
        <div className="cf-marquee">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div className="cf-card shimmer-card" key={`shimmer-${i}`}>
                <div className="shimmer-image" style={{ height: '260px' }}></div>
                <div className="cf-info">
                  <div className="shimmer-text" style={{ height: '14px', width: '80%' }}></div>
                  <div className="shimmer-text" style={{ height: '12px', width: '40%', marginTop: '8px' }}></div>
                </div>
              </div>
            ))
          ) : (
            displayProducts.map((product, index) => (
              <div className="cf-card" key={`${product.id}-${index}`}>
                <div className="cf-image-wrapper">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="cf-image"
                  />
                </div>
                <div className="cf-info">
                  <p className="cf-desc" title={product.name}>
                    {truncate(product.name, 65)}
                  </p>
                  <div className="cf-likes">
                    <FaHeart className="cf-heart-icon" />
                    <span>{100 + ((product.id?.charCodeAt(0) || 0) % 200)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default CustomerFavorites;
