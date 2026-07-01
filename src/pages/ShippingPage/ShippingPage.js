import React, { useEffect } from 'react';
import './ShippingPage.css';

const ShippingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="shipping-page">
      <div className="shipping-container">
        <h1 className="shipping-main-title">Domestic & International Shipping</h1>

        <h2 className="shipping-subtitle">Domestic Shipping (Within India)</h2>
        <p className="shipping-text">
          We ship across India from our facility in Coimbatore, Tamil Nadu.
        </p>
        <ul className="shipping-list">
          <li>Delivery timelines may vary depending on the destination.</li>
          <li>Faster delivery can be expected within Tamil Nadu and to Bengaluru, compared to other regions.</li>
          <li>For urgent delivery requests, please contact us before placing your order at +91-9952778217.</li>
        </ul>
        <p className="shipping-text shipping-italic">
          Please note: Any delivery delays caused by the courier partner due to unavoidable circumstances are beyond our control.
        </p>

        <hr className="shipping-divider" />
        
        <h2 className="shipping-subtitle">International Shipping</h2>
        <p className="shipping-text">
          We ship worldwide using trusted courier services like DHL, DTDC, or others, based on your selection at checkout.
        </p>
        <ul className="shipping-list">
          <li>Orders are dispatched within 2–4 working days from the date of purchase.</li>
          <li>Delivery time will vary depending on the destination and courier partner.</li>
          <li>Customs Delays: There may be unforeseen delays due to customs clearance in India or the destination country. These are not within our or the courier's control.</li>
        </ul>

        <hr className="shipping-divider" />
        
        <h2 className="shipping-subtitle">Please Note:</h2>
        <ul className="shipping-list">
          <li>We do not collect customs duties or taxes. Any such charges levied at the time of delivery must be borne by the customer.</li>
        </ul>
        <p className="shipping-text">
          If you need assistance regarding international shipping or customs, feel free to contact us at +91-9952778217.
        </p>
      </div>
    </div>
  );
};

export default ShippingPage;
