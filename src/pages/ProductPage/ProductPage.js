import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { useCart } from '../../context/CartContext';
import { FiShare2, FiHelpCircle, FiMaximize2, FiTruck, FiTag, FiBox } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import './ProductPage.css';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      price
      mrp
      images
      brand
      description
      material
      variants {
        color
        size
        stock
      }
    }
  }
`;

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [openAccordions, setOpenAccordions] = useState(['description']);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCT_BY_ID, { id });
        
        if (data.getProductById) {
          setProduct(data.getProductById);
          if (data.getProductById.images && data.getProductById.images.length > 0) {
            setActiveImage(data.getProductById.images[0]);
          }
          if (data.getProductById.variants && data.getProductById.variants.length > 0) {
            setSelectedSize(data.getProductById.variants[0].size);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product && selectedSize) {
      addToCart(product, quantity, selectedSize);
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (product && selectedSize) {
      addToCart(product, quantity, selectedSize);
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

  if (loading) return <div className="product-page-loading">Loading product details...</div>;
  if (error || !product) return <div className="product-page-error">{error || "Product not found"}</div>;

  return (
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
          <img src={activeImage || "/images/placeholder.png"} alt={product.name} className="product-main-image" />
          <button className="expand-icon"><FiMaximize2 /></button>
        </div>
      </div>

      {/* Right Column: Details */}
      <div className="product-details-section">
        <div className="product-brand">{product.brand || "Prince N Princess"}</div>
        <h1 className="product-title">{product.name}</h1>
        
        <div className="product-rating">
          <div className="stars">
            <AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar /><AiFillStar />
          </div>
          <span>(1)</span>
        </div>

        <div className="product-price">
          Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>

        <div className="product-meta-links">
          <div className="meta-link"><FiHelpCircle /> Ask a question</div>
          <div className="meta-link"><FiShare2 /> Share</div>
        </div>

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
          Hurry up! Only <span>4 item(s)</span> left in stock
        </div>
        <div className="stock-progress-bar">
          <div className="stock-progress-fill"></div>
        </div>

        <div className="size-selector-section">
          <div className="size-label">Size: <strong>{selectedSize}</strong></div>
          <div className="size-options">
            {['1Y', '2Y', '3Y', '4Y', '5Y', '6Y', 'M', 'L', 'XL'].map(size => {
          
              return (
                <button 
                  key={size}
                  className={`size-option ${selectedSize === size ? 'active' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <div className="product-actions">
          <div className="qty-selector">
            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>&minus;</button>
            <input type="text" className="qty-input" value={quantity} readOnly />
            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
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
                <p style={{ marginBottom: '15px' }}>Our Prince N Princess store is open every day, except on Diwali and Pongal Holidays. We welcome you throughout the year with the same warmth and service. Experience Quality and Craftsmanship at Our Trusted Offline Stores.</p>
                <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
                  <li>Velachery, Chennai: <a href="tel:+919003466189" style={{ color: 'inherit', textDecoration: 'underline' }}>+91-9003466189</a></li>
                  <li>RS Puram, Coimbatore: <a href="tel:+919789388217" style={{ color: 'inherit', textDecoration: 'underline' }}>+91-9789388217</a></li>
                  <li>Singanallur, Coimbatore: <a href="tel:+918438008217" style={{ color: 'inherit', textDecoration: 'underline' }}>+91-8438008217</a></li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
