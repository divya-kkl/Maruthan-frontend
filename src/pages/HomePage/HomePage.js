import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../../redux/Slice/productShowcasesSlice';
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
import DynamicShowcase from '../../components/DynamicShowcase/DynamicShowcase';

const HomePage = () => {
  const dispatch = useDispatch();
  const { product } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Find all unique tags from products to dynamically generate sections
  const allTagsMap = new Map();
  if (product && product.length > 0) {
    product.forEach(p => {
      if (p.tags && p.tags.length > 0) {
        p.tags.forEach(t => {
          allTagsMap.set(t.name, t);
        });
      }
    });
  }

  const allUniqueTags = Array.from(allTagsMap.values());

  // Filter out tags that are already handled by static sections
  const staticSectionKeywords = [
    'traditional', 'gown', 'pattu', 'pavadai', 'newborn', 
    'chettinad', 'jabla', 'frock', 'boy', 'cotton'
  ];

  const dynamicTags = allUniqueTags.filter(tag => {
    const lowerName = tag.name.toLowerCase();
    const isStatic = staticSectionKeywords.some(keyword => lowerName.includes(keyword));
    return !isStatic;
  }).reverse();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      <div>
        <Hero />
        {dynamicTags.map(tag => (
          <DynamicShowcase 
            key={tag.id} 
            tagCode={tag.code} 
            tagName={tag.name} 
          />
        ))}

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
