import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

export const TRENDING_SEARCHES = [
  // IMPORTANT: The 'code' MUST EXACTLY match the Category Code in your Admin Panel!
  { name: "Newborn Pattu Frock", code: "newborn" },
  { name: "Girls Pattu Pavadai", code: "girls" },
  { name: "Chettinad Cotton Pattupavadai", code: "chettinad" },
  { name: "Pattu Frock", code: "pattu" },
  { name: "Tamil Newyear collection", code: "tamil-newyear" },
  { name: "Best selling products", code: "best-selling" }
];

const GET_PRODUCTS = gql`
  query GetProduct($search: String) {
    getProduct(search: $search) {
      products {
      id
      name
      price
      mrp
      discountPercentage
      images
      brand
      productCategoriesID
      productCategoriesCode
      variants {
        color
        size
        stock
      }
      description
      material
      embellishment
      neck
      sleeves
      closure
      lining
      washCare
      ironCare
      createdAt
      updatedAt
      tags {
        id
        name
        code
      }
    }
  }
}`;

export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',

  async (_, { rejectWithValue }) => {
    try {

      const client = new GraphQLClient(GRAPHQL_ENDPOINT);

      const data = await client.request(GET_PRODUCTS);
      const products = (data.getProduct?.products || []);
      let productsList = [...products];

      return productsList;
    }

    catch (err) {
      return rejectWithValue(err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { product } = getState();
      if (product.status === 'succeeded' || product.status === 'loading') {
        return false; // Don't fetch if already loaded
      }
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    product: [],
    status: 'idle',
    error: null,
    searchTerm: ''
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.product = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message
      })

  }
});
export const { setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
