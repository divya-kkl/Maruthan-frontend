import React, { useState, useEffect } from 'react';
import './PromoCarousel.css';
import { GraphQLClient, gql } from 'graphql-request';
import { useNavigate } from 'react-router-dom';

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
        variants {
          color
          size
          stock
        }
        description
      }
    }
  }`;

const PromoCarousel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCTS, { search: '' });
        const fetchedProducts = data.getProduct?.products ? data.getProduct?.products.slice(0, 5) : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching promo products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="promo-carousel-section">
      <div className="promo-header-bar">
        <div className="marquee-container">
          <div className="marquee-text">
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
            <span>New Arrival Spotlight – Discover What Everyone's Loving Now 👀</span>
          </div>
        </div>
      </div>

      <div className="promo-container">
        <div className="promo-grid">
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div className="promo-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="promo-info" style={{ width: '100%' }}>
                  <div className="shimmer-text" style={{ width: '80%', margin: '0 auto 10px' }}></div>
                  <div className="shimmer-button" style={{ margin: '0 auto' }}></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="promo-card" key={product.id}>
                <div className="promo-image-wrapper">
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="promo-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                </div>
                <div className="promo-info">
                  <p className="promo-desc" title={product.name}>{product.name}</p>
                  <button className="promo-shop-btn" onClick={() => navigate(`/product/${product.id}`)}>Shop Now</button>
                </div>
              </div>
            ))
          ) : (
            <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>No promos found.</p>
          )}
        </div>
        
        <div className="promo-view-all-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', borderRadius: '4px' }}></div>
          ) : (
            <button className="promo-view-all-btn" onClick={() => navigate('/CartPage')}>
              View All
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromoCarousel;
