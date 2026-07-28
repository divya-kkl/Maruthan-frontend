import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './GirlsPage.css';
import { fetchCategoryProducts, resetCategoryProducts } from '../../redux/Slice/categoryProductsSlice';
import { openQuickView as openGlobalQuickView } from '../../redux/Slice/tagProductsSlice';

const GirlsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    products,
    loading,
    loadingMore,
    hasMore,
    totalCount,
  } = useSelector((state) => state.categoryProducts);

  const [page, setPage] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);
  const itemsPerPage = 12;
  const loadMoreRef = useRef(null);
  const [expandedFilters, setExpandedFilters] = useState({
    size: false,
    moreFilters: false,
    colour: false,
    stock: false,
    price: false
  });

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  useEffect(() => {
    dispatch(fetchCategoryProducts({
      categoryCode: 'GIRLS',
      sort: 'features',
      page: page,
      limit: itemsPerPage,
      filters: null,
      isNewQuery: page === 1
    }));
  }, [page, dispatch, itemsPerPage]);

  // Clean up products when leaving the page
  useEffect(() => {
    return () => {
      dispatch(resetCategoryProducts());
    };
  }, [dispatch]);

  // Detect first user scroll to prevent instant loading on very large monitors
  useEffect(() => {
    window.scrollTo(0, 0); // Reset scroll position when page loads/reloads
    const handleInitialScroll = () => {
      setHasScrolled(true);
      window.removeEventListener('scroll', handleInitialScroll);
    };
    window.addEventListener('scroll', handleInitialScroll);
    return () => window.removeEventListener('scroll', handleInitialScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loadingMore && hasScrolled) {
        setPage((prev) => prev + 1);
      }
    }, { rootMargin: '0px' });

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loadingMore, hasScrolled]);

  const openQuickView = (product) => {
    dispatch(openGlobalQuickView({
      ...product,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
      originalPrice: product.mrp
    }));
  };

  return (
    <div className="category-page-container">

      <div className="category-breadcrumbs">
        <Link to="/">Home</Link> - Best sellers_Girls
      </div>

      <h1 className="category-page-title">Best sellers_Girls</h1>

      <div className="category-main-layout">

        <aside className="category-sidebar">
          <div className="filter-accordion">

            <div className={`filter-group ${expandedFilters.size ? 'expanded' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter('size')}>
                <span>Size</span>
                <span className="filter-icon">{expandedFilters.size ? '-' : '+'}</span>
              </div>
              {expandedFilters.size && (
                <div className="filter-content">
                  <div className="filter-checkbox-list">
                    <label className="filter-checkbox-item"><input type="checkbox" defaultChecked /> S (23)</label>
                    <label className="filter-checkbox-item"><input type="checkbox" /> M (42)</label>
                    <label className="filter-checkbox-item"><input type="checkbox" /> 1Y (47)</label>
                    <label className="filter-checkbox-item"><input type="checkbox" /> 2Y (37)</label>
                    <label className="filter-checkbox-item"><input type="checkbox" /> 3Y (40)</label>
                  </div>
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.colour ? 'expanded' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter('colour')}>
                <span>Colour</span>
                <span className="filter-icon">{expandedFilters.colour ? '-' : '+'}</span>
              </div>
              {expandedFilters.colour && (
                <div className="filter-content">
                  <div className="filter-colors-grid">
                    <div className="color-swatch-wrapper"><div className="color-swatch" style={{ backgroundColor: 'black' }}></div></div>
                    <div className="color-swatch-wrapper selected"><div className="color-swatch" style={{ backgroundColor: 'blue' }}></div></div>
                    <div className="color-swatch-wrapper"><div className="color-swatch" style={{ backgroundColor: 'red' }}></div></div>
                    <div className="color-swatch-wrapper"><div className="color-swatch" style={{ backgroundColor: 'pink' }}></div></div>
                  </div>
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.price ? 'expanded' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter('price')}>
                <span>Price</span>
                <span className="filter-icon">{expandedFilters.price ? '-' : '+'}</span>
              </div>
              {expandedFilters.price && (
                <div className="filter-content">
                  <div className="filter-price-inputs">
                    <div className="price-input-box">
                      <span>₹</span>
                      <input type="text" value="0.00" readOnly />
                    </div>
                    <span>-</span>
                    <div className="price-input-box">
                      <span>₹</span>
                      <input type="text" value="1,699.00" readOnly />
                    </div>
                  </div>
                  <div className="price-slider-line"></div>
                  <div className="price-range-text">Price: Rs. 0.00 - Rs. 1,699.00</div>
                </div>
              )}
            </div>

          </div>
        </aside>

        <div className="category-content">

          <div className="category-top-bar">
            <div className="results-count">
              There are {totalCount || 0} results in total
            </div>
            <div className="sort-by-wrapper">
              <span>Sort by:</span>
              <select className="sort-by-select">
                <option value="features">Features</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="new">Date, new to old</option>
              </select>
            </div>
          </div>

          <div className="category-product-grid">
            {loading ? (
              <div className="category-loading">
                <div className="spinner"></div>
                <p>Loading collection...</p>
              </div>
            ) : products.length > 0 ? (
              products.map((product) => (
                <div className="category-card" key={product.id}>
                  <div
                    className="category-image-wrapper"
                    onClick={() => navigate(`/product/${product.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                      alt={product.name}
                      className="category-image"
                    />
                  </div>
                  <div className="category-info">
                    <h3
                      className="category-name"
                      title={product.name}
                      onClick={() => navigate(`/product/${product.id}`)}
                      style={{ cursor: 'pointer' }}
                    >
                      {product.name}
                    </h3>
                    <div className="category-price">
                      Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                    <button className="category-select-btn" onClick={() => openQuickView(product)}>Select Options</button>
                  </div>
                </div>
              ))
            ) : (
              <div className="category-empty-state">
                <div className="empty-icon">🛍️</div>
                <h2>No products found</h2>
                <p>We are currently updating our collection for Girls. Please check back later!</p>
                <button className="continue-shopping-btn" onClick={() => navigate('/')}>Continue Shopping</button>
              </div>
            )}

            {loadingMore && [...Array(4)].map((_, index) => (
              <div className="category-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="category-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                  <div className="shimmer-button"></div>
                </div>
              </div>
            ))}

            {/* Loading Indicator matching Little RR style */}
            {(!loading || page > 1) && products.length > 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '30px 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p style={{ color: '#555', fontSize: '14px', marginBottom: '10px' }}>
                  You've viewed {Math.min(products.length, totalCount)} of {totalCount} result{totalCount !== 1 ? 's' : ''}
                </p>
                <div style={{ width: '250px', height: '2px', backgroundColor: '#e0e0e0', marginBottom: '25px', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', backgroundColor: '#1a365d', width: `${Math.min(100, (products.length / (totalCount || 1)) * 100)}%`, transition: 'width 0.3s ease' }}></div>
                </div>
                
                {hasMore && (
                  <button 
                    style={{
                      width: '180px',
                      height: '50px',
                      backgroundColor: '#1a365d',
                      color: '#fff',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: 'none',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      cursor: loadingMore ? 'default' : 'pointer'
                    }}
                    onClick={() => !loadingMore && setPage(prev => prev + 1)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px', borderTopColor: 'transparent', borderColor: 'rgba(255,255,255,0.3)', borderTop: '2px solid #fff', margin: 0 }}></div>
                    ) : (
                      "Load More"
                    )}
                  </button>
                )}
              </div>
            )}
            
            {/* Invisible div for IntersectionObserver, kept outside condition to ensure ref is attached */}
            <div ref={loadMoreRef} style={{ height: '20px', width: '100%' }}></div>
          </div>

        </div>
      </div>

    </div>
  );
};


export default GirlsPage;
