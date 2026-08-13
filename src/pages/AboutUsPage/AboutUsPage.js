import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AboutUsPage.css';

const AboutUsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-breadcrumb">
          <Link to="/">Home</Link> &middot; <span>About maruthan</span>
        </div>

        <h2 className="about-subtitle">About maruthan - Premium Kids Ethnic Wear Manufacturer in India</h2>
        <p className="about-text">
          maruthan is a leading kids ethnic wear manufacturer in India, specializing in premium traditional outfits for newborns, toddlers, and young children. We design and manufacture high-quality Indian ethnic wear that blends cultural heritage with modern comfort and finishing standards. With a strong background in garment manufacturing, our brand focuses exclusively on creating baby silk frocks, traditional cotton dresses, ethnic gowns, and festive wear for kids. Every outfit is crafted in-house by skilled artisans using carefully selected fabrics that are soft, breathable, and suitable for delicate children’s skin.
        </p>
        <p className="about-text">
          As direct manufacturers, we maintain strict quality control at every stage from fabric sourcing and pattern cutting to stitching, detailing, and final inspection. Our production process ensures consistent sizing, premium finishing, durability, and elegant design in every garment. Our collections are ideal for naming ceremonies, first birthdays, temple visits, wedding functions, and festive occasions such as Diwali, Navratri, and Pongal. We are committed to offering comfortable, skin-friendly, and beautifully designed traditional outfits that allow children to move freely while looking graceful.
        </p>
        <p className="about-text">
          At maruthan, our vision is to become a trusted and recognized brand in the Indian kids ethnic wear industry by delivering authentic designs, premium manufacturing quality, and customer-focused service. We believe every child deserves to celebrate special moments in comfort, confidence, and traditional elegance.
        </p>

        <hr className="about-divider" />

        <h2 className="about-subtitle">Why maruthan Pattu Dress?</h2>
        <p className="about-text">
          A Pattu Pavadai is more than a dress - it is tradition and celebration woven into silk. At maruthan, we craft each pavadai using premium raw silk and authentic Banarasi silk sourced directly from trusted weaving units. No synthetic substitutes. No compromise on quality. Every piece features pure silk fabric, rich zari borders, elegant colors, and a soft inner lining for complete comfort.
        </p>
        <p className="about-text">
          The result? A royal yet baby-friendly Pattu Pavadai made for your little princess to shine on every special occasion.
        </p>

        <div className="about-baby-friendly-section">
          <div className="about-heart-icon-container">
            <svg className="about-heart-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>

          <h2 className="about-subtitle center-text">Why Baby-Friendly Clothes Matter?</h2>

          <p className="about-text center-text">
            A child's skin is soft, delicate, and pure - just like their heart. What they wear should protect that innocence, not irritate it.
          </p>

          <p className="about-text center-text">
            At <span className="about-highlight">maruthan</span>, we believe baby clothing is not just about style - it is about <span className="about-highlight">comfort, safety, and love</span>. That is why we use carefully selected fabrics sourced directly from authentic manufacturers of <span className="about-highlight">Banarasi silk</span> and <span className="about-highlight">100% pure Made for Every Part of Your Life (MADE FOR EVERY PART OF YOUR LIFE</span>.
          </p>

          <p className="about-text center-text">
            We avoid harsh materials and unnecessary chemicals. Every thread that touches your child's skin is chosen with care. Our stitching is soft, breathable, and comfortable - so your little one can smile, play, and celebrate without discomfort.
          </p>

          <p className="about-text center-text italic-text">
            Because when children feel comfortable, they shine naturally.
          </p>
        </div>

        <div className="about-features-container">
          <div className="about-feature-card">
            <div className="about-feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="about-feature-icon">
                <circle cx="12" cy="12" r="11" fill="#1a365d" />
                <path d="M9.5 15.5L5 11l-1.5 1.5L9.5 18.5 20.5 7.5 19 6L9.5 15.5z" fill="#fff" />
              </svg>
            </div>
            <h3 className="about-feature-title">Authentic Fabrics</h3>
            <p className="about-feature-text">Banarasi silk & 100% Made for Every Part of Your Life (MADE FOR EVERY PART OF YOUR LIFE</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="about-feature-icon">
                <rect x="4" y="3" width="16" height="18" rx="2" ry="2" fill="#1a365d" />
                <rect x="7" y="7" width="10" height="2.5" fill="#fff" />
                <rect x="7" y="11.5" width="10" height="2.5" fill="#fff" />
                <rect x="7" y="16" width="7" height="2.5" fill="#fff" />
              </svg>
            </div>
            <h3 className="about-feature-title">Chemical-Free</h3>
            <p className="about-feature-text">No harsh materials or unnecessary chemicals</p>
          </div>

          <div className="about-feature-card">
            <div className="about-feature-icon-wrapper">
              <svg viewBox="0 0 24 24" className="about-feature-icon">
                <circle cx="12" cy="12" r="11" fill="#7b1fa2" />
                <path d="M11 6h2v3h-2zm0 4.5h2v7.5h-2z" fill="#fff" />
              </svg>
            </div>
            <h3 className="about-feature-title">Soft & Breathable</h3>
            <p className="about-feature-text">Gentle stitching for maximum comfort</p>
          </div>
        </div>

        <div className="about-journey-section">
          <h2 className="about-subtitle center-text" style={{ marginBottom: '10px' }}>A Decade of Our Journey</h2>
          <p className="about-text center-text" style={{ color: '#666', marginTop: 0 }}>
            From humble beginnings to trusted traditional kids manufacturing.
          </p>

          <div className="about-timeline-container">
            <div className="about-timeline-item">
              <div className="about-timeline-year">2015</div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-content">
                <h3 className="about-timeline-title">Humble Beginning</h3>
                <p className="about-timeline-text">Started as a small stitching unit with dedication to traditional kids wear.</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-year">2017</div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-content">
                <h3 className="about-timeline-title">Growing with Trust</h3>
                <p className="about-timeline-text">Expanded our team and earned the trust of many families.</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-year">2019</div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-content">
                <h3 className="about-timeline-title">Expanding Collections</h3>
                <p className="about-timeline-text">Introduced Pattu Pavadai and Made for Every Part of Your Life (MADE FOR EVERY PART OF YOUR LIFE collections.</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-year">2021</div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-content">
                <h3 className="about-timeline-title">Strengthening Manufacturing</h3>
                <p className="about-timeline-text">Upgraded stitching and improved quality processes.</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-year">2023</div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-content">
                <h3 className="about-timeline-title">Recognized Traditional Brand</h3>
                <p className="about-timeline-text">Became a trusted kids ethnic wear manufacturer.</p>
              </div>
            </div>

            <div className="about-timeline-item">
              <div className="about-timeline-year">2025</div>
              <div className="about-timeline-dot"></div>
              <div className="about-timeline-content">
                <h3 className="about-timeline-title">Continuing the Legacy</h3>
                <p className="about-timeline-text">Celebrating 10+ years of craftsmanship and growth.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-promise-section">
          <h3 className="about-promise-title">OUR PROMISE</h3>
          <p className="about-text center-text">
            From authentic fabric sourcing to careful stitching, from temple-inspired designs to soft inner comfort - every piece is crafted with love, tradition, and responsibility. Because we are not just manufacturers.
          </p>
          <p className="about-text center-text" style={{ marginTop: '20px' }}>
            We are creators of childhood memories.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;
