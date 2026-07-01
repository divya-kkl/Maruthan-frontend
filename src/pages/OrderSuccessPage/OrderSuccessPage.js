import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { GraphQLClient, gql } from 'graphql-request';
import './OrderSuccessPage.css';
import './OrderDetails.css';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:2000/graphql";

const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    getOrderById(id: $id) {
      id
      orderNumber
      subTotal
      deliveryCharge
      totalAmount
      paymentMethod
      status
      deliveryAddress {
        name
        street
        city
        state
        country
        phone
      }
      notes
      items {
        name
        image
        quantity
        price
      }
    }
  }
`;

const OrderSuccessPage = () => {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { clearCart } = useCart();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const isDetailsMode = window.location.pathname.includes('order-details');

  useEffect(() => {
    // Only clear the frontend cart when landing on the success page, not the details page
    if (clearCart && !isDetailsMode) {
      clearCart();
    }
    window.scrollTo(0, 0);

    const fetchOrderDetails = async () => {
      if (!orderId) return;
      try {
        const token = localStorage.getItem('token');
        const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await client.request(GET_ORDER_BY_ID, { id: orderId });
        setOrderDetails(data.getOrderById);
      } catch (err) {
        console.error("Failed to fetch order details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [clearCart, orderId, isDetailsMode]);

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
                {orderDetails.items && orderDetails.items.map((item, idx) => (
                  <div key={idx} className="premium-item-row">
                    <div className="premium-item-img">
                      <img src={item.image || "https://placehold.co/80x80/f5f5f5/8a2b8f?text=Product"} alt={item.name} />
                      <span className="premium-item-qty">{item.quantity}</span>
                    </div>
                    <div className="premium-item-info">
                      <span className="premium-item-name">{item.name}</span>
                      <span className="premium-item-price">
                        Rs. {(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                ))}
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
                  <div className="payment-badge">{orderDetails.paymentMethod === 'COD' ? 'Cash on Delivery' : orderDetails.paymentMethod}</div>
                  <p className="payment-status">Status: <strong>{orderDetails.status}</strong></p>
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
    </div>
  );
};

export default OrderSuccessPage;
