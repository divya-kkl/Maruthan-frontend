import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_DELIVERY_CHARGERS = gql`
  query GetAllDeliveryChargers {
    getAllDeliveryChargers {
      id
      charge
      status
    }
  }
`;

const GET_COUPON_BY_CODE = gql`
  query GetCouponByCode($code: String!) {
    getCouponByCode(code: $code) {
      id
      name
      code
      type
      value
      isActive
      expireDate
    }
  }
`;

export const fetchDeliveryCharge = createAsyncThunk(
  'cart/fetchDeliveryCharge',
  async (_, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_DELIVERY_CHARGERS);
      const activeCharger = data.getAllDeliveryChargers?.find(charger => charger.status === 'ACTIVE');
      return activeCharger ? activeCharger.charge : 0;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCoupon = createAsyncThunk(
  'cart/fetchCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_COUPON_BY_CODE, { code });
      if (!data.getCouponByCode) {
        return rejectWithValue("Invalid coupon code");
      }
      if (!data.getCouponByCode.isActive) {
        return rejectWithValue("Coupon is not active");
      }
      // Assuming expireDate is a timestamp or date string that can be parsed
      const expireDate = new Date(Number(data.getCouponByCode.expireDate) || data.getCouponByCode.expireDate);
      if (expireDate < new Date()) {
        return rejectWithValue("coupon code expire");
      }
      return data.getCouponByCode;
    } catch (err) {
      let errorMessage = err.response?.errors?.[0]?.message || "Failed to apply coupon. Please try again.";
      if (errorMessage.toLowerCase().includes("expired")) {
        errorMessage = "coupon code expire";
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  cartItems: [],
  deliveryCharge: 0,
  coupon: null,
  couponError: null,
  couponInput: '',
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity, size } = action.payload;
      const existingItemIndex = state.cartItems.findIndex(
        item => item.product.id === product.id && item.size === size
      );

      if (existingItemIndex > -1) {
        state.cartItems[existingItemIndex].quantity = Math.min(5, state.cartItems[existingItemIndex].quantity + quantity);
      } else {
        state.cartItems.push({ product, quantity: Math.min(5, quantity), size });
      }
    },
    updateQuantity: (state, action) => {
      const { productId, size, newQuantity } = action.payload;
      if (newQuantity < 1) {
        state.cartItems = state.cartItems.filter(
          item => !(item.product.id === productId && item.size === size)
        );
      } else {
        const itemIndex = state.cartItems.findIndex(
          item => item.product.id === productId && item.size === size
        );
        if (itemIndex > -1) {
          state.cartItems[itemIndex].quantity = Math.min(5, newQuantity);
        }
      }
    },
    removeFromCart: (state, action) => {
      const { productId, size } = action.payload;
      state.cartItems = state.cartItems.filter(
        item => !(item.product.id === productId && item.size === size)
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.couponError = null;
    },
    removeCoupon: (state) => {
      state.coupon = null;
      state.couponError = null;
      state.couponInput = '';
    },
    clearCouponError: (state) => {
      state.couponError = null;
    },
    setCouponInput: (state, action) => {
      state.couponInput = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeliveryCharge.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeliveryCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.deliveryCharge = action.payload;
      })
      .addCase(fetchDeliveryCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCoupon.pending, (state) => {
        state.loading = true;
        state.couponError = null;
      })
      .addCase(fetchCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload;
        state.couponError = null;
      })
      .addCase(fetchCoupon.rejected, (state, action) => {
        state.loading = false;
        state.coupon = null;
        state.couponError = action.payload;
      });
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart, removeCoupon, clearCouponError, setCouponInput } = cartSlice.actions;

export default cartSlice.reducer;
