import React, { useState, useEffect } from 'react';
import './ClearanceBanner.css';
import { FaArrowRight } from 'react-icons/fa';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_ACTIVE_BANNERS = gql`
  query GetActiveBanners($bannerType: String) {
    getActiveBanners(bannerType: $bannerType) {
      id
      backgroundImage
      bannerType
      isActive
    }
  }
`;

const ClearanceBanner = () => {
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_ACTIVE_BANNERS, { bannerType: "THIRD" });
        if (data.getActiveBanners && data.getActiveBanners.length > 0) {
          setBannerData(data.getActiveBanners[0]);
        }
      } catch (err) {
        console.error('Error fetching Third banner:', err);
      }
    };
    fetchBanner();
  }, []);

  if (bannerData && bannerData.backgroundImage) {
    return (
      <div className="clearance-banner-container">
        <img
          src={bannerData.backgroundImage}
          alt="Special Clearance Offer"
          className="clearance-banner-dynamic-img"
        />
      </div>
    );
  }

  return (
    <div className="clearance-banner-container">
      <div className="clearance-banner">
        <div className="circle circle-top-right"></div>
        <div className="circle circle-bottom-left"></div>
        <div className="circle circle-middle"></div>
        
        <div className="clearance-content">
          <div className="clearance-badge">LIMITED TIME</div>
          <h2 className="clearance-title">Special Clearance Offer</h2>
          <h1 className="clearance-discount">Up to 50% OFF</h1>
          <p className="clearance-desc">Discover amazing deals on our premium ethnic wear collection.</p>
          <button className="clearance-shop-btn">
            Shop Clearance Sale <FaArrowRight className="arrow-icon" />
          </button>
        </div>
        <div className="clearance-image-wrapper">
          <img src="/images/bag-outline.png" alt="Clearance Bag" className="clearance-image" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/placeholder.png";
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ClearanceBanner;
