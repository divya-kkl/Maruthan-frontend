import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  scorecards: [
    {
      country: "United States",
      month: "May",
      rating: "Good",
      ratingIndex: 2,
    },
    {
      country: "United Arab Emirates",
      month: "May",
      rating: "Great",
      ratingIndex: 3,
    },
    {
      country: "United States",
      month: "May",
      rating: "Good",
      ratingIndex: 2,
    }
  ],
  status: 'succeeded',
  error: null
};

const storeQualitySlice = createSlice({
  name: 'storeQuality',
  initialState,
  reducers: {
   
    setScorecards: (state, action) => {
      state.scorecards = action.payload;
    }
  },
});

export const { setScorecards } = storeQualitySlice.actions;
export default storeQualitySlice.reducer;
