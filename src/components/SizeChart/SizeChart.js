import React from 'react';
import { FaRuler } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { openSizeChart, closeSizeChart } from '../../redux/Slice/sizeChartSlice';
import './SizeChart.css';

const SizeChart = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sizeChart.isOpen);

  return (
    <>
      {/* Static Size Chart Button */}
      <div className="fixed-size-chart-btn" onClick={() => dispatch(openSizeChart())}>
        <FaRuler className="size-chart-icon" />
        <span className="size-chart-text">Size chart</span>
      </div>

      {/* Size Chart Modal */}
      {isOpen && (
        <div className="size-chart-modal-overlay" onClick={() => dispatch(closeSizeChart())}>
          <div className="size-chart-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="size-chart-modal-close" onClick={() => dispatch(closeSizeChart())}>&times;</button>
            <div className="size-chart-image-container">
              <img src="/images/sidechartimage1.png" alt="maruthan Size Chart" className="size-chart-main-img" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SizeChart;
