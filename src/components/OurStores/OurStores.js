import React, { useState, useEffect } from 'react';
import './OurStores.css';
import '../../pages/OurStoresPage/OurStoresPage.css';
import { GraphQLClient, gql } from 'graphql-request';
import { FiMapPin, FiPhone, FiUser, FiMessageCircle, FiCompass, FiHome } from 'react-icons/fi';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_SHOPS = gql`
  query GetAllShopUsers {
    getAllShopUsers {
      id
      shopName
      ownerName
      email
      contactNumber
      address
      createdAt
      image
    }
  }
`;

const OurStores = () => {
  const [stores, setStores] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_SHOPS);
        
        if (data.getAllShopUsers && data.getAllShopUsers.length > 0) {
          const fetchedStores = data.getAllShopUsers.map((shop, index) => {
             return {
                id: shop.id,
                shopName: shop.shopName,
                ownerName: shop.ownerName,
                email: shop.email,
                address: shop.address,
                contactNumber: shop.contactNumber,
                image: shop.image || `/images/store${(index % 3) + 1}.png`
             };
          });
          setStores(fetchedStores);
        } else {
          setStores([]);
        }
      } catch (err) {
        console.error('Error fetching stores:', err);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const handleWhatsAppClick = (contactNumber) => {
    if (!contactNumber) return;
    let primaryNumber = contactNumber.split(/[/,]/)[0];
    let cleanNumber = primaryNumber.replace(/[^\d+]/g, '');
    if (cleanNumber) {
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleDirectionsClick = (store) => {
    if (!store.address) return;
    const query = encodeURIComponent(`${store.shopName} ${store.address}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <section className="our-stores-section">
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
          <div className="shimmer-text title" style={{ width: '200px', height: '32px' }}></div>
        </div>
      ) : (
        <h2 className="our-stores-title">Our Stores</h2>
      )}
      
      <div className="osp-grid">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div className="osp-card shimmer-card" key={`shimmer-store-${index}`}>
              <div className="shimmer-image" style={{ height: '200px' }}></div>
              <div className="osp-info" style={{ width: '100%' }}>
                <div className="shimmer-text title"></div>
                <div className="shimmer-text"></div>
                <div className="shimmer-text"></div>
                <div className="shimmer-text price"></div>
                <div className="osp-actions">
                   <div className="shimmer-button" style={{ width: '48%', marginTop: 0 }}></div>
                   <div className="shimmer-button" style={{ width: '48%', marginTop: 0 }}></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stores.map((store, index) => (
            <div className="osp-card" key={store.id || index}>
              <div className="osp-image-wrapper">
                <img 
                  src={store.image} 
                  alt={store.shopName} 
                  className="osp-image"
                  onError={(e) => { e.target.src = `/images/store${(index % 3) + 1}.png` }} 
                />
                <div className="osp-badge">
                  <FiMapPin className="badge-icon" />
                  <div className="badge-text-container">
                    <span className="badge-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="badge-subtext">STORE</span>
                  </div>
                </div>
              </div>

              <div className="osp-info">
                {store.ownerName && (
                  <div className="osp-owner">
                    <FiUser className="owner-icon" />
                    <span>{store.ownerName}</span>
                  </div>
                )}

                <h3 className="osp-name">{store.shopName || 'Store Name N/A'}</h3>

                <div className="osp-divider">
                  <span className="divider-line"></span>
                  <span className="divider-dot"></span>
                  <span className="divider-line"></span>
                </div>

                {store.address && (
                  <div className="osp-detail-row">
                    <FiMapPin className="detail-icon" />
                    <p className="osp-address">{store.address}</p>
                  </div>
                )}

                {store.contactNumber && (
                  <div className="osp-detail-row">
                    <FiPhone className="detail-icon" />
                    <p className="osp-contact">{store.contactNumber}</p>
                  </div>
                )}

                <div className="osp-actions">
                  <button className="osp-btn osp-whatsapp-btn" onClick={() => handleWhatsAppClick(store.contactNumber)}>
                    <FiMessageCircle className="btn-icon" /> WhatsApp
                  </button>
                  <button className="osp-btn osp-direction-btn" onClick={() => handleDirectionsClick(store)}>
                    <FiCompass className="btn-icon" /> Get Directions
                  </button>
                </div>
              </div>

              <div className="osp-card-corner">
                <FiHome className="corner-icon" />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default OurStores;
