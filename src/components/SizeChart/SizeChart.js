import React, { useState } from 'react';
import { FaRuler } from 'react-icons/fa';
import './SizeChart.css';

const SizeChart = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Static Size Chart Button */}
      <div className="fixed-size-chart-btn" onClick={() => setIsOpen(true)}>
        <FaRuler className="size-chart-icon" />
        <span className="size-chart-text">Size chart</span>
      </div>

      {/* Size Chart Modal */}
      {isOpen && (
        <div className="size-chart-modal-overlay" onClick={() => setIsOpen(false)}>
          <div className="size-chart-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="size-chart-modal-close" onClick={() => setIsOpen(false)}>&times;</button>
            <div className="size-chart-image-container">
              <img src="/images/sidechartimage1.png" alt="LittleRR Size Chart" className="size-chart-main-img" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeChart;
