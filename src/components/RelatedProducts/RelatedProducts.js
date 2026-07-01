import React, { useState, useEffect } from 'react';
import './RelatedProducts.css';
import { GraphQLClient, gql } from 'graphql-request';
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
      images
      variants {
        color
        size
        stock
      }
    }
  }
}`;

const RelatedProducts = ({ title = "New Arrivals" }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_PRODUCTS, { search: '' });
        // Get 10 items to match the layout (5x2 grid)
        const fetchedProducts = data.getProduct?.products ? data.getProduct?.products.slice(0, 10) : [];
        setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const openQuickView = (product) => {
    setSelectedProduct({
      ...product,
      image: product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png',
      originalPrice: product.mrp
    });
  };

  const truncate = (str, n) => {
    return (str.length > n) ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <section className="related-products-section">
      <div className="related-products-grid">
        {loading ? (
          <p style={{ textAlign: 'center', width: '100%', padding: '20px' }}>Loading products...</p>
        ) : (
          products.map((product) => (
            <div className="rp-card" key={product.id}>
              <div className="rp-image-wrapper" onClick={() => openQuickView(product)}>
                <img 
                  src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'} 
                  alt={product.name} 
                  className="rp-image" 
                />
              </div>
              <div className="rp-info">
                <p className="rp-name" title={product.name}>
                  {truncate(product.name, 45)}
                </p>
                <p className="rp-price">
                  Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </p>
                <button 
                  className="rp-select-btn" 
                  onClick={() => openQuickView(product)}
                >
                  Select Options
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      {selectedProduct && <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </section>
  );
};

export default RelatedProducts;
