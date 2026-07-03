import React, { useState, useEffect } from 'react';
import './QuickViewModal.css';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const QuickViewModal = ({ product, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('1Y');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(product?.images?.[0] || '/images/placeholder.png');

  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActiveImage(product.images[0]);
    }
  }, [product]);

  const handlePrevImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = Math.max(0, product.images.indexOf(activeImage));
    const prevIndex = (currentIndex - 1 + product.images.length) % product.images.length;
    setActiveImage(product.images[prevIndex]);
  };

  const handleNextImage = () => {
    if (!product || !product.images || product.images.length <= 1) return;
    const currentIndex = Math.max(0, product.images.indexOf(activeImage));
    const nextIndex = (currentIndex + 1) % product.images.length;
    setActiveImage(product.images[nextIndex]);
  };

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
    navigate('/cart');
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize);
    onClose();
    navigate('/checkout');
  };

  if (!product) return null;

  return (
    <div className="quickview-overlay" onClick={onClose}>
      <div className="quickview-modal" onClick={(e) => e.stopPropagation()}>
        <button className="quickview-close" onClick={onClose}>&times;</button>

        <div className="quickview-content">
          <div className="quickview-image-container">
            {product.images && product.images.length > 1 && (
              <>
                <button 
                  className="quickview-nav-arrow left-arrow" 
                  onClick={handlePrevImage} 
                  aria-label="Previous image"
                >
                  <FiChevronLeft />
                </button>
                <button 
                  className="quickview-nav-arrow right-arrow" 
                  onClick={handleNextImage} 
                  aria-label="Next image"
                >
                  <FiChevronRight />
                </button>
              </>
            )}
            <img src={activeImage} alt={product.name || product.title} className="quickview-image" />
          </div>

          <div className="quickview-details">
            <h2 className="quickview-title">{product.name || product.title}</h2>
            <div className="quickview-price-wrap">
              <span className="quickview-price">Rs. {product.price}</span>
              {product.originalPrice && <span className="quickview-old-price">Rs. {product.originalPrice}</span>}
            </div>

            <div className="quickview-size-section">
              <p className="size-label">Size: <span>{selectedSize}</span></p>
              <div className="size-buttons">
                {['1Y', '2Y', '3Y', '4Y', '5Y', '6Y'].map(size => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="quickview-desc-text">
              <p>{product.description || "Dress your little princess in pure elegance with this stunning dress from little RR - trusted by 10L+ happy parents across India."}</p>
            </div>

            <div className="quickview-specs-section">
              <h4 className="specs-heading">PRODUCT DETAILS</h4>
              <ul className="specs-list">
                {product.variants && product.variants.length > 0 && <li><strong>Color:</strong> {product.variants[0].color}</li>}
                {product.material && <li><strong>Material:</strong> {product.material}</li>}
                {product.embellishment && <li><strong>Embellishment:</strong> {product.embellishment}</li>}
                {product.neck && <li><strong>Neck:</strong> {product.neck}</li>}
                {product.sleeves && <li><strong>Sleeves:</strong> {product.sleeves}</li>}
                {product.closure && <li><strong>Closure:</strong> {product.closure}</li>}
                {product.lining && <li><strong>Lining:</strong> {product.lining}</li>}
                {product.washCare && <li><strong>Wash Care:</strong> {product.washCare}</li>}
                {product.ironCare && <li><strong>Iron Care:</strong> {product.ironCare}</li>}
              </ul>
              <p className="specs-note">Note: Color may vary slightly due to photographic lighting or device display settings.</p>
            </div>

            <div className="quickview-action-group">
              <div className="qty-row">
                <div className="qty-selector">
                  <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>&minus;</button>
                  <span className="qty-num">{quantity}</span>
                  <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>
                <button
                  className="add-cart-btn"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
              <button className="buy-now-btn" onClick={handleBuyNow}>Buy it now</button>
            </div>

            <a 
              href={`/product/${product.id}`} 
              className="view-full-details" 
              onClick={(e) => { 
                e.preventDefault(); 
                onClose(); 
                navigate(`/product/${product.id}`); 
              }}
            >
              View Full Details &raquo;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
