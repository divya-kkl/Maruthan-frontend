import React, { useEffect } from 'react';
import './CustomerFavorites.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';
import { FaInstagram, FaHeart } from 'react-icons/fa';

const CustomerFavorites = ({ title = "Loved by Our Little Customers 💛" }) => {
  const { product, status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);
  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';

  const genericProducts = product && product.length > 0 
    ? [...product].filter(p => !p.tags || p.tags.length === 0).reverse() 
    : [];
  const taggedProducts = productsByTag['loved'] || [];

  const combinedProducts = [...taggedProducts, ...genericProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values()).slice(0, 5);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'loved', limit: 5 }));
  }, [dispatch]);

  // Use product name for description, limit length
  const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <section className="customer-favorites-section">
      {loading ? (
        <div className="customer-favorites-header">
          <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
          <div className="shimmer-button" style={{ width: '200px', height: '40px', marginTop: 0, borderRadius: '25px' }}></div>
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

      <div className="cf-carousel-container">
        {loading ? (
          <div className="cf-carousel-wrapper">
            <div className="cf-track" style={{ animation: 'none', display: 'flex', gap: '20px' }}>
              {[...Array(6)].map((_, index) => (
                <div className="cf-card shimmer-card" key={`shimmer-${index}`}>
                  <div className="shimmer-image"></div>
                  <div className="cf-info" style={{ width: '100%' }}>
                    <div className="shimmer-text title"></div>
                    <div className="shimmer-text" style={{ width: '30%', marginTop: '10px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="cf-carousel-wrapper">
            <div className="cf-track">
              {products.map((product, index) => (
                <div className="cf-card" key={`t1-${product.id}-${index}`}>
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
                      <span>{Math.floor(Math.random() * (300 - 100 + 1) + 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Duplicate track for seamless infinite scroll */}
            <div className="cf-track" aria-hidden="true">
              {products.map((product, index) => (
                <div className="cf-card" key={`t2-${product.id}-${index}`}>
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
                      <span>{Math.floor(Math.random() * (300 - 100 + 1) + 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerFavorites;
