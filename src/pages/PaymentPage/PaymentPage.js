import React, { useEffect } from 'react';
import './PaymentPage.css';

const PaymentPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="payment-page">
      <div className="payment-container">
        <h1 className="payment-main-title">Payment</h1>

        <p className="payment-text">
          At little RR, we offer multiple secure and convenient payment options to make your shopping experience smooth and reliable whether you’re ordering within India or internationally.
        </p>

        <hr className="payment-divider" />

        <h2 className="payment-subtitle">Online Payment Options</h2>
        <p className="payment-text">
          We support all major Indian digital payment methods through trusted payment gateways:
        </p>
        <ul className="payment-list">
          <li>Credit/Debit Cards (Visa, Mastercard, RuPay, etc.)</li>
          <li>Net Banking</li>
          <li>UPI apps including Google Pay, PhonePe, Paytm, and more</li>
        </ul>
        <p className="payment-text">
          Select PayU or Razorpay at checkout for a secure transaction experience.
        </p>

        <hr className="payment-divider" />

        <h2 className="payment-subtitle">International Payments</h2>
        <p className="payment-text">
          We welcome international customers with flexible payment options:
        </p>
        <ul className="payment-list">
          <li>Choose Razorpay at checkout</li>
          <li>Select the “Wallet” or “PayPal” option in the Razorpay widget</li>
          <li>Pay in your local currency using supported global wallets</li>
        </ul>
        <p className="payment-text payment-italic">
          Note: PayPal is only available through the Razorpay gateway.
        </p>

        <hr className="payment-divider" />

        <h2 className="payment-subtitle">UPI / Bank Transfer</h2>
        <p className="payment-text">
          If you prefer to pay via direct UPI or bank transfer, please note:
        </p>
        <ul className="payment-list">
          <li>These payments are eligible for exchange only</li>
          <li>Refunds are not applicable for orders paid through this method</li>
        </ul>
        <p className="payment-text">
          Please ensure you review sizing or reach out to our team before placing your order via manual transfer.
        </p>

        <hr className="payment-divider" />

        <h2 className="payment-subtitle">Cash on Delivery (COD)</h2>
        <p className="payment-text">
          We offer Cash on Delivery service across India for your convenience:
        </p>
        <ul className="payment-list">
          <li>COD Fee: ₹40 per order</li>
          <li>COD is available on select serviceable pin codes</li>
          <li>Please ensure availability and accurate address details during checkout</li>
        </ul>

        <hr className="payment-divider" />

        <p className="payment-text">
          If you need help choosing the right payment method or have special payment concerns, our team is here to assist.
        </p>
        <p className="payment-text">
          📩 Email: info@littlerr.in<br />
          📞 WhatsApp: +91-99527 78217
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;
