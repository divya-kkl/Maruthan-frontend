import { useEffect } from 'react';
import './OurStoresPage.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStores } from '../../redux/Slice/storeSlice';
import { FiMapPin, FiPhone, FiUser, FiMessageCircle, FiCompass, FiHome } from 'react-icons/fi';


const OurStores = () => {
 const dispatch = useDispatch();
 const { store: stores = [] } = useSelector((state) => state.store);

  useEffect(() => {
    dispatch(fetchStores())

  }, [dispatch]);

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
    <div className="osp-page-container">
      {/* Header Banner */}
      <div className="osp-header-banner" style={{ backgroundImage: "linear-gradient(to right, rgba(15, 45, 92, 0.9), rgba(15, 45, 92, 0.7)), url('/images/promo_bg.png')" }}>
        <div className="osp-header-overlay"></div>
        <div className="osp-header-content">
          <div className="osp-header-pre">
            <span className="ornament-line"></span>
            <span className="pre-text">FIND A STORE NEAR YOU</span>
            <span className="ornament-line"></span>
          </div>
          <h1 className="osp-header-title">
            Our <span className="highlight-text">Stores</span>
          </h1>
          <p className="osp-header-subtitle">
            Visit us in person for the best collections, quality & service.
          </p>
        </div>
      </div>

      {/* Stores List Section */}
      <section className="osp-section">
        <div className="osp-grid">
          {stores.map((store, index) => {
            return (
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
            );
          })}
        </div>
      </section>

      {/* Trust Badges Bottom Bar */}
      <div className="osp-features-bar-container">
        <div className="osp-features-bar">
          <div className="osp-feature-item">
            <div className="feature-icon-wrapper">
              <FiHome className="feature-icon" />
            </div>
            <div className="feature-text">
              <h4>Multiple Stores</h4>
              <p>Find us near you</p>
            </div>
          </div>

          <div className="osp-feature-item">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 11 2 2 4-4" />
              </svg>
            </div>
            <div className="feature-text">
              <h4>Trusted Quality</h4>
              <p>Best products & service</p>
            </div>
          </div>

          <div className="osp-feature-item">
            <div className="feature-icon-wrapper">
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" className="feature-icon">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="feature-text">
              <h4>Customer Support</h4>
              <p>We're here to help</p>
            </div>
          </div>

          <div className="osp-feature-item">
            <div className="feature-icon-wrapper">
              <FiCompass className="feature-icon" />
            </div>
            <div className="feature-text">
              <h4>Easy Navigation</h4>
              <p>Get directions easily</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurStores;
