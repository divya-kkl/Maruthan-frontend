import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMapPin, FiChevronRight } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserDetails, fetchUserOrders, updateUserAddress, logout as logoutAction, setUser } from '../../redux/Slice/userSlice';
import AddAddressModal from '../../components/AddAddressModal/AddAddressModal';
import './ProfilePage.css';

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'profile');
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  const { user, orders, loadingOrders } = useSelector((state) => state.user);

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

  }, [navigate, dispatch]);

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      const token = localStorage.getItem('token');
      dispatch(fetchUserOrders({ userId: user.id || user._id, token }));
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
      alert("Failed to save address. Please try again.");
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
                  <button className="edit-btn">Edit</button>
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

              {/* Marketing Preferences */}
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
              </div>

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
                    <div className="order-card" key={order.id}>
                      <div className="order-header">
                        <span className="order-number">Order #{order.orderNumber}</span>
                        <span className="order-date">
                          {order.createdAt && !isNaN(parseInt(order.createdAt))
                            ? new Date(parseInt(order.createdAt)).toLocaleDateString()
                            : new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`order-status ${order.status?.toLowerCase()}`}>{order.status}</span>
                      </div>
                      <div className="order-body" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', rowGap: '15px', marginTop: '15px' }}>
                        {/* Address Column - Spans all rows */}
                        <div style={{ gridColumn: '2', gridRow: `1 / span ${Math.max(1, order.items ? order.items.length : 1)}`, padding: '0 15px', borderLeft: '1px solid #eee', borderRight: '1px solid #eee' }}>
                          {order.deliveryAddress && (
                            <div className="order-address-info">
                              <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#777', textTransform: 'uppercase' }}>Delivery Address</h5>
                              <p style={{ margin: 0, fontSize: '14px', color: '#333' }}><strong>{order.deliveryAddress.name}</strong></p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#555' }}>
                                {order.deliveryAddress.street}, {order.deliveryAddress.city}
                              </p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#555' }}>
                                {order.deliveryAddress.state}, {order.deliveryAddress.country}
                              </p>
                              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#555' }}>
                                Phone: {order.deliveryAddress.phone}
                              </p>
                            </div>
                          )}

                          {order.notes && (
                            <div className="order-notes-info" style={{ marginTop: '15px' }}>
                              <h5 style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#777', textTransform: 'uppercase' }}>Order Notes</h5>
                              <p style={{ margin: 0, fontSize: '13px', color: '#555', whiteSpace: 'pre-wrap' }}>{order.notes}</p>
                            </div>
                          )}
                        </div>

                        {/* Items and Prices */}
                        {order.items && order.items.map((item, idx) => (
                          <React.Fragment key={idx}>
                            <div style={{ gridColumn: '1', display: 'flex', alignItems: 'center' }}>
                              <img src={item.image} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px' }} onError={(e) => { e.target.src = "https://placehold.co/60x60/e8e8e8/8a2b8f?text=Item" }} />
                              <div className="order-item-details">
                                <h4 style={{ margin: '0 0 5px 0', fontSize: '14px' }}>{item.name}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <div style={{ gridColumn: '3', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 'bold' }}>
                              Rs. {item.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </div>
                          </React.Fragment>
                        ))}
                      </div>

                      <div className="order-footer">
                        <span>Total: <strong>Rs. {order.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</strong></span>
                        <button className="view-order-btn" onClick={() => navigate(`/order-details/${order.id}`)}>
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
    </div>
  );
};

export default ProfilePage;
