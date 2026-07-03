import React, { useState, useEffect } from 'react';
import { GraphQLClient, gql } from 'graphql-request';
import './Hero.css';

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

const Hero = () => {
  const [bannerData, setBannerData] = useState(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(GET_ACTIVE_BANNERS, { bannerType: "FIRST" });
        if (data.getActiveBanners && data.getActiveBanners.length > 0) {
          setBannerData(data.getActiveBanners[0]);
        }
      } catch (err) {
        console.error('Error fetching Hero banner:', err);
      }
    };
    fetchBanner();
  }, []);

  const backgroundImage = bannerData?.backgroundImage ;

  return (
    <section className="hero-section">
      <div className="hero-container">
    
        <img
          src={backgroundImage}
          alt="Hero Banner"
          className="hero-image"
          onError={(e) => {
            e.target.onerror = null;
            // e.target.src = "/images/hero_banner.png";
          }}
        />
      </div>
    </section>
  );
};

export default Hero;
