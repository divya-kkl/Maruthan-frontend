import React, { useState, useEffect } from 'react';
import Hero from '../../components/Hero/Hero';
import ProductShowcase from '../../components/ProductShowcase/ProductShowcase';
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel';
import NewbornShowcase from '../../components/NewbornShowcase/NewbornShowcase';
import PromoCarousel from '../../components/PromoCarousel/PromoCarousel';
import ChettinadShowcase from '../../components/ChettinadShowcase/ChettinadShowcase';
import JablaShowcase from '../../components/JablaShowcase/JablaShowcase';
import ClearanceBanner from '../../components/ClearanceBanner/ClearanceBanner';
import BoysShowcase from '../../components/BoysShowcase/BoysShowcase';
import CottonFrockShowcase from '../../components/CottonFrockShowcase/CottonFrockShowcase';
import LovedByCustomers from '../../components/LovedByCustomers/LovedByCustomers';
import CustomerFavorites from '../../components/CustomerFavorites/CustomerFavorites';
import OurStores from '../../components/OurStores/OurStores';

const HomePage = () => {
  const [globalLoading, setGlobalLoading] = useState(true);

  useEffect(() => {
    // Hide global overlay after 1.5s to let children fetch data in the background
    const timer = setTimeout(() => {
      setGlobalLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      {globalLoading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: '#fff',
          zIndex: 9999,
          overflow: 'hidden'
        }}>
          {/* Header Skeleton */}
          <div className="shimmer-card" style={{ width: '100%', height: '80px', marginBottom: '0' }}></div>
          
          {/* Hero Skeleton */}
          <div className="shimmer-card" style={{ width: '100%', height: '60vh', marginBottom: '40px' }}></div>
          
          {/* Showcase Skeleton */}
          <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}>
              <div className="shimmer-text title" style={{ width: '300px', height: '32px', marginBottom: '10px' }}></div>
              <div className="shimmer-text" style={{ width: '400px', height: '20px' }}></div>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className="shimmer-card" style={{ flex: 1, height: '350px', borderRadius: '8px' }}>
                  <div className="shimmer-image" style={{ height: '60%', marginBottom: '15px' }}></div>
                  <div style={{ padding: '0 15px' }}>
                    <div className="shimmer-text title"></div>
                    <div className="shimmer-text price"></div>
                    <div className="shimmer-button" style={{ marginTop: '20px' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* The actual page content, hidden while globalLoading is true but still mounted so data fetches! */}
      <div style={{ opacity: globalLoading ? 0 : 1, transition: 'opacity 0.4s ease-in-out' }}>
        <Hero />
        <ProductShowcase />
        <ProductCarousel />
        <NewbornShowcase />
        <PromoCarousel />
        <ChettinadShowcase />
        <JablaShowcase />
        <BoysShowcase />
        <ClearanceBanner />
        <CottonFrockShowcase />
        <LovedByCustomers />
        <CustomerFavorites />
        <OurStores />
      </div>
    </div>
  );
};

export default HomePage;
