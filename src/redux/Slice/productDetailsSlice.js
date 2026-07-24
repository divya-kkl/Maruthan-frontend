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
      rating
      numReviews
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

export const ALL_SIZES = [
  { key: 's', display: 'S (0-12M)' },
  { key: 'm', display: 'M (1-2Y)' },
  { key: 'l', display: 'L (3-4Y)' },
  { key: 'xl', display: 'XL (5-6Y)' },
  { key: 'xxl', display: 'XXL (7-8Y)' },
  { key: 'xxxl', display: 'XXXL (9-10Y)' }
];

const productDetailsSlice = createSlice({
  name: 'productDetails',
  initialState: {
    product: null,
    loading: true,
    error: null,
    selectedSize: '',
  },
  reducers: {
    resetProductDetails: (state) => {
      state.product = null;
      state.loading = true;
      state.error = null;
      state.selectedSize = '';
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
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
        if (action.payload?.variants?.length > 0) {
          state.selectedSize = action.payload.variants[0].size;
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetProductDetails, setSelectedSize } = productDetailsSlice.actions;

export default productDetailsSlice.reducer;
