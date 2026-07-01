import React, { useEffect } from 'react';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="privacy-page">
      <div className="privacy-container">
        <h1 className="privacy-main-title">Privacy Policy</h1>
        
        <p className="privacy-intro-text">
          Please read this Privacy Policy carefully before using the website <a href="https://www.princenprincess.in" target="_blank" rel="noopener noreferrer">www.princenprincess.in</a> or submitting any personal information. By accessing or using the site, you agree to the terms and practices described below.
        </p>
        
        <p className="privacy-text">
          We encourage you to review this policy regularly to stay informed about how we collect, use, and safeguard your personal information. Prince N Princess reserves the right to modify this policy at any time without prior notice. Updates will be posted on this page and become effective immediately upon publication.
        </p>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">Information We Collect</h2>
        <p className="privacy-text">We may collect the following personal information:</p>
        <ul className="privacy-list">
          <li>Full Name</li>
          <li>Contact details including email address and phone number</li>
          <li>Demographic details such as postcode, preferences, and interests</li>
          <li>Other relevant information provided through surveys, forms, or promotional activities</li>
        </ul>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">Data Security & Payment Protection</h2>
        <p className="privacy-text">
          We are committed to ensuring that your personal information is secure. If you provide payment information (such as credit card details), it is encrypted using Secure Socket Layer (SSL) technology. We implement best practices including digital certificates, secure transaction protocols, and authentication measures to protect your data during transmission.
        </p>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">How We Use Your Information</h2>
        <p className="privacy-text">
          We collect your information to better understand your needs and provide you with a personalized experience. Specifically, we may use your information for:
        </p>
        <ul className="privacy-list">
          <li>Internal record keeping</li>
          <li>Improving our products and services</li>
          <li>Sending promotional emails about new collections, offers, or events (with your consent)</li>
          <li>Conducting customer research through email, phone, or postal communication</li>
          <li>Customizing the website based on your preferences and browsing behavior</li>
        </ul>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">Use of Cookies</h2>
        <p className="privacy-text">
          Our website uses cookies to enhance your shopping experience and save time. Cookies are small data files stored on your device to recognize you on future visits and to tailor the website content accordingly.
        </p>
        <p className="privacy-text">
          They help us analyze web traffic, track user preferences, and offer a more convenient and personalized user experience. You may choose to disable cookies through your browser settings; however, this may affect the functionality of certain features on our site.
        </p>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">Third-Party Services</h2>
        <p className="privacy-text">
          Some third-party providers (such as payment gateways and logistics partners) may require access to your personal data to perform services on our behalf. These providers are only permitted to use your information to the extent necessary to complete the relevant service.
        </p>
        <p className="privacy-text">Please note:</p>
        <ul className="privacy-list">
          <li>These third parties have their own privacy policies, and we recommend reviewing them to understand how your data will be handled.</li>
          <li>Depending on their location, your data may be subject to different privacy laws based on the provider’s jurisdiction.</li>
          <li>Once you leave our website or are redirected to a third-party site or application, this Privacy Policy no longer applies.</li>
        </ul>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">Changes to This Policy</h2>
        <p className="privacy-text">
          We reserve the right to update this Privacy Policy at any time. Changes will take effect immediately upon posting. If we make material updates, we will highlight the revision date and notify users where appropriate, so you remain informed about how your data is handled.
        </p>

        <hr className="privacy-divider" />

        <h2 className="privacy-subtitle">Contact Us</h2>
        <p className="privacy-text">
          If you have any questions or concerns regarding this Privacy Policy or how your personal data is managed, please contact us at:
        </p>
        <p className="privacy-contact-info">
          📧 Email: <a href="mailto:info@princenprincess.in">info@princenprincess.in</a>
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
