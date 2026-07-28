import React, { useState, useEffect } from 'react';
import './BoysShowcase.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategories } from '../../redux/Slice/headerSlice';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
import { fetchProductsByTag } from '../../redux/Slice/tagProductsSlice';
import { useNavigate } from 'react-router-dom';
import QuickViewModal from '../QuickViewModal/QuickViewModal';

const BoysShowcase = () => {
  const dispatch = useDispatch();
  const { categories, loading: catLoading } = useSelector((state) => state.category);
  const { product: allProducts, status: productStatus } = useSelector((state) => state.product);
  const { productsByTag, status: tagStatus } = useSelector((state) => state.tagProducts);

  const loading = (productStatus === 'loading' || productStatus === 'idle' || catLoading) && tagStatus !== 'succeeded';

  let boysProducts = [];
  if (allProducts && allProducts.length > 0) {
    const boysCategory = categories?.find(c =>
      c.name.toLowerCase().includes('boy') || c.code.toLowerCase().includes('boy')
    );

    if (boysCategory) {
      boysProducts = allProducts.filter(p =>
        p.productCategoriesID === boysCategory.id ||
        (p.productCategoriesCode && p.productCategoriesCode.includes(boysCategory.code))
      );
    }

    if (boysProducts.length === 0) {
      boysProducts = allProducts.filter(p => p.name.toLowerCase().includes('boy'));
    }
  }

  const genericProducts = boysProducts.length > 0
    ? [...boysProducts].filter(p => !p.tags || p.tags.length === 0)
    : [];
  const taggedProducts = productsByTag['BOYS ETHNIC WEAR COLLECTION'] || [];

  const combinedProducts = [...taggedProducts, ...genericProducts];
  const uniqueProductsMap = new Map();
  combinedProducts.forEach(p => {
    if (!uniqueProductsMap.has(p.id)) {
      uniqueProductsMap.set(p.id, p);
    }
  });

  const products = Array.from(uniqueProductsMap.values()).slice(0, 5);

  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const openQuickView = (product) => { setSelectedProduct(product); };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProducts());
    dispatch(fetchProductsByTag({ code: 'BOYS ETHNIC WEAR COLLECTION', limit: 5 }));
  }, [dispatch]);

  return (
    <section className="boys-section">
      <div className="boys-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px', marginBottom: '10px' }}></div>
            <div className="shimmer-text" style={{ width: '400px', height: '20px' }}></div>
          </div>
        ) : (
          <>
            <h2 className="boys-title">Boys Ethnic Wear Collection</h2>
            <p className="boys-subtitle">Let your boy stand out from the crowd in our unique ethnic wears like dhoti shirts and more. Fashion that's as playful as he is!</p>
          </>
        )}

        <div className="boys-grid">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div className="boys-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="boys-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                  <div className="shimmer-button"></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="boys-card" key={product.id}>
                <div className="boys-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="boys-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="boys-info">
                  <h3 className="boys-name" title={product.name}>{product.name}</h3>
                  <div className="boys-price">
                    Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                  <button className="boys-select-btn" onClick={() => openQuickView(product)}>Select Options</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No products found for boys.</p>
          )}
        </div>

        <div className="boys-view-all-wrapper">
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
          ) : (
            <button className="boys-view-all-btn" onClick={() => navigate('/categories/BOYS')}>
              View All
            </button>
          )}
        </div>
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default BoysShowcase;
