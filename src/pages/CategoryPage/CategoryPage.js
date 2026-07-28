import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './CategoryPage.css';
import { fetchCategoryProducts, resetCategoryProducts } from '../../redux/Slice/categoryProductsSlice';
import { openQuickView as openGlobalQuickView } from '../../redux/Slice/tagProductsSlice';

const CategoryPage = ({ type = 'category' }) => {
  const { categoryCode, tagCode } = useParams();
  const activeCode = type === 'tag' ? tagCode : categoryCode;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const {
    products,
    filterData,
    loading,
    loadingMore,
    hasMore,
    totalCount,
  } = useSelector((state) => state.categoryProducts);

  const [sort, setSort] = useState('features');
  const [page, setPage] = useState(1);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const itemsPerPage = 12;
  const loadMoreRef = useRef(null);

  // Active filters state
  const [activeFilters, setActiveFilters] = useState({
    sizes: [],
    brands: [],
    colors: [],
    stock: [],
    price: { min: '', max: '' }
  });

  // Local string state for price inputs (so user can clear '0' and type freely)
  const [priceInputMin, setPriceInputMin] = useState('0');
  const [priceInputMax, setPriceInputMax] = useState('0');

  // Filter accordion states
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

  const handleFilterChange = (type, value) => {
    setPage(1);
    setActiveFilters(prev => {
      const currentList = prev[type];
      
      if (type === 'colors') {
        if (currentList.includes(value)) {
          return { ...prev, [type]: [] };
        } else {
          return { ...prev, [type]: [value] };
        }
      }

      if (currentList.includes(value)) {
        return { ...prev, [type]: currentList.filter(item => item !== value) };
      } else {
        return { ...prev, [type]: [...currentList, value] };
      }
    });
  };

  // Serialize activeFilters to a stable string to avoid object-reference re-renders
  const activeFiltersKey = JSON.stringify(activeFilters);
  useEffect(() => {
    if (filterData.price.max > 0 && priceInputMax === '0') {
      setPriceInputMin('0');
      setPriceInputMax(String(filterData.price.max));
    }
  }, [filterData.price.max, priceInputMax]);

  const handleMinSliderChange = (e) => {
    const value = Math.min(Number(e.target.value), (priceInputMax === '' ? (filterData.price.max || 10000) : Number(priceInputMax)) - 1);
    setPriceInputMin(String(value));
  };

  const handleMaxSliderChange = (e) => {
    const value = Math.max(Number(e.target.value), (priceInputMin === '' ? 0 : Number(priceInputMin)) + 1);
    setPriceInputMax(String(value));
  };

  const handleSliderRelease = () => {
    setActiveFilters(prev => ({
      ...prev,
      price: {
        min: priceInputMin === '' ? 0 : Number(priceInputMin),
        max: priceInputMax === '' ? (filterData.price.max || 10000) : Number(priceInputMax)
      }
    }));
    setPage(1);
  };

  useEffect(() => {
    const filters = JSON.parse(activeFiltersKey);

    const apiFilters = {
      sizes: filters.sizes.length > 0 ? filters.sizes : null,
      brands: filters.brands.length > 0 ? filters.brands : null,
      colors: filters.colors.length > 0 ? filters.colors : null,
      stock: filters.stock.length > 0 ? filters.stock : null,
      price: (filters.price.min !== '' || filters.price.max !== '') ? {
        min: filters.price.min !== '' ? Number(filters.price.min) : 0,
        max: filters.price.max !== '' ? Number(filters.price.max) : 999999
      } : null
    };

    if (activeCode) {
      dispatch(fetchCategoryProducts({
        code: activeCode,
        type,
        sort,
        page,
        limit: itemsPerPage,
        filters: apiFilters,
        isNewQuery: page === 1
      }));
    }
  }, [activeCode, type, sort, activeFiltersKey, page, dispatch, itemsPerPage]);

  
  useEffect(() => {
    return () => {
      dispatch(resetCategoryProducts());
    };
  }, [dispatch]);

  
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

  const formattedName = activeCode ? activeCode.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';
  const prefixTitle = type === 'tag' ? 'Tag_' : 'Best sellers_';

  const hasActiveFilters = 
    activeFilters.sizes.length > 0 ||
    activeFilters.brands.length > 0 ||
    activeFilters.colors.length > 0 ||
    activeFilters.stock.length > 0 ||
    (activeFilters.price.min !== '' && Number(activeFilters.price.min) > 0) ||
    (activeFilters.price.max !== '' && filterData.price.max > 0 && Number(activeFilters.price.max) < filterData.price.max);

  const filteredProducts = products;

  const currentMin = priceInputMin === '' ? 0 : Number(priceInputMin);
  const currentMax = priceInputMax === '' ? (filterData.price.max || 10000) : Number(priceInputMax);
  const totalMax = filterData.price.max || 10000;
  const minPercent = (currentMin / totalMax) * 100;
  const maxPercent = (currentMax / totalMax) * 100;

  return (
    <div className="category-page-container">

      {/* Breadcrumbs */}
      <div className="category-breadcrumbs">
        <Link to="/">Home</Link> - {prefixTitle}{formattedName}
      </div>

      {/* Main Title */}
      <h1 className="category-page-title">{prefixTitle}{formattedName}</h1>

      {/* Layout Grid (Sidebar + Content) */}
      <div className="category-main-layout">

        {/* Sidebar */}
        <aside className={`category-sidebar ${isMobileFilterOpen ? 'open' : ''}`}>
          <div className="mobile-filter-header">
            <h3>Filters</h3>
            <button className="close-filter-btn" onClick={() => setIsMobileFilterOpen(false)}>✕</button>
          </div>
          <div className="filter-accordion">

            <div className={`filter-group ${expandedFilters.size ? 'expanded' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter('size')}>
                <span>Size</span>
                <span className="filter-icon">{expandedFilters.size ? '-' : '+'}</span>
              </div>
              {expandedFilters.size && (
                <div className="filter-content">
                  <div className="filter-checkbox-list">
                    {filterData.sizes.map((size) => (
                      <label className="filter-checkbox-item" key={size.name}>
                        <input
                          type="checkbox"
                          checked={activeFilters.sizes.includes(size.name)}
                          onChange={() => handleFilterChange('sizes', size.name)}
                        />
                        {size.name} ({size.count})
                      </label>
                    ))}
                    {filterData.sizes.length === 0 && <span className="filter-text-item">No sizes available</span>}
                  </div>
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.moreFilters ? 'expanded' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter('moreFilters')}>
                <span>More filters</span>
                <span className="filter-icon">{expandedFilters.moreFilters ? '-' : '+'}</span>
              </div>
              {expandedFilters.moreFilters && (
                <div className="filter-content">
                  <div className="filter-checkbox-list">
                    {filterData.brands.map((brand) => (
                      <label className="filter-checkbox-item" key={brand.name}>
                        <input
                          type="checkbox"
                          checked={activeFilters.brands.includes(brand.name)}
                          onChange={() => handleFilterChange('brands', brand.name)}
                        />
                        {brand.name} ({brand.count})
                      </label>
                    ))}
                    {filterData.brands.length === 0 && <span className="filter-text-item">No filters available</span>}
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
                    {filterData.colors.map((color) => {
                      const normalizedColorName = color.name.toLowerCase().trim();
                      const colorMapping = {
                        'bule': 'blue',
                        'black and bule': 'linear-gradient(to right, black, blue)',
                        'color': '#e0e0e0',
                        'def': '#e0e0e0',
                        'dfd': '#e0e0e0',
                        'dfgt': '#e0e0e0',
                        'erser': '#e0e0e0',
                        'mikiki': '#e0e0e0',
                        'nt5': '#e0e0e0',
                        'peach': '#FFCBA4',
                        'mustard': '#FFDB58',
                        'navy': '#000080',
                        'maroon': '#800000',
                        'olive': '#808000'
                      };
                      const bgColor = colorMapping[normalizedColorName] || normalizedColorName.replace(/\s/g, '');
                      const styleProp = bgColor.includes('gradient') ? { background: bgColor } : { backgroundColor: bgColor };

                      return (
                      <div
                        className={`color-swatch-wrapper ${activeFilters.colors.includes(color.name) ? 'selected' : ''}`}
                        key={color.name}
                        title={`${color.name} (${color.count})`}
                        onClick={() => handleFilterChange('colors', color.name)}
                      >
                        <div className="color-swatch" style={{ ...styleProp, border: '1px solid #ccc' }}></div>
                      </div>
                    )})}
                    {filterData.colors.length === 0 && <span className="filter-text-item">No colors available</span>}
                  </div>
                </div>
              )}
            </div>

            <div className={`filter-group ${expandedFilters.stock ? 'expanded' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter('stock')}>
                <span>Stock Availabilty</span>
                <span className="filter-icon">{expandedFilters.stock ? '-' : '+'}</span>
              </div>
              {expandedFilters.stock && (
                <div className="filter-content">
                  <div className="filter-checkbox-list">
                    <label className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={activeFilters.stock.includes('In stock')}
                        onChange={() => handleFilterChange('stock', 'In stock')}
                      />
                      In stock ({filterData.stock.inStock})
                    </label>
                    <label className="filter-checkbox-item">
                      <input
                        type="checkbox"
                        checked={activeFilters.stock.includes('Out of stock')}
                        onChange={() => handleFilterChange('stock', 'Out of stock')}
                      />
                      Out of stock ({filterData.stock.outOfStock})
                    </label>
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
                      <input
                        type="text"
                        inputMode="numeric"
                        value={priceInputMin}
                        onChange={(e) => setPriceInputMin(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onBlur={() => {
                          const val = parseInt(priceInputMin, 10);
                          const parsed = isNaN(val) ? 0 : val;
                          setPriceInputMin(String(parsed));
                          setActiveFilters(prev => ({ ...prev, price: { ...prev.price, min: parsed } }));
                          setPage(1);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.target.blur();
                        }}
                      />
                    </div>
                    <span>-</span>
                    <div className="price-input-box">
                      <span>₹</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={priceInputMax}
                        onChange={(e) => setPriceInputMax(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        onBlur={() => {
                          const val = parseInt(priceInputMax, 10);
                          const parsed = isNaN(val) ? 0 : val;
                          setPriceInputMax(String(parsed));
                          setActiveFilters(prev => ({ ...prev, price: { ...prev.price, max: parsed } }));
                          setPage(1);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') e.target.blur();
                        }}
                      />
                    </div>
                  </div>
                  <div className="price-slider-container">
                    <div className="slider-track" style={{
                      background: `linear-gradient(to right, #ccc ${minPercent}%, #111 ${minPercent}%, #111 ${maxPercent}%, #ccc ${maxPercent}%)`
                    }}></div>
                    <input
                      type="range"
                      min={0}
                      max={totalMax}
                      value={currentMin}
                      onChange={handleMinSliderChange}
                      onMouseUp={handleSliderRelease}
                      onTouchEnd={handleSliderRelease}
                      className="range-input min-range"
                    />
                    <input
                      type="range"
                      min={0}
                      max={totalMax}
                      value={currentMax}
                      onChange={handleMaxSliderChange}
                      onMouseUp={handleSliderRelease}
                      onTouchEnd={handleSliderRelease}
                      className="range-input max-range"
                    />
                  </div>
                  <div className="price-range-text">Price: Rs. {currentMin} - Rs. {currentMax}</div>
                </div>
              )}
            </div>

          </div>
        </aside>

        {/* Main Content Area */}
        <div className="category-content">

          {/* Top Bar (Results Count & Sort) */}
          <div className="category-top-bar">
            <div className="results-count">
              There are {totalCount || 0} results in total
            </div>
            <button 
              className="mobile-filter-toggle-btn"
              onClick={() => setIsMobileFilterOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filter
            </button>
            <div className="sort-by-wrapper">
              <span>Sort by:</span>
              <select className="sort-by-select" value={sort} onChange={(e) => {setSort(e.target.value); setPage(1);}}>
                <option value="features">Features</option>
                <option value="most-relevant">Most relevant</option>
                <option value="bestselling">Best selling</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="atoz">Alphabetically, A-Z</option>
                <option value="ztoa">Alphabetically, Z-A</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="category-product-grid">
            {loading && page === 1 ? (
              [...Array(8)].map((_, index) => (
                <div className="category-card shimmer-card" key={`initial-shimmer-${index}`}>
                  <div className="shimmer-image"></div>
                  <div className="category-info" style={{ width: '100%' }}>
                    <div className="shimmer-text title"></div>
                    <div className="shimmer-text price"></div>
                    <div className="shimmer-button"></div>
                  </div>
                </div>
              ))
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
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
                {hasActiveFilters ? (
                  <>
                    <div className="empty-icon">🔍</div>
                    <h2>No products found</h2>
                    <p>We couldn't find any products matching your selected filters. Try clearing them or adjusting your budget!</p>
                    <button 
                      className="continue-shopping-btn" 
                      onClick={() => {
                        setActiveFilters({
                          sizes: [],
                          brands: [],
                          colors: [],
                          stock: [],
                          price: { min: 0, max: filterData.price.max }
                        });
                        setPriceInputMin('0');
                        setPriceInputMax(String(filterData.price.max));
                        setPage(1);
                      }}
                    >
                      Clear Filters
                    </button>
                  </>
                ) : (
                  <>
                    <div className="empty-icon">🛍️</div>
                    <h2>No products found</h2>
                    <p>We are currently updating our collection for this category. Please check back later!</p>
                    <button className="continue-shopping-btn" onClick={() => navigate('/')}>Continue Shopping</button>
                  </>
                )}
              </div>
            ) }

            {/* Shimmer loading for next pages */}
            {loadingMore && [...Array(4)].map((_, index) => (
              <div className="category-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="category-info" style={{width: '100%'}}>
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

export default CategoryPage;
