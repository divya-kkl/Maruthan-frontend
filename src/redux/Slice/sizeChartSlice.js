import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
};

const sizeChartSlice = createSlice({
  name: 'sizeChart',
  initialState,
  reducers: {
    openSizeChart: (state) => {
      state.isOpen = true;
    },
    closeSizeChart: (state) => {
      state.isOpen = false;
    },
    toggleSizeChart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openSizeChart, closeSizeChart, toggleSizeChart } = sizeChartSlice.actions;

export default sizeChartSlice.reducer;
