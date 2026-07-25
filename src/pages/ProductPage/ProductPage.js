import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiShare2, FiMaximize2, FiTruck, FiTag, FiBox, FiCopy, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa';
import SizeChart from '../../components/SizeChart/SizeChart';
import RelatedProducts from '../../components/RelatedProducts/RelatedProducts';
import { addToCart } from '../../redux/Slice/cartSlice';
import { fetchProductById, resetProductDetails, setSelectedSize, ALL_SIZES } from '../../redux/Slice/productDetailsSlice';
import { fetchProductReviews } from '../../redux/Slice/reviewSlice';
import { fetchFAQ } from '../../redux/Slice/FAQSlice';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { product, loading, error, selectedSize } = useSelector((state) => state.productDetails);
  const { reviews, averageRating: reviewAverage, totalCount: reviewCount } = useSelector((state) => state.reviews);
  const faqs = useSelector((state) => state.FAQ.FAQ) || [];
  const [activeImage, setActiveImage] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);
  const imageRef = useRef(null);
  const reviewsSectionRef = useRef(null);

  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageLoaded(true);
      return;
    }
    
    setImageLoaded(false);

    // Safety fallback: maximum 1.2 seconds of shimmer animation
    const timer = setTimeout(() => {
      setImageLoaded(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, [activeImage]);

  const [quantity, setQuantity] = useState(1);
  const [openFaqs, setOpenFaqs] = useState({});
  const [openAccordions, setOpenAccordions] = useState([]);
  const [shareSent, setShareSent] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setQuantity(1);
    setIsZoomed(false);
    
    if (id) {
      dispatch(fetchProductById(id));
      dispatch(fetchProductReviews(id));
    }
    
    // Using fetchFAQ from FAQSlice (fetches active FAQs)
    dispatch(fetchFAQ());

    return () => {
      dispatch(resetProductDetails());
    };
  }, [id, dispatch]);

  // Sync active image and selected size when product loads
  useEffect(() => {
    if (product) {
      if (product.images && product.images.length > 0) {
        setActiveImage(product.images[0]);
      }
      if (product.variants && product.variants.length > 0 && !selectedSize) {
        dispatch(setSelectedSize(product.variants[0].size));
      }
    }
  }, [product, dispatch, selectedSize]);

  const scrollToReviews = () => {
    reviewsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const toggleFaq = (faqId) => {
    setOpenFaqs(prev => ({ ...prev, [faqId]: !prev[faqId] }));
  };

  const handleAddToCart = () => {
    if (product && selectedSize) {
      dispatch(addToCart({ product, quantity, size: selectedSize }));
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (product && selectedSize) {
      dispatch(addToCart({ product, quantity, size: selectedSize }));
      navigate('/checkout');
    }
  };

  const toggleAccordion = (section) => {
    if (openAccordions.includes(section)) {
      setOpenAccordions(openAccordions.filter(s => s !== section));
    } else {
      setOpenAccordions([...openAccordions, section]);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareSent(true);
      setTimeout(() => setShareSent(false), 2000);
    });
  };

  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = Math.max(0, product.images.indexOf(activeImage));
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setActiveImage(product.images[prevIndex]);
  };
  const handleNextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = Math.max(0, product.images.indexOf(activeImage));
    const nextIndex = (currentIndex + 1) % product.images.length;
    setActiveImage(product.images[nextIndex]);
  };

  if (loading) {
    return (
      <div className="product-page-container skeleton-loading">
        <div className="product-image-section">
          <div className="product-thumbnails">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="thumbnail skeleton-shimmer" style={{ width: '70px', height: '90px' }}></div>
            ))}
          </div>
          <div className="product-main-image-wrapper">
            <div className="product-image-shimmer"></div>
          </div>
        </div>

        <div className="product-details-section">
          <div className="skeleton-line brand skeleton-shimmer"></div>
          <div className="skeleton-line title skeleton-shimmer"></div>
          <div className="skeleton-line price skeleton-shimmer"></div>
          <div className="skeleton-line meta skeleton-shimmer"></div>
          <div className="skeleton-block delivery skeleton-shimmer"></div>
          <div className="skeleton-line stock skeleton-shimmer"></div>
          <div className="skeleton-block actions skeleton-shimmer"></div>
          <div className="skeleton-block accordion skeleton-shimmer"></div>
        </div>
      </div>
    );
  }

  if (error || !product) return <div className="product-page-error">{error || "Product not found"}</div>;

  const selectedVariant = product.variants?.find(v => v.size === selectedSize);
  const currentStock = selectedVariant ? selectedVariant.stock : (product.variants?.[0]?.stock || 0);
  const stockProgress = Math.min((currentStock / 50) * 100, 100);

  const ratingDistribution = [0, 0, 0, 0, 0];
  if (reviews && reviews.length > 0) {
    reviews.forEach(r => {
      const roundedRating = Math.round(r.rating);
      if (roundedRating >= 1 && roundedRating <= 5) {
        ratingDistribution[roundedRating - 1]++;
      }
    });
  }
  const totalDistributionReviews = reviews ? reviews.length : 0;
  const getPercentage = (count) => {
    if (totalDistributionReviews === 0) return 0;
    const denominator = Math.max(totalDistributionReviews, 10);
    return Math.round((count / denominator) * 100);
  };

  return (
    <>
    <div className="product-page-container">
      {/* Left Column: Images */}
      <div className="product-image-section">
        <div className="product-thumbnails">
          {product.images && product.images.length > 0 ? (
            product.images.map((img, index) => (
              <img 
                key={index}
                src={img} 
                alt={`${product.name} thumbnail ${index + 1}`}
                className={`thumbnail ${activeImage === img ? 'active' : ''}`}
                onClick={() => setActiveImage(img)}
              />
            ))
          ) : (
            <img src="/images/placeholder.png" alt="Placeholder" className="thumbnail active" />
          )}
        </div>
        <div className="product-main-image-wrapper">
          {!imageLoaded && <div className="product-image-shimmer"></div>}
          
          {product.images && product.images.length > 1 && (
            <>
              <button className="nav-arrow left-arrow" onClick={handlePrevImage} aria-label="Previous image">
                <FiChevronLeft />
              </button>
              <button className="nav-arrow right-arrow" onClick={handleNextImage} aria-label="Next image">
                <FiChevronRight />
              </button>
            </>
          )}

          <img 
            ref={imageRef}
            src={activeImage || "/images/placeholder.png"} 
            alt={product.name} 
            className="product-main-image" 
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
            onLoad={() => setImageLoaded(true)}
            onClick={() => setIsZoomed(true)}
          />
          <button className="expand-icon" onClick={() => setIsZoomed(true)}><FiMaximize2 /></button>
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="product-details-section">
        <div className="product-brand">{product.brand || "Prince N Princess"}</div>
        <h1 className="product-title">{product.name}</h1>
        
        <div className="product-rating" onClick={scrollToReviews} style={{ cursor: 'pointer', width: 'fit-content' }}>
          <div className="stars" style={{ display: 'flex', gap: '2px' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <AiFillStar 
                key={star} 
                color={star <= Math.round(reviewAverage || 0) ? '#ffc107' : '#e4e5e9'} 
                style={{ fontSize: '16px' }}
              />
            ))}
          </div>
          <span style={{ fontSize: '13px', color: '#666' }}>
            {reviewAverage > 0 ? `${reviewAverage.toFixed(1)} ` : ''}({reviewCount || 0} {reviewCount === 1 ? 'review' : 'reviews'})
          </span>
        </div>

        <div className="product-price-row">
          <div className="product-price">
            Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>

          <div className="product-meta-links">
            <div className="meta-link" onClick={handleShare} style={{ cursor: 'pointer' }}><FiShare2 /> Share</div>
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <div className="ask-modal-overlay" onClick={() => setShowShareModal(false)}>
            <div className="share-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ask-modal-header">
                <h3>Copy link</h3>
                <button className="ask-modal-close" onClick={() => setShowShareModal(false)}>&#x2715;</button>
              </div>
              
              <div className="share-link-container">
                <div className="share-link-input">{window.location.href}</div>
                <button className="share-copy-btn" onClick={handleCopyLink} title="Copy Link">
                  <FiCopy />
                </button>
              </div>
              {shareSent && <p className="ask-success" style={{marginTop: '-10px', marginBottom: '15px'}}>✅ Link copied!</p>}
              
              <p className="share-text">Share:</p>
              <div className="share-social-buttons">
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="social-circle">
                  <FaFacebookF />
                </a>
                <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(product?.name || 'Product')}`} target="_blank" rel="noopener noreferrer" className="social-circle">
                  <FaTwitter />
                </a>
                <a href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(product?.images?.[0] || '')}&description=${encodeURIComponent(product?.name || 'Product')}`} target="_blank" rel="noopener noreferrer" className="social-circle">
                  <FaPinterestP />
                </a>
              </div>
            </div>
          </div>
        )}


        <div className="delivery-info-box">
          <div className="delivery-item">
            <FiTruck className="delivery-icon" />
            <div>Estimate delivery times: 2-7 Business days depends on Location.</div>
          </div>
          <div className="delivery-item">
            <FiTag className="delivery-icon" />
            <div>Orders are typically dispatched within 1-3 working days. During peak seasons, dispatch may take up to 3-4 working days.</div>
          </div>
          <div className="delivery-item">
            <FiBox className="delivery-icon" />
            <div>Free shipping: On all orders above ₹2000 within India.</div>
          </div>
        </div>

     

        <div className="stock-warning">
          {currentStock > 0 ? (
            <>Hurry up! Only <span>{currentStock} item(s)</span> left in stock</>
          ) : (
            <span style={{ color: 'red' }}>Out of stock</span>
          )}
        </div>
        <div className="stock-progress-bar">
          <div className="stock-progress-fill" style={{ width: `${currentStock > 0 ? stockProgress : 0}%`, backgroundColor: currentStock < 5 ? '#e74c3c' : '#111' }}></div>
        </div>

        <div className="size-selector-section">
          <div className="size-label">
            Size: <strong>{(() => {
              const matched = ALL_SIZES.find(s => s.key.toLowerCase() === selectedSize?.toLowerCase() || s.display.toLowerCase() === selectedSize?.toLowerCase());
              return matched ? matched.display : selectedSize;
            })()}</strong>
          </div>
          <div className="size-options">
            {(() => {
              const availableSizes = (product?.variants || []).reduce((acc, variant) => {
                if (!variant.size) return acc;
                const exists = acc.some(item => item.rawSize.toLowerCase() === variant.size.toLowerCase());
                if (!exists) {
                  const matched = ALL_SIZES.find(s => s.key.toLowerCase() === variant.size.toLowerCase() || s.display.toLowerCase() === variant.size.toLowerCase());
                  acc.push({
                    key: matched ? matched.key : variant.size,
                    display: matched ? matched.display : variant.size,
                    rawSize: variant.size,
                    orderIndex: matched ? ALL_SIZES.findIndex(s => s.key === matched.key) : 99
                  });
                }
                return acc;
              }, []).sort((a, b) => a.orderIndex - b.orderIndex);

              return availableSizes.map(sizeOpt => {
                const isActive = selectedSize?.toLowerCase() === sizeOpt.rawSize.toLowerCase() || 
                                 selectedSize?.toLowerCase() === sizeOpt.key.toLowerCase() || 
                                 selectedSize?.toLowerCase() === sizeOpt.display.toLowerCase();

                return (
                  <button 
                    key={sizeOpt.key}
                    className={`size-option ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      dispatch(setSelectedSize(sizeOpt.rawSize));
                    }}
                  >
                    {sizeOpt.display}
                  </button>
                );
              });
            })()}
          </div>
        </div>

        <div className="product-actions">
          <div className="qty-selector">
            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>&minus;</button>
            <input type="text" className="qty-input" value={quantity} readOnly />
            <button 
              className="qty-btn" 
              onClick={() => setQuantity(prev => Math.min(5, prev + 1))}
              disabled={quantity >= 5}
              style={{ opacity: quantity >= 5 ? 0.5 : 1, cursor: quantity >= 5 ? 'not-allowed' : 'pointer' }}
            >+</button>
          </div>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          <button className="buy-now-btn" onClick={handleBuyNow}>Buy it now</button>
        </div>

        <div className="product-accordions">
          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleAccordion('description')}>
              <span>Description</span>
              <span className="accordion-icon">{openAccordions.includes('description') ? '−' : '+'}</span>
            </div>
            {openAccordions.includes('description') && (
              <div className="accordion-content">
                {product.description ? (
                  <div dangerouslySetInnerHTML={{ __html: product.description }} />
                ) : (
                  "Dress your little princess in pure elegance with this stunning dress from Prince N Princess - trusted by 10L+ happy parents across India."
                )}
              </div>
            )}
          </div>
          
          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleAccordion('shipping')}>
              <span>Shipping and Returns</span>
              <span className="accordion-icon">{openAccordions.includes('shipping') ? '−' : '+'}</span>
            </div>
            {openAccordions.includes('shipping') && (
              <div className="accordion-content">
                <p style={{ fontSize: '18px', marginBottom: '15px' }}>Shipping Policy</p>
                <p>We offer free shipping on all prepaid orders above ₹1500 within India.</p>
                <p>For Cash on Delivery (COD) orders, an additional ₹40 COD fee and standard shipping charges apply. All COD orders are dispatched only after mobile number confirmation.</p>
                <p>We also ship internationally shipping charges are calculated at checkout based on your delivery location.</p>
                
                <p style={{ fontSize: '18px', marginTop: '20px', marginBottom: '15px' }}>Processing & Delivery Timeline</p>
                <p>Orders are typically processed within 2-3 business days.</p>
                <p>Delivery time ranges from 5-7 business days post-dispatch, depending on your location and courier partner availability.</p>

                <p style={{ fontSize: '18px', marginTop: '20px', marginBottom: '15px' }}>Exchange & Refund Policy</p>
                <p>We do not offer refunds on shipped and delivered items.</p>
                <p>Refunds are only applicable under the following conditions:</p>
                <ul style={{ marginLeft: '20px', marginBottom: '15px' }}>
                  <li>If the product is out of stock at the time of dispatch.</li>
                  <li>If the product is found damaged during our internal quality check before dispatch.</li>
                </ul>
                <p>Every order is packed with care to ensure a premium unboxing experience for your little one.</p>
              </div>
            )}
          </div>

          <div className="accordion-item">
            <div className="accordion-header" onClick={() => toggleAccordion('store')}>
              <span>Our Offline Store</span>
              <span className="accordion-icon">{openAccordions.includes('store') ? '−' : '+'}</span>
            </div>
            {openAccordions.includes('store') && (
              <div className="accordion-content">
                <p style={{ marginBottom: '15px' }}>Our Little R.R is open every day, except on Diwali and Pongal Holidays. We welcome you throughout the year with the same warmth and service. Experience Quality and Craftsmanship at Our Trusted Offline Stores.</p>
                <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                  <li>Velachery, Chennai: <a href="tel:9786221122" style={{ color: 'inherit', textDecoration: 'underline' }}>9786221122</a></li>
                  <li>RS Puram, Coimbatore: <a href="tel:9786221122" style={{ color: 'inherit', textDecoration: 'underline' }}>9786221122</a></li>
                  <li>Singanallur, Coimbatore: <a href="tel:9786221122" style={{ color: 'inherit', textDecoration: 'underline' }}>9786221122</a></li>
                </ol>
              </div>
            )}
          </div>

        </div>
      </div>
      {/* Zoom Overlay */}
      {isZoomed && (
        <div className="image-zoom-overlay" onClick={() => setIsZoomed(false)}>
          <button className="zoom-close-btn" onClick={() => setIsZoomed(false)}>
            <FiX />
          </button>
          
          {product.images && product.images.length > 1 && (
            <>
              <button 
                className="zoom-nav-arrow left-arrow" 
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }} 
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>
              <button 
                className="zoom-nav-arrow right-arrow" 
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }} 
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
            </>
          )}

          <img 
            src={activeImage || "/images/placeholder.png"} 
            alt={product.name} 
            className="zoomed-image" 
            onClick={(e) => e.stopPropagation()} 
          />
        </div>
      )}
    </div>
    
    <div style={{ marginTop: '40px', paddingBottom: '40px' }}>
      <RelatedProducts key={id} title="New Arrivals" />
    </div>
    
    {/* Reviews & Ratings Section */}
    <div className="product-reviews-section" ref={reviewsSectionRef}>
      <h2 className="reviews-section-title">Customer Ratings & Reviews</h2>
      
      <div className="reviews-dashboard">
        <div className="reviews-top-summary">
          {/* Left Side: Summary Card */}
          <div className="overall-rating-card">
            <div className="rating-pill">
              <span style={{ fontSize: '26px', fontWeight: '700', lineHeight: '1' }}>{(reviewAverage || 0).toFixed(1)}</span>
              <span style={{ fontSize: '20px', lineHeight: '1' }}>★</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'center' }}>
              <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600' }}>
                {(reviewCount || 0).toLocaleString('en-IN')} ratings
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '500' }}>
                {(reviews ? reviews.length : 0).toLocaleString('en-IN')} reviews
              </div>
            </div>
          </div>

          {/* Middle/Distribution List */}
          <div className="rating-distribution-card">
            <div className="rating-distribution-list">
              {[
                { starsCount: 5, label: 'Very Good', color: 'linear-gradient(90deg, #10b981, #059669)' },
                { starsCount: 4, label: 'Good', color: 'linear-gradient(90deg, #22c55e, #16a34a)' },
                { starsCount: 3, label: 'Ok-Ok', color: 'linear-gradient(90deg, #eab308, #ca8a04)' },
                { starsCount: 2, label: 'Bad', color: 'linear-gradient(90deg, #f97316, #ea580c)' },
                { starsCount: 1, label: 'Very Bad', color: 'linear-gradient(90deg, #ef4444, #dc2626)' }
              ].map((item) => {
                const count = ratingDistribution[item.starsCount - 1];
                const pct = getPercentage(count);
                return (
                  <div key={item.starsCount} className="distribution-row">
                    <span className="distribution-label">{item.label}</span>
                    <div className="distribution-bar-bg">
                      <div className="distribution-bar-fill" style={{ width: `${pct}%`, background: item.color }}></div>
                    </div>
                    <span className="distribution-count">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Reviews List */}
        <div className="reviews-list-card">
          {reviews && reviews.length > 0 ? (
            <div className="reviews-list">
              {reviews.map((rev) => (
                <div key={rev.id} className="review-item-card">
                  <div className="review-item-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div className="review-user-info" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div className="review-user-avatar">
                        {rev.userName ? rev.userName.charAt(0).toUpperCase() : 'C'}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span className="review-user-name" style={{ fontWeight: '700', fontSize: '15px', color: '#0f172a' }}>{rev.userName || 'Customer'}</span>
                        <span className="review-verified-badge">✓ Verified Purchase</span>
                      </div>
                    </div>
                    <div className="review-item-rating-date" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                      <div className="review-item-stars" style={{ display: 'flex', gap: '3px' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <AiFillStar 
                            key={star} 
                            color={star <= Math.round(rev.rating) ? '#f59e0b' : '#e2e8f0'} 
                            style={{ fontSize: '16px' }}
                          />
                        ))}
                      </div>
                      <span className="review-item-date" style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                        {rev.createdAt && !isNaN(parseInt(rev.createdAt))
                          ? new Date(parseInt(rev.createdAt)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                          : new Date(rev.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  <div className="review-item-comment" style={{ fontSize: '14px', color: '#555', lineHeight: '1.6', paddingLeft: '52px' }}>
                    {rev.comment || <em style={{ color: '#888' }}>No comment left.</em>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reviews-state" style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
              <div className="empty-reviews-icon" style={{ fontSize: '48px', color: '#ddd', marginBottom: '15px' }}>★</div>
              <h3 style={{ margin: '0 0 8px 0', color: '#444' }}>No Reviews Yet</h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#777', maxWidth: '360px', marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.5' }}>
                Be the first to share your thoughts on this product! Submit a review from your "My Orders" page after purchasing.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {faqs.length > 0 && (
        <div className="standalone-faq-container">
          <h2 className="standalone-faq-title">FAQ</h2>
          <div className="standalone-faq-list">
            {faqs.map((faq) => (
              <div key={faq.id} className="standalone-faq-item">
                <div
                  className={`standalone-faq-question ${openFaqs[faq.id] ? 'open' : ''}`}
                  onClick={() => toggleFaq(faq.id)}
                >
                  <span>{faq.question}</span>
                  <span className="standalone-faq-icon">{openFaqs[faq.id] ? '−' : '+'}</span>
                </div>
                {openFaqs[faq.id] && (
                  <div className="standalone-faq-answer">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Static Size Chart Component */}
      <SizeChart />
  </>
  );
};

export default ProductPage;
