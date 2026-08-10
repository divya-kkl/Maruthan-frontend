import { useEffect } from 'react';
import './QuickViewModal.css';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../redux/Slice/cartSlice';
import { ALL_SIZES, setSelectedSize, setQuantity, setActiveImage } from '../../redux/Slice/productDetailsSlice';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight, FiShare2 } from 'react-icons/fi';

const QuickViewModal = ({ product, onClose }) => {
  const dispatch = useDispatch();
  const selectedSize = useSelector((state) => state.productDetails.selectedSize);
  const quantity = useSelector((state) => state.productDetails.quantity);
  const activeImage = useSelector((state) => state.productDetails.activeImage);
  const navigate = useNavigate();
  const isAdding = useSelector((state) => state.cart.loading);

  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        dispatch(setActiveImage(product.images[0]));
      }
      const available = (product?.variants || []).reduce((acc, variant) => {
        if (!variant.size) return acc;
        const exists = acc.some(item => item.rawSize.toLowerCase() === variant.size.toLowerCase());
        if (!exists) {
          const matched = ALL_SIZES.find(s => 
            s.key.toLowerCase() === variant.size.toLowerCase() || 
            s.display.toLowerCase() === variant.size.toLowerCase()
          );
          acc.push({
            key: matched ? matched.key : variant.size,
            display: matched ? matched.display : variant.size,
            rawSize: variant.size,
            orderIndex: matched ? ALL_SIZES.findIndex(s => s.key === matched.key) : 99
          });
        }
        return acc;
      }, []).sort((a, b) => a.orderIndex - b.orderIndex);

      if (available.length > 0 && !selectedSize) {
        dispatch(setSelectedSize(available[0].rawSize));
      }
    }
  }, [product, dispatch, selectedSize]);

  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = Math.max(0, product.images.indexOf(activeImage));
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    dispatch(setActiveImage(product.images[prevIndex]));
  };

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = Math.max(0, product.images.indexOf(activeImage));
    const nextIndex = (currentIndex + 1) % product.images.length;
    dispatch(setActiveImage(product.images[nextIndex]));
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ product, quantity, size: selectedSize })).unwrap();
      onClose();
      navigate('/cart');
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const handleBuyNow = async () => {
    try {
      await dispatch(addToCart({ product, quantity, size: selectedSize })).unwrap();
      onClose();
      navigate('/checkout');
    } catch (err) {
      console.error("Failed to buy now:", err);
    }
  };

  const handleShare = async () => {
    const url = window.location.origin + '/product/' + (product.id || product._id);
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name || product.title,
          url: url
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert("Product link copied to clipboard!");
      });
    }
  };

  if (!product) return null;

  const selectedVariant = product.variants?.find(v => v.size === selectedSize);
  const hasOnlyNoSize = product?.variants?.length === 1 && product.variants[0].size.toLowerCase().replace(/\s/g, '') === 'nosize';
  const showSizeSection = product?.hasSize !== false && !hasOnlyNoSize;
  const currentStock = selectedVariant ? selectedVariant.stock : (product.variants?.[0]?.stock || 0);

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>&times;</button>

        <div className="quickview-content">
          <div className="quickview-image-container">
            {product.images && product.images.length > 1 && (
              <>
                <button 
                  className="quickview-nav-arrow left-arrow" 
                  onClick={handlePrevImage} 
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button 
                  className="quickview-nav-arrow right-arrow" 
                  onClick={handleNextImage} 
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
              </>
            )}
            <img src={activeImage} alt={product.name || product.title} className="quickview-image" />
          </div>

          <div className="quickview-details">
            <h2 className="quickview-title">{product.name || product.title}</h2>
            
            <div className="quickview-price-wrap" style={{ display: 'flex', alignItems: 'baseline' }}>
              <span className="quickview-price">Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              {(Number(product.mrp) > Number(product.price) || Number(product.originalPrice) > Number(product.price)) && (
                <span className="quickview-old-price">
                  Rs. {Number(product.mrp || product.originalPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              )}
            </div>

            {showSizeSection && (
              <div className="quickview-size-section">
                {(() => {
                const availableSizes = (product?.variants || []).reduce((acc, variant) => {
                  if (!variant.size) return acc;
                  const exists = acc.some(item => item.rawSize.toLowerCase() === variant.size.toLowerCase());
                  if (!exists) {
                    const matched = ALL_SIZES.find(s => 
                      s.key.toLowerCase() === variant.size.toLowerCase() || 
                      s.display.toLowerCase() === variant.size.toLowerCase()
                    );
                    acc.push({
                      key: matched ? matched.key : variant.size,
                      display: matched ? matched.display : variant.size,
                      rawSize: variant.size,
                      orderIndex: matched ? ALL_SIZES.findIndex(s => s.key === matched.key) : 99
                    });
                  }
                  return acc;
                }, []).sort((a, b) => a.orderIndex - b.orderIndex);

                const activeOpt = availableSizes.find(opt => 
                  selectedSize?.toLowerCase() === opt.rawSize.toLowerCase() || 
                  selectedSize?.toLowerCase() === opt.key.toLowerCase() || 
                  selectedSize?.toLowerCase() === opt.display.toLowerCase()
                ) || availableSizes[0];

                const labelDisplayText = activeOpt ? activeOpt.display : selectedSize;

                return (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <p className="size-label" style={{ marginBottom: 0 }}>
                        Size: <span>{labelDisplayText}</span>
                      </p>
                      <div 
                        onClick={handleShare} 
                        style={{ 
                          cursor: 'pointer', 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          fontSize: '15px',
                          color: '#333',
                          marginRight: '40px'
                        }}
                      >
                        <FiShare2 /> Share
                      </div>
                    </div>
                    <div className="size-buttons">
                      {availableSizes.map(sizeOpt => {
                        const isActive = selectedSize?.toLowerCase() === sizeOpt.rawSize.toLowerCase() || 
                                         selectedSize?.toLowerCase() === sizeOpt.key.toLowerCase() || 
                                         selectedSize?.toLowerCase() === sizeOpt.display.toLowerCase() ||
                                         (!selectedSize && activeOpt?.rawSize === sizeOpt.rawSize);

                        const variantForSize = product.variants?.find(v => v.size === sizeOpt.rawSize);
                        const isOutOfStock = variantForSize ? variantForSize.stock <= 0 : true;

                        return (
                          <button
                            key={sizeOpt.key}
                            className={`size-btn ${isActive ? 'active' : ''} ${isOutOfStock ? 'out-of-stock-size' : ''}`}
                            onClick={() => {
                              if (!isOutOfStock) {
                                dispatch(setSelectedSize(sizeOpt.rawSize));
                              }
                            }}
                            disabled={isOutOfStock}
                            title={isOutOfStock ? 'Out of stock' : ''}
                            style={isOutOfStock ? { textDecoration: 'line-through', opacity: 0.5, cursor: 'not-allowed' } : {}}
                          >
                            {sizeOpt.display}
                          </button>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
            )}

            <div className="quickview-desc-text">
              <p>{product.description || "Dress your little princess in pure elegance with this stunning dress from little RR - trusted by 10L+ happy parents across India."}</p>
            </div>

            <div className="quickview-specs-section">
              <h4 className="specs-heading">PRODUCT DETAILS</h4>
              <ul className="specs-list">
                {product.variants && product.variants.length > 0 && <li><strong>Color:</strong> {product.variants[0].color}</li>}
                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                {product.embellishment && <li><strong>Embellishment:</strong> {product.embellishment}</li>}
                {product.neck && <li><strong>Neck:</strong> {product.neck}</li>}
                {product.sleeves && <li><strong>Sleeves:</strong> {product.sleeves}</li>}
                {product.closure && <li><strong>Closure:</strong> {product.closure}</li>}
                {product.lining && <li><strong>Lining:</strong> {product.lining}</li>}
                {product.washCare && <li><strong>Wash Care:</strong> {product.washCare}</li>}
                {product.ironCare && <li><strong>Iron Care:</strong> {product.ironCare}</li>}
              </ul>
              <p className="specs-note">Note: Color may vary slightly due to photographic lighting or device display settings.</p>
            </div>

            <div className="quickview-action-group">
              {currentStock > 0 ? (
                <>
                  <div className="qty-row">
                    <div className="qty-selector">
                      <button className="qty-btn" onClick={() => dispatch(setQuantity(Math.max(1, quantity - 1)))}>&minus;</button>
                      <span className="qty-num">{quantity}</span>
                      <button 
                        className="qty-btn" 
                        onClick={() => dispatch(setQuantity(Math.min(5, quantity + 1)))}
                        disabled={quantity >= 5}
                        style={{ opacity: quantity >= 5 ? 0.5 : 1, cursor: quantity >= 5 ? 'not-allowed' : 'pointer' }}
                      >+</button>
                    </div>
                    <button
                      className="add-cart-btn"
                      onClick={handleAddToCart}
                      disabled={isAdding}
                    >
                      {isAdding ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                  <button 
                    className="buy-now-btn" 
                    onClick={handleBuyNow}
                    disabled={isAdding}
                  >
                    {isAdding ? "Processing..." : "Buy it now"}
                  </button>
                </>
              ) : (
                <button 
                  className="buy-now-btn" 
                  style={{ width: '100%', marginTop: '0' }}
                >
                  Coming soon
                </button>
              )}
            </div>

            <a 
              href={`/product/${product.id}`} 
              className="view-full-details" 
              onClick={(e) => { 
                e.preventDefault(); 
                onClose(); 
                navigate(`/product/${product.id}`); 
              }}
            >
              View Full Details &raquo;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
