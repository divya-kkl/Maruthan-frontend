import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../../redux/Slice/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const navigate = useNavigate();

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

            <div className="shipping-estimate-block">
              <label>Estimate Shipping</label>
              <div className="form-group">
                <label>Country/region</label>
                <select defaultValue="India">
                  <option value="India">India</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                </select>
              </div>
              <div className="form-group">
                <label>Province</label>
                <select defaultValue="Tamil Nadu">
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Kerala">Kerala</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
            </div>

            <div className="cart-summary-block">
              <div className="subtotal-row">
                <span>Subtotal</span>
                <span className="subtotal-price">Rs. {cartTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <p className="tax-shipping-note">Tax included. Shipping calculated at checkout.</p>
              <button className="checkout-btn" onClick={handleCheckout}>Check out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
