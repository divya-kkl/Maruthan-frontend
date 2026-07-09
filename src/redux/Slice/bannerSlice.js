import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request"

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:2000/graphql";

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

export const fetchBanner = createAsyncThunk(
    'banner/fetchBanner',
    async (_, { rejectWithValue }) => {
        try{
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);

        const data = await client.request(GET_ACTIVE_BANNERS);

        const banner = (data.getActiveBanners || []);

        return banner;
        }
        catch(err){
            return rejectWithValue(err.message)
        }
    },
    {
        condition: (_, { getState }) => {
            const { banner } = getState();
            if (banner.status === 'succeeded' || banner.status === 'loading') {
                return false; // Don't fetch if already loaded
            }
        }
    }
);

const bannerSlice = createSlice({
    name:'banner',
    initialState:{
        banner: [],
        status: 'idle',
        error: null
    },
    reducers: {},

    extraReducers: (builder) => {
        builder
        .addCase(fetchBanner.pending, (state)=>{
            state.status = 'loading';
        })
        .addCase(fetchBanner.fulfilled, (state, action) =>{
            state.status = 'succeeded';
            state.banner = action.payload;
        })
        .addCase(fetchBanner.rejected, (state, action) =>{
            state.status = 'falied';
            state.error = action.error.message;
        })
    }
});

export default bannerSlice.reducer;