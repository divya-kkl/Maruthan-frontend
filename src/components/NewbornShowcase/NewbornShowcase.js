import React, { useState, useEffect } from 'react';
import './NewbornShowcase.css';
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
        images
      }
    }
  }
`;

const NewbornShowcase = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCTS, { search: '' });
        const fetchedProducts = data.getProduct?.products ? data.getProduct?.products.slice(0, 8) : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching newborn products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="newborn-showcase-section">
      <div className="newborn-container">
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
            <div className="shimmer-text title" style={{ width: '300px', height: '32px' }}></div>
          </div>
        ) : (
          <h2 className="newborn-title">Newborn Pattu Frock</h2>
        )}

        <div className="newborn-grid">
          {loading ? (
            [...Array(8)].map((_, index) => (
              <div className="newborn-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="newborn-info" style={{ width: '100%' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => (
              <div className="newborn-card" key={product.id}>
                <div className="newborn-image-wrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/product/${product.id}`)}>
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="newborn-image"
                  />
                </div>
                <div className="newborn-info">
                  <h3 className="newborn-name" title={product.name}>
                    {product.name}
                  </h3>
                  <div className="newborn-price">
                    Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                 
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>

        <div className="newborn-view-all-container">
          {loading ? (
            <div className="shimmer-button" style={{ width: '150px', margin: '0 auto', borderRadius: '4px' }}></div>
          ) : (
            <button className="newborn-view-all-btn" onClick={() => navigate('/categories/NEWBORN')}>
              View All
            </button>
          )}
        </div>
        {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
      </div>
    </section>
  );
};

export default NewbornShowcase;
