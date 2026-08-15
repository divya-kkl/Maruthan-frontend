import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://localhost:2000/graphql';

const GET_WISHLIST = gql`
  query GetWishlist($userId: ID!) {
    getWishlist(userId: $userId) {
      id
      userId
      products {
        productId
        addedAt
      }
    }
  }
`;

const ADD_TO_WISHLIST = gql`
  mutation AddToWishlist($input: WishlistInput!) {
    addToWishlist(input: $input) {
      id
      userId
      products {
        productId
        addedAt
      }
    }
  }
`;

const REMOVE_FROM_WISHLIST = gql`
  mutation RemoveFromWishlist($input: WishlistInput!) {
    removeFromWishlist(input: $input) {
      id
      userId
      products {
        productId
        addedAt
      }
    }
  }
`;

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (userId, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_WISHLIST, { userId });
      return data.getWishlist?.products?.map(p => p.productId) || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addToWishlistThunk = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(ADD_TO_WISHLIST, { 
        input: { userId, productId } 
      });
      return data.addToWishlist?.products?.map(p => p.productId) || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromWishlistThunk = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(REMOVE_FROM_WISHLIST, { 
        input: { userId, productId } 
      });
      return data.removeFromWishlist?.products?.map(p => p.productId) || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(addToWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromWishlistThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromWishlistThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(removeFromWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearWishlist } = wishlistSlice.actions;

export default wishlistSlice.reducer;
