import React from 'react';
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
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div>
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
