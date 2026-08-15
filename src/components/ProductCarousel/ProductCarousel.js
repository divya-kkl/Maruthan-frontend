import React, { useState, useEffect, useRef } from 'react';
import './ProductCarousel.css';
import { FaChevronLeft, FaChevronRight, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanner } from '../../redux/Slice/bannerSlice';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag, openQuickView as openGlobalQuickView } from '../../redux/Slice/tagProductsSlice';
import { isNew } from '../../redux/Slice/productDetailsSlice';
import { addToWishlistThunk, removeFromWishlistThunk } from '../../redux/Slice/wishlistSlice';

const CarouselCard = ({ product, openQuickView, user, wishlistItems, dispatch }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user?.id || user?._id;
    if (!userId) {
      alert("Please login to add items to your wishlist.");
      navigate('/login');
      return;
    }
    
    if (wishlistItems.includes(product.id)) {
      dispatch(removeFromWishlistThunk({ userId, productId: product.id }))
        .unwrap()
        .catch((err) => alert("Error removing from wishlist: " + err));
    } else {
      dispatch(addToWishlistThunk({ userId, productId: product.id }))
        .unwrap()
        .catch((err) => alert("Error adding to wishlist: " + err));
    }
  };

  const displayImage = product.images && product.images.length > 0
    ? (isHovered && product.images.length > 1 ? product.images[1] : product.images[0])
    : '/images/placeholder.png';

  return (
    <div
      className="carousel-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-image-wrapper" style={{ cursor: 'pointer', position: 'relative' }} onClick={() => navigate(`/product/${product.id}`)}>
        {isNew(product.createdAt) && (
          <span className="new-badge">NEW</span>
        )}
        <button 
          onClick={handleWishlistClick} 
          style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255, 255, 255, 0.9)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}
          title={wishlistItems.includes(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {wishlistItems.includes(product.id) ? (
            <FaHeart color="red" size={18} />
          ) : (
            <FaRegHeart color="gray" size={18} />
          )}
        </button>
        <img
          src={displayImage}
          alt={product.name}
          className="carousel-image"
        />
      </div>
      <div className="carousel-info">
        <h3 className="carousel-name" title={product.name}>
          {product.name}
        </h3>
        <div className="carousel-price">
          Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <button className="carousel-select-btn" onClick={() => openQuickView(product)}>Select Options</button>
      </div>
    </div>
  );
};

const ProductCarousel = () => {
  const dispatch = useDispatch();

  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);
  const { banner } = useSelector((state) => state.banner);
  const user = useSelector((state) => state.user?.user);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const taggedProducts = productsByTag['NEW ARRIVALS'] || [];
  const loading = taggedProducts.length === 0 && (tagStatus === 'loading' || tagStatus === 'idle');

  const combinedProducts = [...taggedProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values());

  const bannerData = banner && banner.length > 0 ? banner.find((b) => b.bannerType === 'SECOND') : null;

  const openQuickView = (product) => {
    dispatch(openGlobalQuickView(product));
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        const scrollAmount = scrollContainerRef.current.clientWidth;
        scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scrollRight();
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'NEW ARRIVALS', limit: 10 }));
    dispatch(fetchBanner());
  }, [dispatch]);

  if (tagStatus === 'failed') {
    return (
      <section className="product-carousel-section">
        <div className="carousel-container" style={{ textAlign: 'center', padding: '50px 0' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#ff4d4f' }}>Oops! Something went wrong.</h2>
          <p style={{ fontSize: '1rem', color: '#666' }}>Failed to load products. Please try refreshing the page.</p>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="product-carousel-section">
        <div className="carousel-container">
          <div className="carousel-header">
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
              </div>
            ) : (
              <h2 className="carousel-title">New Arrivals</h2>
            )}
          </div>

          <div className="carousel-slider-wrapper">
            {!loading && products.length > 5 && (
              <button className="carousel-arrow left" onClick={scrollLeft}>
                <FaChevronLeft />
              </button>
            )}

            <div className="carousel-grid" ref={scrollContainerRef}>
              {loading ? (
                [...Array(5)].map((_, index) => (
                  <div className="carousel-card shimmer-card" key={`shimmer-${index}`}>
                    <div className="shimmer-image"></div>
                    <div className="carousel-info" style={{ width: '100%' }}>
                      <div className="shimmer-text title"></div>
                      <div className="shimmer-text price"></div>
                      <div className="shimmer-button"></div>
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <CarouselCard 
                    key={product.id} 
                    product={product} 
                    openQuickView={openQuickView} 
                    user={user} 
                    wishlistItems={wishlistItems} 
                    dispatch={dispatch} 
                  />
                ))
              ) : (
                <p>No products found.</p>
              )}
            </div>

            {!loading && products.length > 5 && (
              <button className="carousel-arrow right" onClick={scrollRight}>
                <FaChevronRight />
              </button>
            )}
          </div>

          <div className="carousel-view-all-container">
            {loading ? (
              <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
            ) : (
              <button className="newborn-view-all-btn" onClick={() => navigate('/categories/GIRLS')}>
                View All
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Girls Wear Banner Section (Second Image) */}
      <section className="girls-wear-banner-section">
        {bannerData?.backgroundImage && (
          <img
            src={bannerData.backgroundImage}
            alt="Girls Wear Trendy & Stylish"
            className="girls-wear-banner-img"
            onError={(e) => {
              e.target.onerror = null;

            }}
          />
        )}
      </section>
    </>
  );
};

export default ProductCarousel;
