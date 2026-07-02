import React, { useEffect } from 'react';
import './OrderStatusPage.css';

const OrderStatusPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="order-status-page">
      <div className="order-status-container">
        <h1 className="order-status-main-title">Order Status & Delivery Process</h1>

        <h2 className="order-status-subtitle">Order Status</h2>
        <p className="order-status-text">
          At little RR, we follow a structured and transparent order process to ensure a smooth shopping experience for parents. Below is a clear overview of each stage your order goes through after placement.
        </p>

        <h2 className="order-status-subtitle">Order Confirmed</h2>
        <p className="order-status-text">
          Once your order is successfully placed, it is reviewed and confirmed by our team. This process typically takes half a day to one working day.
        </p>

        <h2 className="order-status-subtitle">Packed</h2>
        <p className="order-status-text">
          After confirmation, your order is carefully packed with attention to quality and safety. Once packed, the parcel is handed over to our courier partner for pickup.
        </p>

        <h2 className="order-status-subtitle">Dispatched</h2>
        <p className="order-status-text">
          When your order is dispatched, the tracking number along with a tracking link will be shared. You can track the shipment using the provided details.
        </p>
        <p className="order-status-text">
          While most orders are delivered within the expected delivery timeframe, occasional delays may occur due to unforeseen courier or logistical factors beyond our control. We recommend planning purchases in advance, especially for time-sensitive occasions.
        </p>

        <h2 className="order-status-subtitle">Delivered</h2>
        <p className="order-status-text">
          This status confirms that your order has been successfully delivered to the shipping address provided during checkout.
        </p>

        <h2 className="order-status-subtitle">Cancelled & Refund Initiated</h2>
        <p className="order-status-text">
          In rare cases where dispatch is not possible due to product damage, unavailability, or operational issues, the order will be cancelled. If cancelled, the refund for the paid amount will be initiated as per our refund policy.
        </p>
      </div>
    </div>
  );
};

export default OrderStatusPage;
