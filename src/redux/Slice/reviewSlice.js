import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:2000/graphql";

const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!) {
    getProductReviews(productId: $productId) {
      reviews {
        id
        productId
        orderId
        userId
        userName
        rating
        comment
        createdAt
        updatedAt
      }
      averageRating
      totalCount
    }
  }
`;

const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      productId
      orderId
      userId
      userName
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_REVIEW = gql`
  mutation UpdateReview($id: ID!, $input: UpdateReviewInput!) {
    updateReview(id: $id, input: $input) {
      id
      productId
      orderId
      userId
      userName
      rating
      comment
      createdAt
      updatedAt
    }
  }
`;

const GET_ALL_REVIEWS = gql`
  query GetAllProductReviews {
    getAllProductReviews {
      reviews {
        id
        productId
        orderId
        userId
        userName
        rating
        comment
        createdAt
      }
    }
  }
`;

export const fetchProductReviews = createAsyncThunk(
  'reviews/fetchProductReviews',
  async (productId, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_PRODUCT_REVIEWS, { productId });
      return data.getProductReviews;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load product reviews");
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  'reviews/fetchAllReviews',
  async (_, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_ALL_REVIEWS);
      return data.getAllProductReviews?.reviews || [];
    } catch (err) {
      return rejectWithValue(err.message || "Failed to load all reviews");
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (input, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await client.request(CREATE_REVIEW, { input });
      return data.createReview;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to submit review");
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ id, input }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await client.request(UPDATE_REVIEW, { id, input });
      return data.updateReview;
    } catch (err) {
      return rejectWithValue(err.message || "Failed to update review");
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    allReviews: [],
    averageRating: 0,
    totalCount: 0,
    loading: false,
    error: null,
    submitting: false,
    submitSuccess: false,
    submitError: null,
  },
  reducers: {
    resetSubmitState: (state) => {
      state.submitSuccess = false;
      state.submitError = null;
      state.submitting = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload?.reviews || [];
        state.averageRating = action.payload?.averageRating || 0;
        state.totalCount = action.payload?.totalCount || 0;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch All Reviews
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.allReviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.submitError = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.submitting = true;
        state.submitSuccess = false;
        state.submitError = null;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.submitting = false;
        state.submitSuccess = true;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.submitting = false;
        state.submitSuccess = false;
        state.submitError = action.payload;
      });
  }
});

export const { resetSubmitState } = reviewSlice.actions;
export default reviewSlice.reducer;
