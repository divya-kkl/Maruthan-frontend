import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

export const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTagCode($code: String!, $limit: Int) {
    getProductsByTagCode(code: $code, limit: $limit) {
      products {
        id
        name
        price
        mrp
        discountPercentage
        images
        brand
        productCategoriesCode
        tags {
          id
          name
          code
        }
        variants {
          color
          size
          stock
        }
        description
        rating
        numReviews
      }
    }
  }
`;

export const fetchProductsByTag = createAsyncThunk(
  'tagProducts/fetchProductsByTag',
  async ({ code, limit }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const variables = { code, limit };
      const data = await client.request(GET_PRODUCTS_BY_TAG, variables);
      return { code, products: data.getProductsByTagCode?.products || [] };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const tagProductsSlice = createSlice({
  name: 'tagProducts',
  initialState: {
    productsByTag: {}, // stores products by tag code: { 'cotton': [...], 'newborn': [...] }
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsByTag.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productsByTag[action.payload.code] = action.payload.products;
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export default tagProductsSlice.reducer;
