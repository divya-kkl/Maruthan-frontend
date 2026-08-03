import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanner } from '../../redux/Slice/bannerSlice';
import './LovedByCustomers.css';

const LovedByCustomers = () => {
  const dispatch = useDispatch();
  const { banner, status } = useSelector((state) => state.banner);
  const loading = status === 'loading';

  useEffect(() => {
    dispatch(fetchBanner());
  }, [dispatch]);

  // Extract FOURTH type banners (assuming these are for this section)
  const lovedByCustomersBanners = banner?.filter((b) => b.bannerType === 'FOURTH') || [];

  return (
    <section className="loved-by-customers-section">
      <div className="loved-by-customers-images">
        {loading ? (
          <>
            <div className="factory-img-wrapper shimmer-card">
              <div className="shimmer-image" style={{ height: '300px' }}></div>
            </div>
            <div className="factory-img-wrapper shimmer-card">
              <div className="shimmer-image" style={{ height: '300px' }}></div>
            </div>
          </>
        ) : lovedByCustomersBanners.length > 0 ? (
          lovedByCustomersBanners.map((bannerItem, index) => (
            <div className="factory-img-wrapper" key={bannerItem.id || index}>
              <img
                src={bannerItem.backgroundImage}
                alt={`Loved by Customers ${index + 1}`}
                className="factory-img"
                onError={(e) => { e.target.src = `/images/im${index + 1}.jpg`; }}
              />
            </div>
          ))
        ) : (
          // Fallback to static images if no dynamic banners found
          <>
            <div className="factory-img-wrapper">
              <img src="/images/im1.jpg" alt="Factory View 1" className="factory-img" />
            </div>
            <div className="factory-img-wrapper">
              <img src="/images/img2.jpg" alt="Factory View 2" className="factory-img" />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default LovedByCustomers;
