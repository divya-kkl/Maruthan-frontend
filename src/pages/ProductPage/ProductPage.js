import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { useCart } from '../../context/CartContext';
import { FiShare2, FiHelpCircle, FiMaximize2, FiTruck, FiTag, FiBox, FiCopy, FiX } from 'react-icons/fi';
import { AiFillStar } from 'react-icons/ai';
import { FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa';
import SizeChart from '../../components/SizeChart/SizeChart';
import RelatedProducts from '../../components/RelatedProducts/RelatedProducts';
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

const GET_ALL_FAQS = gql`
  query { getAllFAQs { id question answer category order isActive } }
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
  const [faqs, setFaqs] = useState([]);
  const [openFaqs, setOpenFaqs] = useState({});
  const [openAccordions, setOpenAccordions] = useState(['description']);
  const [showAskModal, setShowAskModal] = useState(false);
  const [askForm, setAskForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [askSent, setAskSent] = useState(false);
  const [askSending, setAskSending] = useState(false);
  const [shareSent, setShareSent] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

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

    const fetchFAQs = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_ALL_FAQS);
        const activeFaqs = (data.getAllFAQs || [])
          .filter(f => f.isActive)
          .sort((a, b) => a.order - b.order);
        setFaqs(activeFaqs);
      } catch (err) {
        console.error("Error fetching FAQs:", err);
      }
    };

    fetchProduct();
    fetchFAQs();
  }, [id]);

  const toggleFaq = (faqId) => {
    setOpenFaqs(prev => ({ ...prev, [faqId]: !prev[faqId] }));
  };

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

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareSent(true);
      setTimeout(() => setShareSent(false), 2000);
    });
  };

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    setAskSending(true);
    window.open(`https://wa.me/919786221122?text=${encodeURIComponent(`Hi, I have a question!\nName: ${askForm.name}\nPhone: ${askForm.phone}\nEmail: ${askForm.email}\nMessage: ${askForm.message}`)}`, '_blank');
    setAskSent(true);
    setAskSending(false);
    setAskForm({ name: '', phone: '', email: '', message: '' });
    setTimeout(() => { setAskSent(false); setShowAskModal(false); }, 2000);
  };

  if (loading) return <div className="product-page-loading">Loading product details...</div>;
  if (error || !product) return <div className="product-page-error">{error || "Product not found"}</div>;

  const selectedVariant = product.variants?.find(v => v.size === selectedSize);
  const currentStock = selectedVariant ? selectedVariant.stock : (product.variants?.[0]?.stock || 0);
  const stockProgress = Math.min((currentStock / 50) * 100, 100);

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
          <img src={activeImage || "/images/placeholder.png"} alt={product.name} className="product-main-image" />
          <button className="expand-icon" onClick={() => setIsZoomed(true)}><FiMaximize2 /></button>
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
          <div className="meta-link" onClick={() => setShowAskModal(true)} style={{ cursor: 'pointer' }}><FiHelpCircle /> Ask a question</div>
          <div className="meta-link" onClick={handleShare} style={{ cursor: 'pointer' }}><FiShare2 /> Share</div>
        </div>

        {/* Ask a Question Modal */}
        {showAskModal && (
          <div className="ask-modal-overlay" onClick={() => setShowAskModal(false)}>
            <div className="ask-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ask-modal-header">
                <h3>Ask a Question</h3>
                <button className="ask-modal-close" onClick={() => setShowAskModal(false)}>&#x2715;</button>
              </div>
              <form className="ask-modal-form" onSubmit={handleAskSubmit}>
                <div className="ask-modal-row">
                  <input
                    type="text"
                    placeholder="Your name*"
                    value={askForm.name}
                    onChange={(e) => setAskForm({ ...askForm, name: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Your phone number"
                    value={askForm.phone}
                    onChange={(e) => setAskForm({ ...askForm, phone: e.target.value })}
                  />
                </div>
                <input
                  type="email"
                  placeholder="Your email *"
                  value={askForm.email}
                  onChange={(e) => setAskForm({ ...askForm, email: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Your message*"
                  rows="5"
                  value={askForm.message}
                  onChange={(e) => setAskForm({ ...askForm, message: e.target.value })}
                  required
                ></textarea>
                <p className="ask-modal-note">* Required fields cannot be left blank.</p>
                {askSent && <p className="ask-success">✅ Message sent!</p>}
                <button type="submit" className="ask-modal-submit" disabled={askSending}>
                  {askSending ? 'Sending...' : 'Send Your Message'}
                </button>
              </form>
            </div>
          </div>
        )}

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
          <div className="size-label">Size: <strong>{selectedSize}</strong></div>
          <div className="size-options">
            {product?.variants && [...new Set(product.variants.map(v => v.size))].map(size => {
          
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
      {/* Zoom Overlay */}
      {isZoomed && (
        <div className="image-zoom-overlay" onClick={() => setIsZoomed(false)}>
          <button className="zoom-close-btn" onClick={() => setIsZoomed(false)}>
            <FiX />
          </button>
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
      <RelatedProducts title="New Arrivals" />
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
