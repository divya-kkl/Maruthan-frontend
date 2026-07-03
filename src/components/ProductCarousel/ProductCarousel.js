import React, { useState, useEffect, useRef } from 'react';
import './ProductCarousel.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GraphQLClient, gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCTS = gql`
  query GetProduct($search: String) {
    getProduct(search: $search) {
      products {
      id
      name
      price
      mrp
      discountPercentage
      images
      brand
      productCategoriesID
      productCategoriesCode
      variants {
        color
        size
        stock
      }
      createdAt
      updatedAt
    }
  }
}`;

const GET_ACTIVE_BANNERS = gql`
  query GetActiveBanners($bannerType: String) {
    getActiveBanners(bannerType: $bannerType) {
      id
      backgroundImage
      bannerType
      isActive
    }
  }
`;

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
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [bannerData, setBannerData] = useState(null);
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();

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
    const fetchBanner = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_ACTIVE_BANNERS, { bannerType: "SECOND" });
        if (data.getActiveBanners && data.getActiveBanners.length > 0) {
          setBannerData(data.getActiveBanners[0]);
        }
      } catch (err) {
        console.error('Error fetching Second banner:', err);
      }
    };
    fetchBanner();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCTS, { search: '' });
        const fetchedProducts = data.getProduct?.products ? data.getProduct?.products : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        <img
          src={bannerData?.backgroundImage || "/images/banner1.jpg"}
          alt="Girls Wear Trendy & Stylish"
          className="girls-wear-banner-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/banner1.png"; // temporary fallback so you can see it
          }}
        />
      </section>
    </>
  );
};

export default ProductCarousel;
