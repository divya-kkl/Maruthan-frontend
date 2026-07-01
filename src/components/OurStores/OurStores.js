import React, { useState, useEffect } from 'react';
import './OurStores.css';
import { GraphQLClient, gql } from 'graphql-request';
import { FaWhatsapp, FaMapMarkerAlt } from 'react-icons/fa';

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
                image: shop.image || `/images/store${(index % 3) + 1}.jpg`
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
    if (contactNumber) {
      const cleanNumber = contactNumber.toString().replace(/\D/g, '');
      window.open(`https://wa.me/${cleanNumber}`, '_blank');
    }
  };

  const handleDirectionClick = (address) => {
    const query = address ? encodeURIComponent(address) : 'Kalayarkovil';
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
      
      <div className="our-stores-grid">
        {loading ? (
          [...Array(3)].map((_, index) => (
            <div className="store-card shimmer-card" key={`shimmer-store-${index}`}>
              <div className="shimmer-image"></div>
              <div className="store-info" style={{ width: '100%' }}>
                <div className="shimmer-text title"></div>
                <div className="shimmer-text"></div>
                <div className="shimmer-text"></div>
                <div className="shimmer-text price"></div>
                <div className="store-actions">
                   <div className="shimmer-button" style={{ width: '48%', marginTop: 0 }}></div>
                   <div className="shimmer-button" style={{ width: '48%', marginTop: 0 }}></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stores.map((store, index) => (
            <div className="store-card" key={store.id || index}>
              <div className="store-image-wrapper">
                <img src={store.image} alt={store.shopName} className="store-image" 
                     onError={(e) => { e.target.src = '/images/placeholde.png' }} />
              </div>
              <div className="store-info">
                <h3 className="store-name">{store.shopName || 'Store Name N/A'}</h3>
                {store.ownerName && <p className="store-city">Owner: {store.ownerName}</p>}
                {store.email && <p className="store-address">Email: {store.email}</p>}
                {store.address && <p className="store-address">{store.address}</p>}
                {store.contactNumber && <p className="store-contact">{store.contactNumber}</p>}
                
                <div className="store-actions">
                  <button 
                    className="store-btn whatsapp-btn"
                    onClick={() => handleWhatsAppClick(store.contactNumber)}
                  >
                    <FaWhatsapp className="store-btn-icon" />
                    WhatsApp
                  </button>
                  <button 
                    className="store-btn direction-btn"
                    onClick={() => handleDirectionClick(store.address)}
                  >
                    <FaMapMarkerAlt className="store-btn-icon" />
                    Get Direction
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default OurStores;
