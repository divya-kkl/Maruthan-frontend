import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      price
      mrp
      images
      brand
      description
      material
      variants {
        color
        size
        stock
      }
    }
  }
`;

export const fetchProductById = createAsyncThunk(
  'productDetails/fetchProductById',
  async (id, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_PRODUCT_BY_ID, { id });
      if (data.getProductById) {
        return data.getProductById;
      }
      return rejectWithValue("Product not found");
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load product details");
    }
  }
);

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState: {
    product: null,
    loading: true,
    error: null,
  },
  reducers: {
    resetProductDetails: (state) => {
      state.product = null;
      state.loading = true;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetProductDetails } = productDetailsSlice.actions;

export default productDetailsSlice.reducer;
