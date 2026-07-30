import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CheckoutPage.css";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart,fetchDeliveryCharge  } from "../../redux/Slice/cartSlice";
import { fetchSavedAddresses, fetchPaymentMethods, placeOrder, createRazorpayOrder, resetOrderSuccess, setValidationErrors, setSubmitError } from "../../redux/Slice/checkoutSlice";



const Checkout = ({ onNavigate }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems, deliveryCharge } = useSelector(state => state.cart);
  const getCartTotal = () => cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  const [loading] = useState(false);
  const { savedAddresses, loadingAddresses, paymentMethods, isPlacingOrder, orderSuccessData, error, validationErrors, submitError } = useSelector(state => state.checkout);

  const [formData, setFormData] = useState({
    addressType: "Home",
    name: "",
    street: "",
    city: "",
    state: "",
    country: "India",
    phone: "",
    paymentMethod: "COD",
    deliveryCharge: 0,
    notes: "",
  });

  const [selectedAddressIndex, setSelectedAddressIndex] = useState('new');

  // We no longer fetch from backend directly
  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchSavedAddresses());
    dispatch(fetchPaymentMethods());
    dispatch(fetchDeliveryCharge());
  }, [dispatch]);

  // Set default payment method and select first saved address if available
  useEffect(() => {
    if (paymentMethods.length > 0) {
      const firstActive = paymentMethods.find(m => m.status === 'ACTIVE');
      if (firstActive) {
        setFormData(prev => ({ ...prev, paymentMethod: firstActive.value }));
      }
    }
  }, [paymentMethods]);

  useEffect(() => {
    if (savedAddresses.length > 0) {
      setSelectedAddressIndex(0);
    }
  }, [savedAddresses]);

  // Navigate on successful order
  useEffect(() => {
    if (orderSuccessData && orderSuccessData.id) {
      window.dispatchEvent(new Event("cartUpdated"));
      const orderId = orderSuccessData.id;
      dispatch(resetOrderSuccess());
      if (onNavigate) {
         onNavigate(`order-success/${orderId}`);
      } else {
         navigate(`/order-success/${orderId}`);
      }
    }
  }, [orderSuccessData, navigate, onNavigate, dispatch]);

  useEffect(() => {
    if (error && error.includes("Unauthorized")) {
      alert("Please login to place an order.");
      if (onNavigate) {
         onNavigate("signin");
      } else {
         navigate("/login");
      }
    } else if (error) {
      dispatch(setSubmitError("Failed to place order: " + (error || "Please try again.")));
    }
  }, [error, navigate, onNavigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Only allow numbers for phone
      const sanitized = value.replace(/[^0-9]/g, '');
      if (sanitized.length > 10) return;
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }
    
    if (name === 'name' || name === 'city' || name === 'state') {
      // Only allow alphabets and spaces for text fields
      const sanitized = value.replace(/[^a-zA-Z\s]/g, '');
      setFormData((prev) => ({ ...prev, [name]: sanitized }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cartItems || cartItems.length === 0) return;

    dispatch(setValidationErrors({}));
    dispatch(setSubmitError(""));
    let errors = {};

    const deliveryAddress = selectedAddressIndex === 'new'
      ? {
          addressType: formData.addressType,
          name: formData.name,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          phone: formData.phone,
        }
      : {
          addressType: savedAddresses[selectedAddressIndex].addressType,
          name: savedAddresses[selectedAddressIndex].name,
          street: savedAddresses[selectedAddressIndex].street,
          city: savedAddresses[selectedAddressIndex].city,
          state: savedAddresses[selectedAddressIndex].state,
          country: savedAddresses[selectedAddressIndex].country,
          phone: savedAddresses[selectedAddressIndex].phone,
        };

    if (selectedAddressIndex !== 'new') {
       if (!deliveryAddress.phone || deliveryAddress.phone.trim() === '') {
           errors.addressSelection = "Phone number is missing in this saved address. Please add a new address.";
       }
    } else {
       if (!formData.name || formData.name.trim() === '') errors.name = "Full name is required";
       if (!formData.phone || formData.phone.length !== 10) errors.phone = "Valid 10-digit phone number is required";
       if (!formData.street || formData.street.trim() === '') errors.street = "Street address is required";
       if (!formData.city || formData.city.trim() === '') errors.city = "City is required";
       if (!formData.state || formData.state.trim() === '') errors.state = "State is required";
    }

    if (Object.keys(errors).length > 0) {
        dispatch(setValidationErrors(errors));
        return;
    }

      const input = {
        deliveryCharge: deliveryCharge || 0,
        paymentMethod: formData.paymentMethod,
        deliveryAddress,
        notes: formData.notes || undefined,
      };

      // Purely Frontend Razorpay Payment if UPI (Online Delivery)
      if (formData.paymentMethod === "UPI" || formData.paymentMethod === "RAZORPAY") {
        if (!window.Razorpay) {
            alert("Razorpay SDK failed to load. Please check your internet connection.");
            return;
        }
        if (!process.env.REACT_APP_RAZORPAY_KEY_ID) {
            alert("Razorpay Key is missing! Please check your .env file.");
            return;
        }

        // 1. Calculate amount (cart total + delivery charge)
        const totalAmount = getCartTotal() + (deliveryCharge || 0);

        // 2. Call backend to create Razorpay Order via Redux
        let rzpResponse;
        try {
          rzpResponse = await dispatch(createRazorpayOrder(totalAmount)).unwrap();
        } catch (err) {
          alert("Failed to initialize Razorpay order. Please try again.");
          return;
        }

        if (!rzpResponse.success) {
           alert("Failed to initialize Razorpay order. Please try again.");
           return;
        }

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
          amount: rzpResponse.amount, // Amount is in paise
          currency: "INR",
          name: "littleRR",
          order_id: rzpResponse.orderId, 
          description: "Purchase Order",
          handler: async function (response) {
            try {
              // 3. Payment success callback from Razorpay -> Place Order on backend via Redux
              input.paymentMethod = "RAZORPAY";
              input.razorpayOrderId = response.razorpay_order_id;
              input.razorpayPaymentId = response.razorpay_payment_id;
              input.razorpaySignature = response.razorpay_signature;

              dispatch(placeOrder({ input, cartItems }));
              
            } catch (verifyErr) {
              console.error("Payment Verification Error", verifyErr);
              alert("Payment verification failed! Please contact support.");
            }
          },
          prefill: {
            name: deliveryAddress.name,
            contact: deliveryAddress.phone
          },
          theme: {
            color: "#8a2b8f"
          },
          modal: {
            ondismiss: function() {
              alert("Payment cancelled.");
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          alert("Payment failed: " + response.error.description);
        });
        rzp.open();
        return;
      }

      // If not ONLINE (e.g. COD), proceed normally
      dispatch(placeOrder({ input, cartItems }));
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div style={{ padding: "100px", textAlign: "center", fontSize: "1.2rem", color: "#666" }}>
          Loading checkout...
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p style={{ color: "#888" }}>
            Add some products to your cart before checking out.
          </p>
          <button onClick={() => { if(onNavigate) onNavigate('home'); else navigate("/"); }}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header-wrapper">
         <h1>Secure Checkout</h1>
         <p>Complete your purchase securely</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-container">
        <div className="checkout-form-section">
          <h2 className="checkout-section-title">Delivery Address</h2>

          {loadingAddresses ? (
            <div style={{ padding: "20px 0", color: "#666" }}>Loading addresses...</div>
          ) : savedAddresses.length > 0 ? (
            <div className="saved-addresses-container">
              {savedAddresses.map((addr, index) => (
                <label key={index} className={`address-option ${selectedAddressIndex === index ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="addressSelection"
                    value={index}
                    checked={selectedAddressIndex === index}
                    onChange={() => setSelectedAddressIndex(index)}
                  />
                  <div className="address-details">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
                      <span className="address-type">{addr.addressType}</span>
                      <span className="address-name">{addr.name}</span>
                      <span className="address-phone">{addr.phone}</span>
                    </div>
                    <span className="address-street">
                      {addr.street}, {addr.city}, {addr.state}, {addr.country}
                    </span>
                  </div>
                </label>
              ))}

              <label className={`address-option ${selectedAddressIndex === 'new' ? 'selected' : ''}`}>
                <input
                  type="radio"
                  name="addressSelection"
                  value="new"
                  checked={selectedAddressIndex === 'new'}
                  onChange={() => setSelectedAddressIndex('new')}
                />
                <div className="address-details">
                  <span className="address-type" style={{ background: 'transparent', padding: 0, fontWeight: 'bold' }}>+ Add New Address</span>
                </div>
              </label>
            </div>
          ) : null}

          {validationErrors.addressSelection && (
             <div style={{ color: '#dc3545', marginTop: '10px', fontSize: '14px', fontWeight: '500' }}>
                {validationErrors.addressSelection}
             </div>
          )}

          {selectedAddressIndex === 'new' && (
            <div className="new-address-form">
              <div className="form-row">
                <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              {validationErrors.name && <span style={{color: '#dc3545', fontSize: '13px', marginTop:'5px', display:'block'}}>{validationErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit phone number"
                minLength="10"
                maxLength="10"
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
                required
              />
              {validationErrors.phone && <span style={{color: '#dc3545', fontSize: '13px', marginTop:'5px', display:'block'}}>{validationErrors.phone}</span>}
            </div>
          </div>

          <div className="form-group">
            <label>Street Address *</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              placeholder="House no, Building, Street, Area"
              required
            />
            {validationErrors.street && <span style={{color: '#dc3545', fontSize: '13px', marginTop:'5px', display:'block'}}>{validationErrors.street}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                required
              />
              {validationErrors.city && <span style={{color: '#dc3545', fontSize: '13px', marginTop:'5px', display:'block'}}>{validationErrors.city}</span>}
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                required
              />
              {validationErrors.state && <span style={{color: '#dc3545', fontSize: '13px', marginTop:'5px', display:'block'}}>{validationErrors.state}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                required
                readOnly
                className="readonly-input"
              />
            </div>
            <div className="form-group">
              <label>Address Type</label>
              <select
                name="addressType"
                value={formData.addressType}
                onChange={handleChange}
              >
                <option value="Home">Home</option>
                <option value="Work">Work</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

            </div>
          )}

          <div className="form-group">
            <label>Order Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special instructions for your order..."
              rows="3"
            />
          </div>

          <h2 className="checkout-section-title" style={{ marginTop: "40px" }}>
            Payment Method
          </h2>
          <div className="payment-methods">
            {paymentMethods.length > 0 ? paymentMethods.map((method) => {
              const isActive = method.status === 'ACTIVE';
              return (
              <label
                key={method.value}
                className={`payment-option ${
                  formData.paymentMethod === method.value ? "selected" : ""
                } ${!isActive ? "disabled" : ""}`}
                style={!isActive ? { opacity: 0.5, cursor: "not-allowed" } : {}}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.value}
                  checked={formData.paymentMethod === method.value && isActive}
                  onChange={handleChange}
                  disabled={!isActive}
                />
                <div className="payment-option-content">
                  <span className="payment-label">
                    {method.icon} {method.name}
                    {!isActive && (
                      <span style={{ fontSize: "12px", color: "#dc3545", marginLeft: "8px", fontWeight: "normal" }}>
                        (Unavailable)
                      </span>
                    )}
                  </span>
                  {method.description && <span className="payment-desc">{method.description}</span>}
                </div>
              </label>
            )}) : (
              // Fallback if no payment methods configured in admin
              [
                { value: "COD", label: "💵 Cash on Delivery", desc: "Pay at your doorstep" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`payment-option selected`}
                >
                  <input type="radio" name="paymentMethod" value={method.value} checked readOnly />
                  <div className="payment-option-content">
                    <span className="payment-label">{method.label}</span>
                    <span className="payment-desc">{method.desc}</span>
                  </div>
                </label>
              ))
            )}
          </div>
        </div>

        <div className="checkout-summary-section">
          <h2 className="checkout-section-title">Order Summary</h2>

          <div className="summary-items-list">
            {cartItems.map((item, index) => (
              <div key={index} className="summary-item-card">
                <div className="summary-item-img-wrapper">
                  <img src={item.product.image || item.product.images?.[0]} alt={item.product.name} onError={(e) => { e.target.src = "https://placehold.co/60x60/e8e8e8/8a2b8f?text=Item" }} />
                </div>
                <div className="summary-item-info">
                  <span className="summary-item-name">{item.product.name}</span>
                  {item.size && <span className="summary-item-size">Size: {item.size}</span>}
                  <span className="summary-item-price">
                    Rs. {(item.product.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button 
                  type="button"
                  className="remove-summary-item"
                  onClick={() => dispatch(removeFromCart({ productId: item.product.id || item.product._id, size: item.size }))}
                  aria-label="Remove item"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <div className="summary-totals">
             <div className="summary-row">
               <span>Subtotal</span>
               <span>
                 Rs. {getCartTotal().toLocaleString("en-IN", { minimumFractionDigits: 2 })}
               </span>
             </div>
             <div className="summary-row">
               <span>Delivery Charge</span>
               {deliveryCharge > 0 ? (
                 <span>Rs. {deliveryCharge.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
               ) : (
                 <span className="free-shipping">Free</span>
               )}
             </div>

             <div className="summary-total-row">
               <span>Total to Pay</span>
               <span className="total-amount">
                 Rs. {(getCartTotal() + (deliveryCharge || 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
               </span>
             </div>
          </div>

          {submitError && (
             <div style={{ color: '#dc3545', marginBottom: '15px', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>
                {submitError}
             </div>
          )}

          <button
            type="submit"
            className={`place-order-btn ${isPlacingOrder ? 'processing' : ''}`}
            disabled={isPlacingOrder}
          >
            {isPlacingOrder ? (
               <><span className="checkout-spinner"></span> Processing...</>
            ) : "Place Secure Order"}
          </button>
          
          <div className="secure-checkout-badge">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
             256-bit SSL Secure Checkout
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;