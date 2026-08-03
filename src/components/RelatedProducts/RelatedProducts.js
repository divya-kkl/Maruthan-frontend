import React, { useEffect } from 'react';
import './RelatedProducts.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { openQuickView as openGlobalQuickView } from '../../redux/Slice/tagProductsSlice';
const RelatedProducts = ({ title = "New Arrivals" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, status } = useSelector((state) => state.product);


  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const loading = status === 'loading' || status === 'idle';
  const displayProducts = product ? product.slice(0, 10) : [];

  const openQuickView = (product) => {
    dispatch(openGlobalQuickView({
      ...product,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
      originalPrice: product.mrp
    }));
  };

  const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <section className="related-products-section">
      <div className="related-products-grid">
        {loading ? (
          <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Loading products...</p>
        ) : (
          displayProducts.map((product) => (
            <div className="rp-card" key={product.id}>
              <div className="rp-image-wrapper" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                  alt={product.name}
                  className="rp-image"
                />
              </div>
              <div className="rp-info">
                <p className="rp-name" title={product.name} onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer' }}>
                  {truncate(product.name, 45)}
                </p>
                <p className="rp-price">
                  Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <button
                  className="rp-select-btn"
                  onClick={() => openQuickView(product)}
                >
                  Select Options
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
