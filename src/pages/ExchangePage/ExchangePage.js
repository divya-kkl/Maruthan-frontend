import React, { useEffect } from 'react';
import './ExchangePage.css';

const ExchangePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="exchange-page">
      <div className="exchange-container">
        <h1 className="exchange-main-title">Exchange Policy</h1>
        
        <p className="exchange-text">
          We offer easy exchanges for both domestic and international orders. Please review the terms below to ensure a smooth process.
        </p>

        <hr className="exchange-divider" />
        
        <h2 className="exchange-subtitle">Eligibility</h2>
        <ul className="exchange-list">
          <li>Exchange requests must be initiated within 7 days of receiving your order.</li>
          <li>The item must reach our warehouse within 15 days from the date of delivery.</li>
          <li>Products must be unused, unwashed, and returned in original condition and packaging.</li>
          <li>Customers are responsible for shipping the item back to our return address.</li>
        </ul>

        <hr className="exchange-divider" />
        
        <h2 className="exchange-subtitle">Exchange Shipping Charges</h2>
        <p className="exchange-text">
          If ₹50 shipping was paid at checkout:
        </p>
        <ul className="exchange-list">
          <li>Return shipping (customer to us): Paid by customer</li>
          <li>Exchange shipping (we send back): Free</li>
        </ul>
        <p className="exchange-text">
          If your order had free shipping:
        </p>
        <ul className="exchange-list">
          <li>Return shipping (customer to us): Paid by customer</li>
          <li>Exchange shipping (we send back): ₹50 will be charged</li>
        </ul>

        <hr className="exchange-divider" />
        
        <h2 className="exchange-subtitle">Additional Notes</h2>
        <ul className="exchange-list">
          <li>Exchanges are processed only after we receive and inspect the returned item.</li>
          <li>Items that do not meet the above conditions will not be eligible for exchange.</li>
          <li>For any support, please contact our customer service team.</li>
        </ul>

        <hr className="exchange-divider" />

        <h2 className="exchange-subtitle">Return Address</h2>
        <p className="exchange-text">
          Prince N Princess<br />
          10C, 5th Street, Vasantha Nagar,<br />
          Near Shanthi Gears, Singanallur,<br />
          Coimbatore - 641005.
        </p>
      </div>
    </div>
  );
};

export default ExchangePage;
