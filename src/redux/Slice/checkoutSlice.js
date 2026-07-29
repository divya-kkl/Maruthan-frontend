import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_USER_ADDRESSES = gql`
  query GetUserAddresses {
    getUserAddresses {
      addressType
      name
      street
      city
      state
      country
      phone
    }
  }
`;

const GET_PAYMENT_METHODS = gql`
  query GetAllPaymentMethods {
    getAllPaymentMethods {
      id
      name
      value
      description
      icon
      status
      sortOrder
    }
  }
`;

const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      id
      userId
      orderNumber
      items {
        productId
        quantity
        price
        mrp
        name
        image
        size
      }
      subTotal
      deliveryCharge
      totalAmount
      status
      paymentStatus
      paymentMethod
      deliveryAddress {
        addressType
        name
        street
        city
        state
        country
        phone
      }
      notes
      createdAt
      updatedAt
    }
  }
`;

const CREATE_RAZORPAY_ORDER = gql`
  mutation CreateRazorpayOrder($amount: Float!) {
    createRazorpayOrder(amount: $amount) {
      success
      orderId
      amount
      currency
    }
  }
`;

const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    getOrderById(id: $id) {
      id
      orderNumber
      subTotal
      deliveryCharge
      totalAmount
      paymentMethod
      status
      deliveryAddress {
        name
        street
        city
        state
        country
        phone
      }
      notes
      items {
        productId
        name
        image
        quantity
        price
      }
    }
  }
`;

export const fetchSavedAddresses = createAsyncThunk(
  'checkout/fetchSavedAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        return [];
      }
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await client.request(GET_USER_ADDRESSES);
      return data.getUserAddresses || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchPaymentMethods = createAsyncThunk(
  'checkout/fetchPaymentMethods',
  async (_, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_PAYMENT_METHODS);
      const allMethods = (data.getAllPaymentMethods || []).sort((a, b) => a.sortOrder - b.sortOrder);
      return allMethods;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const placeOrder = createAsyncThunk(
  'checkout/placeOrder',
  async ({ input, cartItems }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      // SYNC CART
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          const CLEAR_CART = gql`
            mutation ClearCart($userId: ID!) {
              clearCart(userId: $userId)
            }
          `;
          try {
            await client.request(CLEAR_CART, { userId: user.id });
          } catch (e) {
            console.warn("Backend cart empty or not found. Proceeding to create one.");
          }

          const ADD_TO_CART = gql`
            mutation AddToCart($userId: ID!, $shopId: ID!, $productId: ID!, $quantity: Float!, $size: String!) {
              addToCart(userId: $userId, shopId: $shopId, productId: $productId, quantity: $quantity, size: $size) {
                id
              }
            }
          `;
          for (const item of cartItems) {
            await client.request(ADD_TO_CART, {
              userId: user.id,
              shopId: item.product.shopDetails || item.product.shopId || "default",
              productId: item.product.id || item.product._id,
              quantity: parseFloat(item.quantity),
              size: item.size || "Default"
            });
          }
        }
      }

      const data = await client.request(PLACE_ORDER, { input });
      return data.placeOrder;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'checkout/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await client.request(GET_ORDER_BY_ID, { id: orderId });
      return data.getOrderById;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createRazorpayOrder = createAsyncThunk(
  'checkout/createRazorpayOrder',
  async (amount, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await client.request(CREATE_RAZORPAY_ORDER, { amount });
      return data.createRazorpayOrder;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    savedAddresses: [],
    loadingAddresses: true,
    paymentMethods: [],
    isPlacingOrder: false,
    orderSuccessData: null,
    error: null,
    orderDetails: null,
    loadingOrderDetails: true,
    validationErrors: {},
    submitError: "",
  },
  reducers: {
    resetOrderSuccess: (state) => {
      state.orderSuccessData = null;
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    setSubmitError: (state, action) => {
      state.submitError = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSavedAddresses.pending, (state) => {
        state.loadingAddresses = true;
        state.error = null;
      })
      .addCase(fetchSavedAddresses.fulfilled, (state, action) => {
        state.loadingAddresses = false;
        state.savedAddresses = action.payload;
        state.error = null;
      })
      .addCase(fetchSavedAddresses.rejected, (state, action) => {
        state.loadingAddresses = false;
        state.error = action.payload;
      })
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.paymentMethods = action.payload;
        state.error = null;
      })
      .addCase(placeOrder.pending, (state) => {
        state.isPlacingOrder = true;
        state.error = null;
        state.orderSuccessData = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isPlacingOrder = false;
        state.orderSuccessData = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isPlacingOrder = false;
        state.error = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loadingOrderDetails = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loadingOrderDetails = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loadingOrderDetails = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderSuccess, setValidationErrors, setSubmitError } = checkoutSlice.actions;
export default checkoutSlice.reducer;
