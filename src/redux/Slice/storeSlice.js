import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_SHOPS = gql`
  query GetAllShopUsers {
    getAllShopUsers {
      id
      shopName
      ownerName
      email
      contactNumber
      address
      createdAt
      image
    }
  }
`;

export const fetchStores = createAsyncThunk(
    'store/fetchStore',
    async (_, {rejectWithValue}) => {
        try {
            const client = new GraphQLClient(GRAPHQL_ENDPOINT);
            const data = await client.request(GET_SHOPS);
            const stores = data.getAllShopUsers || [];
            const reversedStore = [...stores].reverse();
            return reversedStore;
        } catch(err) {
            return rejectWithValue(err.message);
        }
    }
);

const storeSlice = createSlice({
    name: 'store',
    initialState: {
        store: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(fetchStores.pending, (state) => {
            state.status = 'loading';
        })
        .addCase(fetchStores.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.store = action.payload;
        })
        .addCase(fetchStores.rejected, (state, action) => {
            state.status = 'failed';
            state.error = action.error ? action.error.message : 'Error fetching stores';
        });
    }
});

export default storeSlice.reducer;
   