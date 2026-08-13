import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  brand: {
    logo: '/images/logo.png',
    description: 'maruthan offers the finest and most comfortable ethnic and traditional wear for your little ones, blending timeless traditions with modern comfort.'
  },
  infoLinks: [
    { id: 'l1', label: 'Order Status', path: '/order-status' },
    { id: 'l2', label: 'Payment', path: '/payment' },
    { id: 'l3', label: 'Exchange', path: '/exchange' },
    { id: 'l4', label: 'Local & Global Shipping', path: '/shipping' },
    { id: 'l5', label: 'Cancellation & Refund', path: '/cancellation' },
  ],
  quickLinks: [
    { id: 'q1', label: 'About us', path: '/about-us' },
    { id: 'q2', label: 'Contact Us', path: '/contact-us' },
    { id: 'q3', label: 'Privacy Policy', path: '/privacy-policy' },
    { id: 'q4', label: 'Terms & Conditions', path: '/terms' },
  ],
  contact: {
    locations: [
      { id: 1, name: 'AnnaNagar, Madurai', phone: '91-9786221122' },
      { id: 2, name: 'Karaikudi, Sivagangai', phone: '91-9786221122' },
      { id: 3, name: 'KalyarKovil, Sivagangai', phone: '91-9786221122' }
    ],
    mainPhone: '+91-9786221122',
    email: 'info@maruthan.in'
  },
  socials: [
    { id: 'fb', name: 'facebook', url: 'https://www.facebook.com', icon: 'f' },
    { id: 'ig', name: 'instagram', url: 'https://www.instagram.com', icon: 'instagram' },
    { id: 'yt', name: 'youtube', url: 'https://www.youtube.com', icon: 'youtube' },
    { id: 'in', name: 'linkedin', url: 'https://www.linkedin.com', icon: 'in' },
    { id: 'wa', name: 'whatsapp', url: 'https://wa.me/919786221122', icon: 'whatsapp' }
  ],
  copyright: '© 2026 maruthan. All rights reserved'
};

const footerSlice = createSlice({
  name: 'footer',
  initialState,
  reducers: {
    setFooterData: (state, action) => {
      return { ...state, ...action.payload };
    }
  }
});

export const { setFooterData } = footerSlice.actions;
export default footerSlice.reducer;
