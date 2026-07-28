import { useEffect } from 'react';
import '../ProductShowcase/ProductShowcase.css';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByTag, openQuickView, closeQuickView } from '../../redux/Slice/tagProductsSlice';

const DynamicShowcase = ({ tagCode, tagName }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { productsByTag, status, selectedProduct } = useSelector(state => state.tagProducts);
  
  useEffect(() => {
    if (tagCode) {
      dispatch(fetchProductsByTag({ code: tagCode, limit: 10 }));
    }
  }, [dispatch, tagCode]);

  const products = productsByTag[tagCode] || [];
  const loading = status === 'loading' || status === 'idle';

  const handleOpenQuickView = (product) => { dispatch(openQuickView(product)); };

  const displayProducts = products.length > 0 ? [...products].reverse().slice(0, 5) : [];

  if (!loading && displayProducts.length === 0) {
    return null; // Don't show the section if there are no products
  }

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
            <h2 className="showcase-title">{tagName}</h2>
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
        ) : (
          displayProducts.map((product) => (
            <div className="product-card" key={product.id}>
              <div className="product-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                <img
                  src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                  alt={product.name}
                  className="product-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/images/placeholder.png";
                  }}
                />
              </div>
              <div className="product-info">
                <h3 className="product-name" title={product.name}>
                  {product.name}
                </h3>
                <div className="showcase-price">
                  Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <button className="select-options-btn" onClick={() => handleOpenQuickView(product)}>Select Options</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="shop-more-container">
        {loading ? (
          <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
        ) : (
          <button className="shop-more-btn" onClick={() => navigate(`/tags/${tagCode}`)}>
            View All
          </button>
        )}
      </div>

      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => dispatch(closeQuickView())} />}
    </section>
  );
};

export default DynamicShowcase;
