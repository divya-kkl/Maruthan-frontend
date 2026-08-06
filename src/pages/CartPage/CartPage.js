import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart, fetchCoupon, clearCouponError, setCouponInput } from '../../redux/Slice/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, coupon, couponError, loading, couponInput } = useSelector(state => state.cart);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const navigate = useNavigate();

  // Calculate discount
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'PERCENTAGE') {
      discount = cartTotal * (coupon.value / 100);
    } else if (coupon.type === 'FLAT') {
      discount = coupon.value;
    }
  }

  // Ensure discount doesn't exceed cartTotal
  if (discount > cartTotal) {
    discount = cartTotal;
  }

  const finalTotal = cartTotal - discount;

  const handleApplyCoupon = () => {
    if (couponInput.trim()) {
      dispatch(fetchCoupon(couponInput.trim()));
    }
  };


  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page-container">
      <div className="cart-breadcrumb">
        <span onClick={() => navigate('/')}>Home</span> &bull; <span>Your Shopping Cart</span>
      </div>
      
      <h1 className="cart-page-title">Shopping Cart</h1>
      <p className="cart-page-subtitle">Review your selected items before purchase. Enjoy a seamless shopping experience!</p>

      {cartItems.length > 0 && (
        <div className="cart-timer-banner">
          You're out of time! Checkout now to avoid losing your order!
        </div>
      )}

      {cartItems.length === 0 ? (
        <div className="empty-cart-message">
          <p>Your cart is currently empty.</p>
          <button className="continue-shopping-btn" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      ) : (
        <div className="cart-content-wrapper">
          <div className="cart-items-section">
            <div className="cart-table-header">
              <div className="th-product">Product</div>
              <div className="th-price">Price</div>
              <div className="th-quantity">Quantity</div>
              <div className="th-total">Total</div>
            </div>
            
            <div className="cart-items-list">
              {cartItems.map((item, index) => (
                <div className="cart-item-row" key={`${item.product.id}-${item.size}-${index}`}>
                  <div className="td-product">
                    <img src={item.product.image || item.product.images?.[0] || '/images/placeholder.png'} alt={item.product.name} className="cart-item-image" />
                    <div className="cart-item-details">
                      <h3 className="cart-item-name">{item.product.name}</h3>
                      <p className="cart-item-size">Size: {item.size}</p>
                      <button 
                        className="cart-item-remove" 
                        onClick={() => dispatch(removeFromCart({ productId: item.product.id, size: item.size }))}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  
                  <div className="td-price">
                    Rs. {Number(item.product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  
                  <div className="td-quantity">
                    <div className="cart-qty-selector">
                      <button onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, newQuantity: item.quantity - 1 }))}>&minus;</button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ productId: item.product.id, size: item.size, newQuantity: item.quantity + 1 }))}
                        disabled={item.quantity >= 5}
                        style={{ opacity: item.quantity >= 5 ? 0.5 : 1, cursor: item.quantity >= 5 ? 'not-allowed' : 'pointer' }}
                      >+</button>
                    </div>
                  </div>
                  
                  <div className="td-total">
                    Rs. {(item.product.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="cart-sidebar-section">

         

           
              {/* Coupon Section */}
              <div className="coupon-section">
                <label>Coupon Code</label>
                <div className="coupon-input-group">
                  <input 
                    type="text" 
                    className="coupon-input"
                    value={coupon ? coupon.code : couponInput}
                    onChange={(e) => {
                      if (!coupon) {
                        dispatch(setCouponInput(e.target.value));
                        if (couponError) dispatch(clearCouponError());
                      }
                    }}
                    placeholder="Enter coupon code"
                    disabled={!!coupon}
                    style={coupon ? { borderColor: '#1a365d', backgroundColor: 'transparent', color: '#000' } : {}}
                  />
                  <button 
                    className="coupon-apply-btn"
                    onClick={handleApplyCoupon}
                    disabled={loading || !!coupon || (!coupon && !couponInput.trim())}
                    style={coupon ? { backgroundColor: 'rgba(26, 54, 93, 0.15)', color: '#000', opacity: 1 } : {}}
                  >
                    {loading ? 'APPLYING...' : (coupon ? 'APPLIED' : 'APPLY')}
                  </button>
                </div>
                {couponError && !coupon && <p className="coupon-error-text">{couponError}</p>}
                {coupon && (
                  <div className="coupon-applied-text" style={{ marginTop: '10px', color: '#1a365d' }}>
                    Coupon Applied: {coupon.code}
                  </div>
                )}
              </div>

              <div className="subtotal-row">
                <span>Subtotal</span>
                <span className="subtotal-price">Rs. {cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              
              {coupon && (
                <div className="subtotal-row discount-row">
                  <span>Discount ({coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `Rs. ${coupon.value}`})</span>
                  <span>- Rs. {discount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
                </div>
              )}

              {coupon && (
                <div className="subtotal-row" style={{ fontWeight: 'bold', fontSize: '18px', marginTop: '10px', borderTop: '1px solid #eee', paddingTop: '10px' }}>
                  <span>Total</span>
                  <span className="subtotal-price">Rs. {finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <p className="tax-shipping-note">Tax included. Shipping calculated at checkout.</p>
              <button className="checkout-btn" onClick={handleCheckout}>Check out</button>
            </div>
     
        </div>
      )}
    </div>
  );
};

export default CartPage;
