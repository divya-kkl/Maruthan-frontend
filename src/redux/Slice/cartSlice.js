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

const initialState = {
  cartItems: [],
  deliveryCharge: 0,
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
        state.cartItems[existingItemIndex].quantity += quantity;
      } else {
        state.cartItems.push({ product, quantity, size });
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
          state.cartItems[itemIndex].quantity = newQuantity;
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
      });
  }
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
