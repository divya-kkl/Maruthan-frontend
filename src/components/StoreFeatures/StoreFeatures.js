import React from 'react';
import { FiBox, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';
import './StoreFeatures.css';

const StoreFeatures = () => {
  return (
    <section className="store-features-section">
      <div className="store-features-grid">
        <div className="sf-item">
          <div className="sf-icon-wrapper">
            <FiBox className="sf-icon" />
          </div>
          <div className="sf-content">
            <h3 className="sf-title">Free Shipping</h3>
            <p className="sf-desc">
              Enjoy free delivery across India on prepaid orders above ₹ 2000.
            </p>
          </div>
        </div>

        <div className="sf-item">
          <div className="sf-icon-wrapper">
            <FiCheckCircle className="sf-icon" />
          </div>
          <div className="sf-content">
            <h3 className="sf-title">Exchange</h3>
            <p className="sf-desc">
              Exchange within 7 days, please make sure the items are in undamaged condition. <span className="sf-link">Read Exchange Policy.</span>
            </p>
          </div>
        </div>

        <div className="sf-item">
          <div className="sf-icon-wrapper">
            <FiMessageCircle className="sf-icon" />
          </div>
          <div className="sf-content">
            <h3 className="sf-title">Support Online</h3>
            <p className="sf-desc">
              We're available Monday to Saturday, 10:30 AM - 6:00 PM. Closed on Sundays. Feel free to reach out - we're here to help!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StoreFeatures;
