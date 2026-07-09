import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_ACTIVE_TOP_BANNERS = gql`
  query GetActiveTopBanners {
    getActiveTopBanners {
      id
      message
    }
  }
`;

export const fetchTopBanners = createAsyncThunk(
  'topBanner/fetchTopBanners',
  async (_, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_ACTIVE_TOP_BANNERS);
      if (data.getActiveTopBanners && data.getActiveTopBanners.length > 0) {
        return data.getActiveTopBanners.map(banner => banner.message);
      }
      return [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { topBanner } = getState();
      if (topBanner.messages && topBanner.messages.length > 0) {
        return false; // Don't fetch if already loaded
      }
    }
  }
);

const initialState = {
  messages: [],
  loading: true,
  error: null,
};

const topBannerSlice = createSlice({
  name: 'topBanner',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopBanners.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopBanners.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchTopBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default topBannerSlice.reducer;
