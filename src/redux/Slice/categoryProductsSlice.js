import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategoryCode($code: String!, $sort: String, $filters: ProductFilterInput, $page: Int, $limit: Int) {
    getProductsByCategoryCode(code: $code, sort: $sort, filters: $filters, page: $page, limit: $limit) {
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
        createdAt
        updatedAt
        embellishment
        neck
        sleeves
        closure
        lining
        washCare
        ironCare
        createdAt
        updatedAt
      }
      filters {
        sizes { name count }
        colors { name count }
        brands { name count }
        stock { inStock outOfStock }
        price { min max }
        dynamicFilters {
          name
          options { name count }
        }
      }
      totalCount
    }
  }
`;

const GET_PRODUCTS_BY_TAG = gql`
  query GetProductsByTagCode($code: String!, $sort: String, $filters: ProductFilterInput, $page: Int, $limit: Int) {
    getProductsByTagCode(code: $code, sort: $sort, filters: $filters, page: $page, limit: $limit) {
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
      }
      filters {
        sizes { name count }
        colors { name count }
        brands { name count }
        stock { inStock outOfStock }
        price { min max }
        dynamicFilters {
          name
          options { name count }
        }
      }
      totalCount
    }
  }
`;

export const fetchCategoryProducts = createAsyncThunk(
  'categoryProducts/fetchCategoryProducts',
  async ({ code, type, sort, page, limit, filters, isNewQuery }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const query = type === 'tag' ? GET_PRODUCTS_BY_TAG : GET_PRODUCTS_BY_CATEGORY;
      const data = await client.request(query, {
        code: code,
        sort,
        page,
        limit,
        filters,
      });

      const responseKey = type === 'tag' ? 'getProductsByTagCode' : 'getProductsByCategoryCode';
      const responseData = data[responseKey];

      if (responseData) {
        let fetchedProducts = responseData.products || [];
        fetchedProducts = [...fetchedProducts];

        return {
          products: fetchedProducts,
          filters: responseData.filters || null,
          totalCount: responseData.totalCount || 0,
          isNewQuery,
          limit
        };
      } else {
        return {
          products: [],
          filters: null,
          totalCount: 0,
          isNewQuery,
          limit
        };
      }
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  products: [],
  filterData: {
    sizes: [], colors: [], brands: [], stock: { inStock: 0, outOfStock: 0 }, price: { min: 0, max: 0 }, dynamicFilters: []
  },
  loading: false,
  loadingMore: false,
  hasMore: true,
  totalCount: 0,
  error: null
};

const categoryProductsSlice = createSlice({
  name: 'categoryProducts',
  initialState,
  reducers: {
    resetCategoryProducts: (state) => {
      state.products = [];
      state.totalCount = 0;
      state.hasMore = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategoryProducts.pending, (state, action) => {
        if (action.meta.arg.isNewQuery) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
      })
      .addCase(fetchCategoryProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        const { products, filters, totalCount, isNewQuery, limit } = action.payload;

        if (isNewQuery) {
          state.products = products;
        } else {
          state.products = [...state.products, ...products];
        }

        state.hasMore = products.length === limit;

        // Calculate total count properly if backend didn't send it correctly
        if (totalCount) {
          state.totalCount = totalCount;
        } else {
          state.totalCount = state.products.length + (products.length === limit ? 1 : 0);
        }

        if (filters) {
          // Only update filterData if sizes are empty OR it's a new query (to prevent resetting available filters while browsing)
          if (state.filterData.sizes.length === 0 || isNewQuery) {
            state.filterData = filters;
          }
        }
      })
      .addCase(fetchCategoryProducts.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload;
      });
  }
});

export const { resetCategoryProducts } = categoryProductsSlice.actions;

export default categoryProductsSlice.reducer;
