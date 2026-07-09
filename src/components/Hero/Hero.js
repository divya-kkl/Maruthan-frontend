import React, { useEffect } from 'react';
import './Hero.css';
import { useSelector, useDispatch } from 'react-redux';
import { fetchBanner } from '../../redux/Slice/bannerSlice';


const Hero = () => {

  const dispatch = useDispatch();
  const { banner } = useSelector (( state ) => state.banner);
  

  useEffect(() => {
   dispatch(fetchBanner());
  }, [dispatch]);

  const bannerData = banner?.find((b) => b.bannerType === 'FIRST');
  const backgroundImage = bannerData?.backgroundImage;

  return (
    <section className="hero-section">
      <div className="hero-container">
    
        <img
          src={backgroundImage}
          alt="Hero Banner"
          className="hero-image"
          onError={(e) => {
            e.target.onerror = null;
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
