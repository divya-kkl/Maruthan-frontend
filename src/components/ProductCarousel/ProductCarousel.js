import React, { useState, useEffect, useRef } from 'react';
import './ProductCarousel.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanner } from '../../redux/Slice/bannerSlice';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';

const CarouselCard = ({ product, openQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const displayImage = product.images && product.images.length > 0
    ? (isHovered && product.images.length > 1 ? product.images[1] : product.images[0])
    : '/images/placeholder.png';

  return (
    <div
      className="carousel-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="carousel-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
        <div className="badge-new">New</div>
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

  const { product, status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);
  const { banner } = useSelector((state) => state.banner);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

  const loading = (productStatus === 'loading' || productStatus === 'idle') && tagStatus !== 'succeeded';

  const genericProducts = product && product.length > 0
    ? [...product].filter(p => !p.tags || p.tags.length === 0)
    : [];
  const taggedProducts = productsByTag['EXCLUSIVE PATTU PAVADAI COLLECTIONS'] || [];

  const combinedProducts = [...taggedProducts, ...genericProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values());

  const bannerData = banner && banner.length > 0 ? banner.find((b) => b.bannerType === 'SECOND') : null;

  const openQuickView = (product) => {
    setSelectedProduct(product);
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
    dispatch(fetchProductsByTag({ code: 'EXCLUSIVE PATTU PAVADAI COLLECTIONS', limit: 10 }));
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
              <h2 className="carousel-title">Exclusive Pattu Pavadai Collections</h2>
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
                  <CarouselCard key={product.id} product={product} openQuickView={openQuickView} />
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
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
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
