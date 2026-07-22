import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './ContactUsPage.css';

const ContactPage = () => {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const formRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = () => {
    setSending(true);
    setSent(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleIframeLoad = () => {
    if (sending) {
      setSending(false);
      setSent(true);
      if (formRef.current) {
        formRef.current.reset();
      }

      // Automatically hide the message after 5 seconds
      timeoutRef.current = setTimeout(() => {
        setSent(false);
      }, 5000);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">

        <div className="contact-breadcrumb">
          <Link to="/">Home</Link> &middot; <span>Contact Us</span>
        </div>

        <h1 className="contact-main-title">Contact Us</h1>

        <p className="contact-subtitle">
          Please use the below form. You can also call service on <span className="contact-phone-number">+91-9952778217</span>
        </p>

        <div className="contact-map-container">
          <iframe
            src="https://maps.google.com/maps?q=Prince+N+Princess+Kids+Dress+Store+Singanallur&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="little RR Location"
          ></iframe>
        </div>

        <div className="contact-content-wrapper">
          {/* Left Column */}
          <div className="contact-left-column">
            <h2 className="contact-column-title">Support Customer</h2>
            <p className="contact-column-text">
              Have a question? Please contact us using the customer support channels below.
            </p>

            <div className="contact-info-block">
              <h3 className="contact-info-title">Customer Care:</h3>
              <p className="contact-info-text">
                <a href="tel:+919952778217" className="contact-link">WhatsApp / Call</a> : <span className="contact-phone-number">+91-9952778217</span>
              </p>
              <p className="contact-info-text">
                <a href="mailto:info@littlerr.in" className="contact-link">Email</a>: info@littlerr.in
              </p>
            </div>

            <div className="contact-info-block" style={{ marginTop: '30px' }}>
              <h3 className="contact-info-title">Main Office:</h3>
              <p className="contact-info-text">
                little RR<br />
                10C Vasantha Nagar, 5th Street<br />
                Behind old Jai Shanthi Theater<br />
                Singnallur, Coimbatore - 641005, Tamil Nadu<br />
                Phone: <span className="contact-phone-number">8220954602 / 9952778217</span>
              </p>
            </div>
          </div>

          {/* Right Column */}
          <div className="contact-right-column">
            <h2 className="contact-column-title">Contact Us</h2>
            <p className="contact-column-text">
              Please submit all general enquiries in the contact form below and we look forward to hearing from you soon.
            </p>

            <form 
              ref={formRef}
              className="contact-custom-form" 
              action="https://formsubmit.co/92309f9038ae61e871083c2b3339d325" 
              method="POST"
              target="mail_iframe"
              onSubmit={handleSubmit}
            >
              <input
                type="hidden"
                name="_subject"
                value="New Contact from little RR Website"
              />
              <input
                type="hidden"
                name="_template"
                value="table"
              />
              <input
                type="hidden"
                name="_captcha"
                value="false"
              />
              <input
                type="text"
                name="_honey"
                style={{ display: "none" }}
              />

              <div className="custom-form-row">
                <div className="custom-form-group">
                  <input type="text" name="name" id="name" placeholder="Your name" required />
                </div>
                <div className="custom-form-group">
                  <input type="email" name="email" id="email" placeholder="E-mail" required />
                </div>
              </div>

              <div className="custom-form-group">
                <textarea name="message" id="message" rows="8" placeholder="Enter Your Message" required></textarea>
              </div>

              <div className="custom-form-checkbox">
                <input type="checkbox" id="privacy" required />
                <label htmlFor="privacy">I agree to the <Link to="/privacy-policy" className="contact-link">Privacy Policy</Link> of the website.</label>
              </div>

              {sent && <p className="contact-success-msg">✅ Your message has been sent successfully!</p>}

              <button type="submit" className="custom-submit-btn" disabled={sending}>
                {sending ? 'Sending...' : 'Send'}
              </button>
            </form>
            <iframe
              name="mail_iframe"
              id="mail_iframe"
              style={{ display: 'none' }}
              onLoad={handleIframeLoad}
              title="Mail Submission Iframe"
            ></iframe>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;