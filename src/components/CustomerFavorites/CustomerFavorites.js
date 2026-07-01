import React, { useState, useEffect } from 'react';
import './CustomerFavorites.css';
import { GraphQLClient, gql } from 'graphql-request';
import { FaInstagram, FaHeart } from 'react-icons/fa';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCTS = gql`
  query GetProduct($search: String) {
    getProduct(search: $search) {
      products {
      id
      name
      price
      images
    }
  }
}`;

const CustomerFavorites = ({ title = "Loved by Our Little Customers 💛" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCTS, { search: '' });
        // Slice to get a good number of items for the carousel
        const fetchedProducts = data.getProduct?.products ? data.getProduct?.products.slice(0, 6) : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching customer favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Use product name for description, limit length
  const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <section className="customer-favorites-section">
      <div className="customer-favorites-header">
        <h2 className="customer-favorites-title">{title}</h2>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="customer-favorites-insta-btn">
          <FaInstagram className="cf-insta-icon" />
          Follow Us on Instagram
        </a>
      </div>

      <div className="cf-carousel-container">
        {loading ? (
          <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Loading products...</p>
        ) : (
          <div className="cf-carousel-wrapper">
            <div className="cf-track">
              {products.map((product, index) => (
                <div className="cf-card" key={`t1-${product.id}-${index}`}>
                  <div className="cf-image-wrapper">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'} 
                      alt={product.name} 
                      className="cf-image" 
                    />
                  </div>
                  <div className="cf-info">
                    <p className="cf-desc" title={product.name}>
                      {truncate(product.name, 65)}
                    </p>
                    <div className="cf-likes">
                      <FaHeart className="cf-heart-icon" />
                      <span>{Math.floor(Math.random() * (300 - 100 + 1) + 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Duplicate track for seamless infinite scroll */}
            <div className="cf-track" aria-hidden="true">
              {products.map((product, index) => (
                <div className="cf-card" key={`t2-${product.id}-${index}`}>
                  <div className="cf-image-wrapper">
                    <img 
                      src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'} 
                      alt={product.name} 
                      className="cf-image" 
                    />
                  </div>
                  <div className="cf-info">
                    <p className="cf-desc" title={product.name}>
                      {truncate(product.name, 65)}
                    </p>
                    <div className="cf-likes">
                      <FaHeart className="cf-heart-icon" />
                      <span>{Math.floor(Math.random() * (300 - 100 + 1) + 100)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CustomerFavorites;
