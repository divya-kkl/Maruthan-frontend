import React from 'react';
import { useSelector } from 'react-redux';
import { FiBox, FiCheckCircle, FiMessageCircle } from 'react-icons/fi';
import './StoreFeatures.css';

const StoreFeatures = () => {
  const { features } = useSelector((state) => state.storeFeatures);

  const renderIcon = (iconType) => {
    switch (iconType) {
      case 'box': return <FiBox className="sf-icon" />;
      case 'check': return <FiCheckCircle className="sf-icon" />;
      case 'message': return <FiMessageCircle className="sf-icon" />;
      default: return <FiBox className="sf-icon" />;
    }
  };

  return (
    <section className="store-features-section">
      <div className="store-features-grid">
        {features?.map((feature) => (
          <div className="sf-item" key={feature.id}>
            <div className="sf-icon-wrapper">
              {renderIcon(feature.iconType)}
            </div>
            <div className="sf-content">
              <h3 className="sf-title">{feature.title}</h3>
              <p className="sf-desc">
                {feature.desc}
                {feature.linkText && <span className="sf-link">{feature.linkText}</span>}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoreFeatures;
