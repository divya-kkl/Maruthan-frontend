import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  features: [
    {
      id: 'shipping',
      iconType: 'box',
      title: 'Free Shipping',
      desc: 'Enjoy free delivery across India on prepaid orders above ₹ 2000.',
      linkText: null
    },
    {
      id: 'exchange',
      iconType: 'check',
      title: 'Exchange',
      desc: 'Exchange within 7 days, please make sure the items are in undamaged condition. ',
      linkText: 'Read Exchange Policy.'
    },
    {
      id: 'support',
      iconType: 'message',
      title: 'Support Online',
      desc: "We're available Monday to Saturday, 10:30 AM - 6:00 PM. Closed on Sundays. Feel free to reach out - we're here to help!",
      linkText: null
    }
  ],
  status: 'idle',
  error: null
};

const storeFeaturesSlice = createSlice({
  name: 'storeFeatures',
  initialState,
  reducers: {
    setFeatures: (state, action) => {
      state.features = action.payload;
    }
  }
});

export const { setFeatures } = storeFeaturesSlice.actions;
export default storeFeaturesSlice.reducer;
