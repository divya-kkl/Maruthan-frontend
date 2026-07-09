import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTopBanners } from '../../redux/Slice/topBannerSlice';
import './TopBanner.css';
import { FaLessThan, FaGreaterThan } from "react-icons/fa";

const TopBanner = () => {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.topBanner);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchTopBanners());
  }, [dispatch]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => messages.length > 0 ? (prevIndex + 1) % messages.length : 0);
  }, [messages.length]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => messages.length > 0 ? (prevIndex - 1 + messages.length) % messages.length : 0);
  };

  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => clearInterval(timer);
  }, [messages.length, nextSlide]); // depend on messages.length to reset interval if messages load

  if (loading || messages.length === 0) {
    return (
      <div className="top-banner">
        <div className="top-banner-content">
          <div className="banner-text-container">
            <div className="shimmer-text" style={{ width: '250px', height: '18px', backgroundColor: 'rgba(255,255,255,0.3)', margin: '0 auto', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="top-banner">
      <div className="top-banner-content">
        {messages.length > 1 && (
          <button className="banner-nav-btn" onClick={prevSlide}><FaLessThan /></button>
        )}

        <div className="banner-text-container">
          <span className="banner-text" key={currentIndex}>{messages[currentIndex]}</span>
        </div>

        {messages.length > 1 && (
          <button className="banner-nav-btn" onClick={nextSlide}><FaGreaterThan /></button>
        )}
      </div>
    </div>
  );
};

export default TopBanner;