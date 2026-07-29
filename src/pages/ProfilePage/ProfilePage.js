import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiChevronRight } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, fetchUserOrders, updateUserAddress, logout as logoutAction, setUser } from '../../redux/Slice/userSlice';
import { createReview, updateReview, fetchAllReviews, openReviewModal, closeReviewModal, setReviewRating, setReviewComment } from '../../redux/Slice/reviewSlice';
import AddAddressModal from '../../components/AddAddressModal/AddAddressModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { user, orders, loadingOrders } = useSelector((state) => state.user);
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

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      navigate('/login');
      return;
    }

    let currentUser = user;
    if (!currentUser && storedUser) {
      currentUser = JSON.parse(storedUser);
      dispatch(setUser(currentUser));
    }

    if (currentUser) {
      dispatch(fetchUserDetails({ userId: currentUser.id || currentUser._id, token }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, dispatch]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      const token = localStorage.getItem('token');
      dispatch(fetchUserOrders({ userId: user.id || user._id, token }));
      dispatch(fetchAllReviews());
    }
  }, [activeTab, user, dispatch]);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('guestId');
    dispatch(logoutAction());
    navigate('/login');
  };

  const handleSaveAddress = async (newAddress) => {
    try {
      const token = localStorage.getItem('token');
      const userId = user.id || user._id;
      
      await dispatch(updateUserAddress({ 
        userId, 
        token, 
        newAddress, 
        currentAddresses: user.addresses 
      })).unwrap();
      
      setIsAddressModalOpen(false);
    } catch (error) {
      console.error("Error updating user addresses:", error);
      alert("Failed to save address: " + (error.message || error));
    }
  };

  const handleOpenReviewModal = (item, orderId, initialRating = 5, initialComment = '', reviewId = null) => {
    dispatch(openReviewModal({ product: item, orderId, rating: initialRating, comment: initialComment, reviewId }));
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      alert("Please select a star rating!");
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
          userId: user.id || user._id,
          userName: user.username || 'Customer',
          rating: parseFloat(rating),
          comment: comment
        };
        await dispatch(createReview(input)).unwrap();
      }
      
      // Refresh user orders and reviews
      const token = localStorage.getItem('token');
      dispatch(fetchUserOrders({ userId: user.id || user._id, token }));
      dispatch(fetchAllReviews());
      
      setTimeout(() => {
        dispatch(closeReviewModal());
      }, 2000);
    } catch (error) {
      console.error("Failed to submit review:", error);
      alert("Error submitting review: " + (error.message || error));
    }
  };

  if (!user) return <div className="profile-loading">Loading...</div>;

  return (
    <div className="profile-page-container">
      <div className="profile-main">
        {/* Left Sidebar */}
        <div className="profile-sidebar">
          <div
            className={`sidebar-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </div>
          <div
            className={`sidebar-item ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </div>
        </div>

        {/* Right Content */}
        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-tab-content">
              {/* Personal Info */}
              <div className="profile-card">
                <div className="profile-card-header">
                  <h3>{user.username ? user.username.toUpperCase() : 'USER'}</h3>
                </div>
                <div className="profile-card-body">
                  <div className="info-row">
                    <span className="info-label">Email</span>
                    <span className="info-value">{user.email}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Phone number</span>
                    <span className="info-value">{user.phone_number || 'Not provided'}</span>
                  </div>
                </div>
              </div>

              {/* Addresses */}
              <div className="profile-section-header">
                <h3>Addresses</h3>
                <button className="add-btn" onClick={() => setIsAddressModalOpen(true)}>Add</button>
              </div>
              <div className="profile-card bg-gray">
                {user.addresses && user.addresses.length > 0 ? (
                  <div className="addresses-list">
                    {user.addresses.map((addr, idx) => (
                      <div key={idx} className="address-item" style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '16px',
                        background: '#fff',
                        border: '1px solid #eaeaea',
                        borderRadius: '12px',
                        marginBottom: '12px',
                        cursor: 'pointer'
                      }}>
                        <div style={{
                          background: '#f5f5f5',
                          padding: '12px',
                          borderRadius: '8px',
                          marginRight: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <FiMapPin size={20} color="#000" />
                        </div>
                        <div style={{ flex: 1, paddingRight: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '14px', color: '#000', textTransform: 'uppercase' }}>{addr.firstName} {addr.lastName}</strong>
                            {addr.isDefault && <span style={{ fontSize: '11px', background: '#f5f5f5', color: '#000', fontWeight: '500', padding: '2px 8px', borderRadius: '12px', marginLeft: '8px' }}>Default</span>}
                          </div>
                          <div style={{ color: '#333', fontSize: '13px', lineHeight: '1.4' }}>
                            {`${addr.address}${addr.apartment ? `, ${addr.apartment}` : ''}, ${addr.pincode ? addr.pincode + ' ' : ''}${addr.city} ${addr.state}, ${addr.country}`}
                          </div>
                        </div>
                        <FiChevronRight size={20} color="#999" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-address-message">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
                    <span>No addresses added</span>
                  </div>
                )}
              </div>

              {/* Marketing Preferences
              <div className="profile-section-header">
                <h3>Marketing preferences</h3>
              </div>
              <div className="profile-card">
                <div className="marketing-row">
                  <div className="marketing-icon-label">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    <span>Email</span>
                  </div>
                  <div className="toggle-switch active">
                    <div className="toggle-circle">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b2e88" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Sign Out Links */}
              <div className="signout-links">
                <button className="signout-btn" onClick={handleSignOut}>Sign out</button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-tab-content">
              <h2>Your Orders</h2>
              {loadingOrders ? (
                <p className="loading-text">Loading orders...</p>
              ) : orders.length === 0 ? (
                <div className="no-orders">
                  <p>You haven't placed any orders yet.</p>
                  <button onClick={() => navigate('/')}>Start Shopping</button>
                </div>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div 
                      className="order-card" 
                      key={order.id} 
                      onClick={() => {
                        if (order.items && order.items.length > 0) {
                          navigate(`/product/${order.items[0].productId}`);
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="order-header">
                        <span className="order-number">Order #{order.orderNumber}</span>
                        <span className="order-date">
                          {order.createdAt && !isNaN(parseInt(order.createdAt))
                            ? new Date(parseInt(order.createdAt)).toLocaleDateString()
                            : new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`order-status ${order.status?.toLowerCase()}`}>{order.status}</span>
                      </div>
                      <div className="order-body" style={{ display: 'grid', gridTemplateColumns: order.deliveryAddress ? '1.8fr 1.2fr 0.9fr' : '1fr 0.9fr', columnGap: '24px', rowGap: '20px', alignItems: 'start', padding: '20px 24px' }}>
                        {/* Address Column - Spans all rows */}
                        <div className="order-address-column" style={{ gridColumn: '2', gridRow: `1 / span ${Math.max(1, order.items ? order.items.length : 1)}`, background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          {order.deliveryAddress && (
                            <div className="order-address-info">
                              <h5 style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '700' }}>Delivery Address</h5>
                              <p style={{ margin: 0, fontSize: '14px', color: '#1e293b' }}><strong>{order.deliveryAddress.name}</strong></p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#475569', lineHeight: '1.4' }}>
                                {order.deliveryAddress.street}, {order.deliveryAddress.city}
                              </p>
                              <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#475569' }}>
                                {order.deliveryAddress.state}, {order.deliveryAddress.country}
                              </p>
                              <p style={{ margin: '6px 0 0 0', fontSize: '13px', color: '#475569' }}>
                                <strong>Phone:</strong> {order.deliveryAddress.phone}
                              </p>
                            </div>
                          )}

                          {order.notes && (
                            <div className="order-notes-info" style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #cbd5e1' }}>
                              <h5 style={{ margin: '0 0 6px 0', fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>Order Notes</h5>
                              <p style={{ margin: 0, fontSize: '12px', color: '#475569', whiteSpace: 'pre-wrap' }}>{order.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Items and Prices */}
                        {order.items && order.items.map((item, idx) => {
                          const userReview = allReviews?.find(r => 
                            r.productId === item.productId && 
                            r.orderId === order.id &&
                            r.userId === (user.id || user._id)
                          );
                          return (
                            <React.Fragment key={idx}>
                              <div className="order-item-left" style={{ gridColumn: '1', display: 'flex', alignItems: 'flex-start', borderBottom: idx < order.items.length - 1 ? '1px solid #f0f0f0' : 'none', paddingBottom: idx < order.items.length - 1 ? '15px' : '0' }}>
                                <img src={item.image} alt={item.name} style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '6px', marginRight: '15px', flexShrink: 0 }} onError={(e) => { e.target.src = "https://placehold.co/64x64/e8e8e8/8a2b8f?text=Item" }} />
                                <div className="order-item-details" style={{ flex: 1, textAlign: 'left' }}>
                                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>{item.name}</h4>
                                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>Qty: {item.quantity}{item.size ? ` | Size: ${item.size}` : ''}</p>
                                  {order.status?.toLowerCase() === 'delivered' && (
                                    userReview ? (
                                      <div className="user-submitted-review-box">
                                        <span className="user-review-badge">Your Review</span>
                                        <div className="user-review-stars" style={{ display: 'flex', gap: '2px' }}>
                                          {[1, 2, 3, 4, 5].map((star) => (
                                            <span 
                                              key={star} 
                                              className={`user-review-star ${star <= userReview.rating ? 'filled' : ''}`}
                                              style={{ color: star <= userReview.rating ? '#ffc107' : '#cbd5e0', fontSize: '18px' }}
                                            >
                                              ★
                                            </span>
                                          ))}
                                        </div>
                                        <p className="user-review-comment">
                                          "{userReview.comment}"
                                        </p>
                                        <button 
                                          type="button"
                                          className="edit-review-inline-btn"
                                          onClick={(e) => { e.stopPropagation(); handleOpenReviewModal(item, order.id, userReview.rating, userReview.comment, userReview.id); }}
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
                                      <div className="order-item-feedback-box">
                                        <span className="feedback-title">How was the product?</span>
                                        <div className="feedback-stars-row">
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
                                              onClick={(e) => { e.stopPropagation(); handleOpenReviewModal(item, order.id, starObj.val); }}
                                            >
                                              <span className="feedback-star-outline">☆</span>
                                              <span className="feedback-star-label">{starObj.label}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                              <div className="order-item-price-col" style={{ gridColumn: '3', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', fontWeight: '700', fontSize: '15px', color: '#0F2D5C', paddingTop: '2px', borderBottom: idx < order.items.length - 1 ? '1px solid #f0f0f0' : 'none', paddingBottom: idx < order.items.length - 1 ? '15px' : '0' }}>
                                Rs. {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                              </div>
                            </React.Fragment>
                          );
                        })}
                      </div>

                      <div className="order-footer">
                        <span>Total: <strong>Rs. {order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
                        <button className="view-order-btn" onClick={(e) => { e.stopPropagation(); navigate(`/order-details/${order.id}`); }}>
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isAddressModalOpen && (
        <AddAddressModal onClose={() => setIsAddressModalOpen(false)} onSave={handleSaveAddress} />
      )}

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

export default ProfilePage;
