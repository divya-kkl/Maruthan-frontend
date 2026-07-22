import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './Footer.css';

const Footer = ({ onNavigate }) => {
  const { brand, infoLinks, quickLinks, contact, socials, copyright } = useSelector((state) => state.footer);

  const renderSocialIcon = (iconName) => {
    switch(iconName) {
      case 'instagram':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
      case 'youtube':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
      case 'whatsapp':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" /></svg>;
      default:
        return iconName; // 'f', 'in', etc.
    }
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">

        {/* Column 1 */}
        <div className="footer-brand">
          <Link to="/">
            <img src={brand.logo} alt="Little RR" className="footer-logo" style={{ maxWidth: '110px', marginTop: '-20px', marginBottom: '10px' }} />
          </Link>
          <p className="footer-description" style={{ fontSize: '14px', lineHeight: '1.5', color: '#fff', margin: 0 }}>
            {brand.description}
          </p>
        </div>

        {/* Column 2 */}
        <div className="footer-column">
          <h3 className="footer-heading">Info</h3>
          <ul className="footer-links">
            {infoLinks.map((link) => (
              <li key={link.id}><Link to={link.path}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 3 */}
        <div className="footer-column">
          <h3 className="footer-heading">Quick links</h3>
          <ul className="footer-links">
            {quickLinks.map((link) => (
              <li key={link.id}><Link to={link.path}>{link.label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Column 4 */}
        <div className="footer-contact">
          <h3 className="footer-heading">Contact us</h3>
          {contact.locations.map((loc) => (
            <p key={loc.id}>{loc.id}. {loc.name}: <span className="italic-phone">{loc.phone}</span></p>
          ))}
          <br />
          <p>{contact.mainPhone}</p>
          <p>{contact.email}</p>

          <div className="footer-socials">
            {socials.map((social) => (
              <a key={social.id} href={social.url} className="social-icon" target="_blank" rel="noopener noreferrer">
                {renderSocialIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>{copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;