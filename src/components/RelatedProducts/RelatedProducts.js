import React, { useEffect } from 'react';
import './RelatedProducts.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { FiInfo } from 'react-icons/fi';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchRelatedProducts } from '../../redux/Slice/productDetailsSlice';
import { openQuickView as openGlobalQuickView } from '../../redux/Slice/tagProductsSlice';
import { addToWishlistThunk, removeFromWishlistThunk } from '../../redux/Slice/wishlistSlice';

const RelatedProducts = ({ title = "New Arrivals", productId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, status } = useSelector((state) => state.product);
  const { relatedProducts, relatedLoading } = useSelector((state) => state.productDetails);
  
  const user = useSelector((state) => state.user?.user);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [wishlistToast, React_useState] = React.useState({ show: false, message: '' });

  const showToast = (message) => {
    React_useState({ show: true, message });
    setTimeout(() => {
      React_useState({ show: false, message: '' });
    }, 3000);
  };

  const handleWishlistClick = (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user?.id || user?._id;
    if (!userId) {
      alert("Please login to add items to your wishlist.");
      navigate('/login');
      return;
    }
    
    if (wishlistItems.includes(productId)) {
      dispatch(removeFromWishlistThunk({ userId, productId }))
        .unwrap()
        .then(() => showToast("Product removed from your Wishlist"))
        .catch((err) => alert("Error removing from wishlist: " + err));
    } else {
      dispatch(addToWishlistThunk({ userId, productId }))
        .unwrap()
        .then(() => showToast("Product saved in your Wishlist"))
        .catch((err) => alert("Error adding to wishlist: " + err));
    }
  };

  useEffect(() => {
    if (productId) {
      dispatch(fetchRelatedProducts({ productId, limit: 10 }));
    } else {
      if (status === 'idle') {
        dispatch(fetchProducts());
      }
    }
  }, [productId, status, dispatch]);

  const loading = productId ? relatedLoading : (status === 'loading' || status === 'idle');
  const displayProducts = productId ? relatedProducts : (product ? product.slice(0, 10) : []);

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
    <>
      {wishlistToast.show && (
        <div className="wishlist-toast-notification">
          <div className="wishlist-toast-icon">
            <FiInfo />
          </div>
          <span>{wishlistToast.message}</span>
        </div>
      )}
      <section className="related-products-section">
        <div className="related-products-grid">
        {loading ? (
          <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Loading products...</p>
        ) : (
          displayProducts.map((product) => (
            <div className="rp-card" key={product.id}>
              <div className="rp-image-wrapper" onClick={() => navigate(`/product/${product.id}`)} style={{ cursor: 'pointer', position: 'relative' }}>
                <button 
                  onClick={(e) => handleWishlistClick(e, product.id)} 
                  style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
                  title={wishlistItems.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  {wishlistItems.includes(product.id) ? (
                    <FaHeart color="red" size={18} />
                  ) : (
                    <FaRegHeart color="gray" size={18} />
                  )}
                </button>
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
    </>
  );
};

export default RelatedProducts;
