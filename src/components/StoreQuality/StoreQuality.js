import React from 'react';
import './StoreQuality.css';

const scorecards = [
  {
    country: "United States",
    month: "May",
    rating: "Good",
    ratingIndex: 2,
  },
  {
    country: "United Arab Emirates",
    month: "May",
    rating: "Great",
    ratingIndex: 3,
  },
  {
    country: "United States",
    month: "May",
    rating: "Good",
    ratingIndex: 2,
  }
];

const segments = ["Low", "Fair", "Good", "Great", "Exceptional"];

const StoreQuality = () => {
  return (
    <section className="store-quality-section">
      <h2 className="store-quality-title">This wasn't easy... but you made it possible.</h2>
      <p className="store-quality-subtitle">From India to the world - thank you for trusting us</p>

      <div className="store-quality-grid">
        {scorecards.map((card, idx) => (
          <div className="quality-card-wrapper" key={idx}>
            <div className="quality-card-inner">
              <h3 className="quality-card-header">
                Your store quality scorecard for <span className="highlight-blue">{card.country}</span> in <span className="highlight-blue">{card.month}</span>
              </h3>
              
              <p className="quality-card-desc">
                Scores shown are for your top country where products appear in free listings. To see scores for other countries, go to <span className="highlight-link">Store quality</span> in Merchant Center.
              </p>

              <div className="quality-rating-text">{card.rating}</div>

              <div className="quality-gauge-container">
                <div className="quality-gauge-top">
                  <div className="gauge-top-marker">
                    <span className="gauge-label">Top Quality Store</span>
                    <div className="gauge-static-arrow"></div>
                  </div>
                </div>
                
                <div className="quality-gauge-bar-wrapper">
                  {/* Arrow pointing to the middle of the active segment */}
                  <div 
                    className="gauge-arrow" 
                    style={{ left: `${(card.ratingIndex * 20) + 10}%` }}
                  ></div>
                  
                  <div className="quality-gauge-bars">
                    {segments.map((segment, segmentIdx) => (
                      <div 
                        key={segmentIdx} 
                        className={`gauge-segment ${segmentIdx <= card.ratingIndex ? 'filled' : 'empty'}`}
                      ></div>
                    ))}
                  </div>
                </div>

                <div className="quality-gauge-labels">
                  {segments.map((segment, segmentIdx) => (
                    <span key={segmentIdx} className="gauge-segment-label">{segment}</span>
                  ))}
                </div>
              </div>

              {card.showExtra && (
                <div className="quality-extra-content">
                  <div className="badge-row">
                    <span className="badge-icon">👑</span>
                    <span className="badge-text">You are a Top Quality Store</span>
                  </div>
                  <p className="badge-desc">
                    By Offering a positive shopping experience and earning "exceptional" ratings across key metrics, you earned the "Top Quality Store" badge that appears on your product listings. <span className="highlight-link">Add this badge to your website</span> to highlight your status and build even more trust with shoppers.
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StoreQuality;
