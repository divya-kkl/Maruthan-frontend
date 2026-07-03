import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GraphQLClient, gql } from "graphql-request";
import "./CheckoutPage.css";
import { useCart } from "../../context/CartContext";

const GRAPHQL_ENDPOINT =
  process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:2000/graphql";

const GET_USER_ADDRESSES = gql`
  query GetUserAddresses {
    getUserAddresses {
      addressType
      name
      street
      city
      state
      country
      phone
    }
  }
`;

const GET_PAYMENT_METHODS = gql`
  query GetAllPaymentMethods {
    getAllPaymentMethods {
      id
      name
      value
      description
      icon
      status
      sortOrder
    }
  }
`;

const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      id
      userId
      orderNumber
      items {
        productId
        quantity
        price
        mrp
        name
        image
        size
      }
      subTotal
      deliveryCharge
      totalAmount
      status
      paymentStatus
      paymentMethod
      deliveryAddress {
        addressType
        name
        street
        city
        state
        country
        phone
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

const Checkout = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, removeFromCart, deliveryCharge } = useCart();

  const [loading] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
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

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState('new');
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [paymentMethods, setPaymentMethods] = useState([]);

  // We no longer fetch from backend because we use CartContext
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchSavedAddresses();
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_PAYMENT_METHODS);
      const allMethods = (data.getAllPaymentMethods || [])
        .sort((a, b) => a.sortOrder - b.sortOrder);
      setPaymentMethods(allMethods);
      // Set first active payment method as default
      const firstActive = allMethods.find(m => m.status === 'ACTIVE');
      if (firstActive) {
        setFormData(prev => ({ ...prev, paymentMethod: firstActive.value }));
      }
    } catch (err) {
      console.error('Error fetching payment methods:', err);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoadingAddresses(false);
        return;
      }
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await client.request(GET_USER_ADDRESSES);
      if (data.getUserAddresses && data.getUserAddresses.length > 0) {
        setSavedAddresses(data.getUserAddresses);
        setSelectedAddressIndex(0);
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoadingAddresses(false);
    }
  };

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

    setIsPlacingOrder(true);
    try {
      const token = localStorage.getItem("token");

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

      const input = {
        deliveryCharge: deliveryCharge || 0,
        paymentMethod: formData.paymentMethod,
        deliveryAddress,
        notes: formData.notes || undefined,
      };

      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // SYNC CART: Ensure the backend cart matches our frontend cart context
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          const CLEAR_CART = gql`
            mutation ClearCart($userId: ID!) {
              clearCart(userId: $userId)
            }
          `;
          try {
            await client.request(CLEAR_CART, { userId: user.id });
          } catch (e) {
            // It's perfectly fine if the cart doesn't exist yet!
            console.warn("Backend cart empty or not found. Proceeding to create one.");
          }

          const ADD_TO_CART = gql`
            mutation AddToCart($userId: ID!, $shopId: ID!, $productId: ID!, $quantity: Float!, $size: String!) {
              addToCart(userId: $userId, shopId: $shopId, productId: $productId, quantity: $quantity, size: $size) {
                id
              }
            }
          `;
          for (const item of cartItems) {
            await client.request(ADD_TO_CART, {
              userId: user.id,
              shopId: item.product.shopDetails || item.product.shopId || "default",
              productId: item.product.id || item.product._id,
              quantity: parseFloat(item.quantity),
              size: item.size || "Default"
            });
          }
        }
      }

      // Now place the order (which reads from the backend cart we just synced)
      const data = await client.request(PLACE_ORDER, { input });

      window.dispatchEvent(new Event("cartUpdated"));

      if (onNavigate) {
         onNavigate(`order-success/${data.placeOrder.id}`);
      } else {
         navigate(`/order-success/${data.placeOrder.id}`);
      }
    } catch (err) {
      console.error("Error during checkout:", err);

      if (
        err.message &&
        err.message.includes("Unauthorized")
      ) {
        alert("Please login to place an order.");
        if (onNavigate) {
           onNavigate("signin");
        } else {
           navigate("/login");
        }
      } else {
        alert("Failed to place order: " + (err.message || "Please try again."));
      }
    } finally {
      setIsPlacingOrder(false);
    }
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
                  <span className="summary-item-price">
                    Rs. {(item.product.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <button 
                  type="button"
                  className="remove-summary-item"
                  onClick={() => removeFromCart(item.product.id || item.product._id, item.size)}
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