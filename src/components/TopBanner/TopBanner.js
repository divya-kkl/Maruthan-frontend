import React, { useState, useEffect, useCallback } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import './TopBanner.css';
import { FaLessThan, FaGreaterThan } from "react-icons/fa";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_ACTIVE_TOP_BANNERS = gql`
  query GetActiveTopBanners {
    getActiveTopBanners {
      id
      message
    }
  }
`;

const TopBanner = () => {
  const [messages, setMessages] = useState([
    
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_ACTIVE_TOP_BANNERS);
        if (data.getActiveTopBanners && data.getActiveTopBanners.length > 0) {
          setMessages(data.getActiveTopBanners.map(banner => banner.message));
        }
      } catch (err) {
        console.error('Error fetching Top Banners:', err);
      }
    };
    fetchBanners();
  }, []);

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

  if (messages.length === 0) return null;

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