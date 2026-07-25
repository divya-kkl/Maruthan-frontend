import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/Slice/cartSlice';
import { fetchOrderById } from '../../redux/Slice/checkoutSlice';
import { createReview, updateReview, fetchAllReviews, openReviewModal, closeReviewModal, setReviewRating, setReviewComment } from '../../redux/Slice/reviewSlice';
import './OrderSuccessPage.css';
import './OrderDetails.css';

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const dispatch = useDispatch();
  
  const { orderDetails, loadingOrderDetails: loading } = useSelector((state) => state.checkout);
  const { user } = useSelector((state) => state.user);
  const { 
    allReviews, 
    submitting, 
    submitSuccess,
    isReviewModalOpen,
    reviewProduct,
    reviewOrderId,
    rating,
    comment,
    editingReviewId 
  } = useSelector((state) => state.reviews);
  const isDetailsMode = window.location.pathname.includes('order-details');

  const handleOpenReviewModal = (item, orderId, initialRating = 5, initialComment = '', reviewId = null) => {
    dispatch(openReviewModal({ product: item, orderId, rating: initialRating, comment: initialComment, reviewId }));
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a star rating!");
      return;
    }
    
    // Obtain user details from redux state or fall back to localStorage
    const currentUser = user || JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      alert("Please log in to submit a review.");
      navigate('/login');
      return;
    }

    try {
      if (editingReviewId) {
        await dispatch(updateReview({
          id: editingReviewId,
          input: {
            rating: parseFloat(rating),
            comment: comment
          }
        })).unwrap();
      } else {
        const input = {
          productId: reviewProduct.productId,
          orderId: reviewOrderId,
          userId: currentUser.id || currentUser._id,
          userName: currentUser.username || 'Customer',
          rating: parseFloat(rating),
          comment: comment
        };
        await dispatch(createReview(input)).unwrap();
      }
      
      dispatch(fetchAllReviews());
      
      setTimeout(() => {
        dispatch(closeReviewModal());
      }, 2000);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Error submitting review: " + (error.message || error));
    }
  };

  useEffect(() => {
    if (!isDetailsMode) {
      dispatch(clearCart());
    }
    window.scrollTo(0, 0);

    if (orderId) {
      dispatch(fetchOrderById(orderId));
      dispatch(fetchAllReviews());
    }
  }, [dispatch, orderId, isDetailsMode]);

  return (
    <div className="order-success-container">
      <div className="order-success-card">

        {!isDetailsMode && (
          <>
            <div className="success-icon-wrapper">
              <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h1 className="success-title">Order Placed Successfully!</h1>
            <p className="success-message">
              Thank you for your purchase. Your order has been securely received and is now being processed.
            </p>
          </>
        )}

        {isDetailsMode && (
          <h1 className="success-title" style={{ marginBottom: "30px" }}>Order Details</h1>
        )}

        {orderId && (
          <div className="order-number-box">
            <span className="order-number-label">Order Reference ID:</span>
            <span className="order-number-value">{orderDetails ? orderDetails.orderNumber : orderId}</span>
          </div>
        )}

        {loading ? (
          <div className="order-loading-state">
            <span className="premium-spinner"></span>
            <p>Retrieving your order details...</p>
          </div>
        ) : orderDetails ? (
          <div className="premium-order-dashboard">
            <div className="order-dashboard-left">
              <h3 className="dashboard-section-title">Order Summary</h3>
              <div className="premium-summary-items">
                {orderDetails.items && orderDetails.items.map((item, idx) => {
                  const currentUser = user || JSON.parse(localStorage.getItem('user'));
                  const userReview = allReviews?.find(r => 
                    r.productId === item.productId && 
                    r.orderId === orderDetails.id &&
                    (currentUser && r.userId === (currentUser.id || currentUser._id))
                  );
                  return (
                    <div key={idx} className="premium-item-row">
                      <div className="premium-item-img">
                        <img src={item.image || "https://placehold.co/80x80/f5f5f5/8a2b8f?text=Product"} alt={item.name} />
                        <span className="premium-item-qty">{item.quantity}</span>
                      </div>
                      <div className="premium-item-info">
                        <div className="premium-item-header-line">
                          <span className="premium-item-name">{item.name}</span>
                          <span className="premium-item-price">
                            Rs. {(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        {isDetailsMode && (
                          orderDetails?.status?.toLowerCase() === 'delivered' && (
                            userReview ? (
                              <div className="user-submitted-review-box" style={{
                                marginTop: '8px',
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                width: '100%',
                                maxWidth: '340px',
                                boxSizing: 'border-box',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                                textAlign: 'left'
                              }}>
                                <span className="user-review-badge" style={{ fontSize: '10px', fontWeight: '700', color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Your Review</span>
                                <div className="user-review-stars" style={{ display: 'flex', gap: '2px' }}>
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span 
                                      key={star} 
                                      className={`user-review-star ${star <= userReview.rating ? 'filled' : ''}`}
                                      style={{ color: star <= userReview.rating ? '#ffc107' : '#cbd5e0', fontSize: '16px' }}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                                <p className="user-review-comment" style={{ fontSize: '12px', color: '#1e293b', margin: '4px 0 0 0', fontStyle: 'italic', lineHeight: '1.4' }}>
                                  "{userReview.comment}"
                                </p>
                                <button 
                                  type="button"
                                  className="edit-review-inline-btn"
                                  onClick={() => handleOpenReviewModal(item, orderDetails.id, userReview.rating, userReview.comment, userReview.id)}
                                  style={{
                                    marginTop: '6px',
                                    background: 'none',
                                    border: 'none',
                                    color: '#1a365d',
                                    fontWeight: '600',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                    padding: 0,
                                    textDecoration: 'underline',
                                    textAlign: 'left',
                                    alignSelf: 'flex-start'
                                  }}
                                >
                                  Edit Review
                                </button>
                              </div>
                            ) : (
                              <div className="order-item-feedback-box" style={{ 
                                marginTop: '8px',
                                backgroundColor: '#f8fafc',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                padding: '10px 14px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                width: '100%',
                                maxWidth: '340px',
                                boxSizing: 'border-box',
                                textAlign: 'left'
                              }}>
                                <span className="feedback-title" style={{ fontSize: '12px', fontWeight: '600', color: '#64748b' }}>How was the product?</span>
                                <div className="feedback-stars-row" style={{ display: 'flex', justifyContent: 'space-between', gap: '3px' }}>
                                  {[
                                    { val: 1, label: 'Very Bad' },
                                    { val: 2, label: 'Bad' },
                                    { val: 3, label: 'Ok-Ok' },
                                    { val: 4, label: 'Good' },
                                    { val: 5, label: 'Very Good' }
                                  ].map((starObj) => (
                                    <div 
                                      key={starObj.val} 
                                      className="feedback-star-col"
                                      onClick={() => handleOpenReviewModal(item, orderDetails.id, starObj.val)}
                                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', flex: 1 }}
                                    >
                                      <span className="feedback-star-outline" style={{ fontSize: '20px', color: '#cbd5e0', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#ffc107'} onMouseLeave={(e) => e.target.style.color = '#cbd5e0'}>☆</span>
                                      <span className="feedback-star-label" style={{ fontSize: '9px', color: '#718096', marginTop: '2px', textAlign: 'center', whiteSpace: 'nowrap' }}>{starObj.label}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="premium-summary-totals">
                <div className="premium-total-row">
                  <span>Subtotal</span>
                  <span>Rs. {orderDetails.subTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="premium-total-row">
                  <span>Shipping & Handling</span>
                  <span>{orderDetails.deliveryCharge === 0 ? "Complimentary" : `Rs. ${orderDetails.deliveryCharge}`}</span>
                </div>
                <div className="premium-total-row premium-grand-total">
                  <span>Total Amount</span>
                  <span>Rs. {orderDetails.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="order-dashboard-right">
              <div className="premium-shipping-card">
                <h3 className="dashboard-section-title">Order Status</h3>
                <div className="payment-method-content">
                  <div className="payment-badge" style={{ textTransform: 'uppercase' }}>
                    {orderDetails.status}
                  </div>
                </div>
              </div>

              <div className="premium-shipping-card" style={{ marginTop: '20px' }}>
                <h3 className="dashboard-section-title">Shipping Details</h3>
                <div className="shipping-address-content">
                  <p className="shipping-name">{orderDetails.deliveryAddress?.name}</p>
                  <p>{orderDetails.deliveryAddress?.street}</p>
                  <p>{orderDetails.deliveryAddress?.city}, {orderDetails.deliveryAddress?.state}</p>
                  <p>{orderDetails.deliveryAddress?.country}</p>
                  <div className="shipping-contact">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>{orderDetails.deliveryAddress?.phone}</span>
                  </div>
                </div>
              </div>

              {orderDetails.notes && (
                <div className="premium-shipping-card" style={{ marginTop: '20px' }}>
                  <h3 className="dashboard-section-title">Order Notes</h3>
                  <div className="payment-method-content">
                    <p style={{ margin: 0, fontSize: '14px', color: '#555', whiteSpace: 'pre-wrap' }}>{orderDetails.notes}</p>
                  </div>
                </div>
              )}

              <div className="premium-shipping-card" style={{ marginTop: '20px' }}>
                <h3 className="dashboard-section-title">Payment Method</h3>
                <div className="payment-method-content">
                  <div className="payment-badge">
                    {orderDetails.paymentMethod === 'COD' 
                      ? 'Cash on Delivery' 
                      : (orderDetails.paymentMethod === 'RAZORPAY' ? 'Online Payment' : orderDetails.paymentMethod)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="error-state-msg">Unable to load order details at this time.</p>
        )}

        <div className="success-actions">
          <button className="action-btn success-primary-btn" onClick={() => navigate('/profile', { state: { activeTab: 'orders' } })}>
            View My Orders
          </button>
          <button className="action-btn success-secondary-btn" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
        </div>

        <div className="success-footer-note">
          <p>You will receive an order confirmation email with details of your order and a link to track its progress.</p>
        </div>
      </div>

      {isReviewModalOpen && reviewProduct && (
        <div className="review-modal-overlay" onClick={() => dispatch(closeReviewModal())}>
          <div className="review-modal-card" onClick={(e) => e.stopPropagation()}>
            {submitSuccess ? (
              <div className="review-modal-success-content">
                <div className="success-checkmark-wrapper">
                  <svg className="checkmark-modal" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark-modal-circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark-modal-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h3>Thank you!</h3>
                <p>Your review has been submitted successfully.</p>
              </div>
            ) : (
              <>
                <div className="review-modal-header">
                  <h3>Write a Review</h3>
                  <button className="review-modal-close" onClick={() => dispatch(closeReviewModal())}>&#x2715;</button>
                </div>
                
                <div className="review-modal-product-info">
                  <img 
                    src={reviewProduct.image} 
                    alt={reviewProduct.name} 
                    onError={(e) => { e.target.src = "https://placehold.co/80x80/f5f5f5/8a2b8f?text=Product" }}
                  />
                  <div>
                    <h4>{reviewProduct.name}</h4>
                  </div>
                </div>
                
                <div className="review-rating-input-group">
                  <label>Your Rating:</label>
                  <div className="review-star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        className={`review-star-input ${star <= rating ? 'selected' : ''}`}
                        onClick={() => dispatch(setReviewRating(star))}
                        style={{ cursor: 'pointer', fontSize: '24px', marginRight: '5px' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="review-comment-input-group">
                  <label>Your Review:</label>
                  <textarea
                    placeholder="Share your thoughts about this product..."
                    value={comment}
                    onChange={(e) => dispatch(setReviewComment(e.target.value))}
                    rows="4"
                  />
                </div>
                
                <div className="review-modal-actions">
                  <button className="review-cancel-btn" onClick={() => dispatch(closeReviewModal())}>Cancel</button>
                  <button 
                    className="review-submit-btn" 
                    onClick={handleSubmitReview}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSuccessPage;
