import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = ({ onNavigate }) => {
  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-brand">
          <img src="/images/log1.png" alt="Little RR" className="footer-logo" style={{ maxWidth: '110px', marginTop: '-20px', marginBottom: '10px' }} />
          <p className="footer-description" style={{ fontSize: '14px', lineHeight: '1.5', color: '#fff', margin: 0 }}>
            Little RR (Prince 'N' Princess) offers the finest and most comfortable ethnic and traditional wear for your little ones, blending timeless traditions with modern comfort.
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h3 className="footer-heading">Info</h3>
          <ul className="footer-links">
            <li><Link to="/order-status">Order Status</Link></li>
            <li><Link to="/payment">Payment</Link></li>
            <li><Link to="/exchange">Exchange</Link></li>
            <li><Link to="/shipping">Local & Global Shipping</Link></li>
            <li><Link to="/cancellation">Cancellation & Refund</Link></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h3 className="footer-heading">Quick links</h3>
          <ul className="footer-links">
            <li><Link to="/about-us">About us</Link></li>
            <li><Link to="/contact-us">Contact Us</Link></li>
            <li><Link to="/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-contact">
          <h3 className="footer-heading">Contact us</h3>
          <p>1. Velachery, Chennai: <span className="italic-phone">91-9003466189</span></p>
          <p>2. RS Puram, Coimbatore: <span className="italic-phone">91-9789388217</span></p>
          <p>3. Singanallur, Coimbatore: <span className="italic-phone">91-9786221122</span></p>
          <br />
          <p>+91-9786221122</p>
          <p>info@princenprincess.in</p>

          <div className="footer-socials">
            <a href="/facebook" className="social-icon">f</a>
            <a href="/instagram" className="social-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="/youtube" className="social-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
            </a>
            <a href="/pinterest" className="social-icon">p</a>
            <a href="/linkedin" className="social-icon">in</a>
            <a href="/whatsapp" className="social-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; 2025 shop. All rights reserved</p>
      </div>
    </footer>
  );
};

export default Footer;