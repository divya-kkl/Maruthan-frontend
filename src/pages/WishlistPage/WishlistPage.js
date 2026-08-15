import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GraphQLClient, gql } from 'graphql-request';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { removeFromWishlistThunk } from '../../redux/Slice/wishlistSlice';
import { addToCart } from '../../redux/Slice/cartSlice';
import './WishlistPage.css';

const GRAPHQL_ENDPOINT = 'http://localhost:2000/graphql';

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      price
      mrp
      images
      discountPercentage
      isFeatured
      hasSize
    }
  }
`;

const WishlistPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user?.user);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) {
      navigate('/login');
      return;
    }

    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const products = await Promise.all(
          wishlistItems.map(async (id) => {
            try {
              const data = await client.request(GET_PRODUCT_BY_ID, { id });
              return data.getProductById;
            } catch (err) {
              console.error(`Failed to fetch product ${id}`, err);
              return null;
            }
          })
        );
        setWishlistProducts(products.filter(p => p !== null));
      } catch (err) {
        console.error("Failed to fetch wishlist products", err);
      } finally {
        setLoading(false);
      }
    };

    if (wishlistItems.length > 0) {
      fetchWishlistProducts();
    } else {
      setWishlistProducts([]);
      setLoading(false);
    }
  }, [wishlistItems, user, navigate]);

  const handleRemove = (e, productId) => {
    e.preventDefault();
    if (user && user.id) {
      dispatch(removeFromWishlistThunk({ userId: user.id, productId }));
    }
  };

  const handleAddToCart = (product) => {
    dispatch(addToCart({ 
      product, 
      quantity: 1, 
      size: product.hasSize ? 'Default' : undefined 
    }));
    // Optionally remove from wishlist after adding to cart
    // handleRemove(product.id);
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-container">
          <h2>My Wishlist</h2>
          <div className="wishlist-grid">
            {[...Array(4)].map((_, index) => (
              <div className="wishlist-card shimmer-card" key={`shimmer-${index}`}>
                <div className="shimmer-image"></div>
                <div className="wishlist-info" style={{ width: '100%', padding: '15px' }}>
                  <div className="shimmer-text title"></div>
                  <div className="shimmer-text price"></div>
                  <div className="shimmer-button"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-container">
        <h2>My Wishlist</h2>
        
        {wishlistProducts.length === 0 ? (
          <div className="empty-wishlist">
            <img src="/images/empty-wishlist.png" alt="Empty Wishlist" onError={(e) => e.target.style.display = 'none'} />
            <h3>Your wishlist is empty</h3>
            <p>Explore more and shortlist some items</p>
            <button className="continue-shopping-btn" onClick={() => navigate('/')}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => (
              <div className="wishlist-card" key={product.id}>
                <div className="wishlist-image-wrapper" onClick={() => navigate(`/product/${product.id}`)}>
                  
                  <img
                    src={product.images && product.images.length > 0 ? product.images[0] : '/images/placeholder.png'}
                    alt={product.name}
                    className="wishlist-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/placeholder.png";
                    }}
                  />
                  <button 
                    className="remove-wishlist-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(e, product.id);
                    }}
                    title="Remove from Wishlist"
                  >
                    <FaHeart color="red" />
                  </button>
                </div>
                <div className="wishlist-info">
                  <h3 className="wishlist-product-name" title={product.name}>{product.name}</h3>
                  <div className="wishlist-price-container">
                    <span className="wishlist-price">
                      Rs. {Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    {product.mrp > product.price && (
                      <span className="wishlist-mrp">
                        Rs. {Number(product.mrp).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    )}
                  </div>
                  <button 
                    className="wishlist-add-to-cart-btn" 
                    onClick={() => handleAddToCart(product)}
                  >
                    <FaShoppingCart /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
