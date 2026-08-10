import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts($productId: ID!, $limit: Int) {
    getRelatedProducts(productId: $productId, limit: $limit) {
      id
      name
      price
      mrp
      images
    }
  }
`;

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
      createdAt
      variants {
        color
        size
        stock
      }
    }
  }
`;

export const fetchRelatedProducts = createAsyncThunk(
  'productDetails/fetchRelatedProducts',
  async ({ productId, limit = 10 }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_RELATED_PRODUCTS, { productId, limit: Number(limit) });
      return data.getRelatedProducts;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load related products");
    }
  }
);

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
export const isNew = (createdAt) => {
  if (!createdAt) return false;
  const createdDate = new Date(isNaN(createdAt) ? createdAt : parseInt(createdAt));
  const diffDays = Math.ceil(Math.abs(new Date() -createdDate) / (1000 * 60 * 60 * 24));
  return diffDays <= 10;
}
 
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
    quantity: 1,
    activeImage: '',
    relatedProducts: [],
    relatedLoading: false,
    relatedError: null,
  },
  reducers: {
    resetProductDetails: (state) => {
      state.product = null;
      state.loading = true;
      state.error = null;
      state.selectedSize = '';
      state.quantity = 1;
      state.activeImage = '';
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    setActiveImage: (state, action) => {
      state.activeImage = action.payload;
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
      })
      .addCase(fetchRelatedProducts.pending, (state) => {
        state.relatedLoading = true;
        state.relatedError = null;
      })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
        state.relatedLoading = false;
        state.relatedProducts = action.payload;
      })
      .addCase(fetchRelatedProducts.rejected, (state, action) => {
        state.relatedLoading = false;
        state.relatedError = action.payload;
      });
  }
});

export const { resetProductDetails, setSelectedSize, setQuantity, setActiveImage } = productDetailsSlice.actions;

export default productDetailsSlice.reducer;
