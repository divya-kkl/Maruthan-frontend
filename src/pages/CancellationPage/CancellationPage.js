import React, { useEffect } from 'react';
import './CancellationPage.css';

const CancellationPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="cancellation-page">
      <div className="cancellation-container">
        <h1 className="cancellation-main-title">Cancellation, Refund & Exchange</h1>
        <h2 className="cancellation-subtitle">Cancellation, Returns & Refund Policy</h2>

        <p className="cancellation-text">
          At little RR, we strive to provide a smooth and satisfying shopping experience. Please review our policies below to understand how cancellations, exchanges, and refunds are handled.
        </p>

        <hr className="cancellation-divider" />

        <h2 className="cancellation-subtitle">🔄 Exchange Policy</h2>
        <ul className="cancellation-list">
          <li>Products are eligible for exchange after the customer receives the item.</li>
          <li>Customers are required to ship the product back to our warehouse at their own expense.</li>
          <li>Once we receive the item, the exchanged product will be shipped free of cost.</li>
        </ul>

        <hr className="cancellation-divider" />

        <h2 className="cancellation-subtitle">❌ Order Cancellation</h2>
        <ul className="cancellation-list">
          <li>Orders can be cancelled only before they are shipped.</li>
          <li>To request a cancellation, please email us at info@littlerr.in and WhatsApp us at +91-9786221122.</li>
          <li>If the order is eligible for cancellation, the refund will be processed within 4–7 working days to the same account used for payment.</li>
        </ul>
        <p className="cancellation-text cancellation-italic">
          Please note: Bank processing times may cause additional delays beyond our control.
        </p>

        <hr className="cancellation-divider" />

        <h2 className="cancellation-subtitle">💸 Refund Policy</h2>
        <p className="cancellation-text">
          Refunds will be issued under the following circumstances:
        </p>
        <ul className="cancellation-list">
          <li>If the product is damaged upon arrival</li>
          <li>If the package is lost in transit</li>
          <li>If the order was not dispatched due to unavailability of the product</li>
        </ul>
        <p className="cancellation-text">
          In all such cases, the full amount will be refunded to the original payment method within 4–7 working days after confirmation.
        </p>

        <hr className="cancellation-divider" />

        <p className="cancellation-text">
          For any questions or support, feel free to reach out:<br />
          📧 info@littlerr.in<br />
          📱 WhatsApp: +91-9786221122
        </p>
      </div>
    </div>
  );
};

export default CancellationPage;
