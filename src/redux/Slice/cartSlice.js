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

const GET_CART_BY_USER_ID = gql`
  query GetCartByUserId($userId: ID!) {
    getCartByUserId(userId: $userId) {
      id
      userId
      shopId
      products {
        productId
        productName
        productImage
        quantity
        price
        mrp
        totalPrice
        size
      }
      totalQuantity
      subTotal
      status
    }
  }
`;

const ADD_TO_CART_MUTATION = gql`
  mutation AddToCart($userId: ID!, $shopId: ID!, $productId: ID!, $quantity: Float!, $size: String) {
    addToCart(userId: $userId, shopId: $shopId, productId: $productId, quantity: $quantity, size: $size) {
      id
      userId
      shopId
      products {
        productId
        productName
        productImage
        quantity
        price
        mrp
        totalPrice
        size
      }
      totalQuantity
      subTotal
      status
    }
  }
`;

const REMOVE_FROM_CART_MUTATION = gql`
  mutation RemoveFromCart($userId: ID!, $productId: ID!, $size: String) {
    removeFromCart(userId: $userId, productId: $productId, size: $size) {
      id
      userId
      shopId
      products {
        productId
        productName
        productImage
        quantity
        price
        mrp
        totalPrice
        size
      }
      totalQuantity
      subTotal
      status
    }
  }
`;

const CLEAR_CART_MUTATION = gql`
  mutation ClearCart($userId: ID!) {
    clearCart(userId: $userId)
  }
`;

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_CART_BY_USER_ID, { userId });
      return data.getCartByUserId?.products?.map(item => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          mrp: item.mrp,
          image: item.productImage
        },
        quantity: item.quantity,
        size: item.size
      })) || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const syncCartOnLogin = createAsyncThunk(
  'cart/syncCartOnLogin',
  async ({ userId, localCartItems }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      for (const item of localCartItems) {
        await client.request(ADD_TO_CART_MUTATION, {
          userId,
          shopId: item.product.shopDetails || item.product.shopId || 'default',
          productId: item.product.id || item.product._id,
          quantity: parseFloat(item.quantity),
          size: item.size || 'Default'
        });
      }
      const data = await client.request(GET_CART_BY_USER_ID, { userId });
      return data.getCartByUserId?.products?.map(item => ({
        product: {
          id: item.productId,
          name: item.productName,
          price: item.price,
          mrp: item.mrp,
          image: item.productImage
        },
        quantity: item.quantity,
        size: item.size
      })) || [];
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ product, quantity, size }, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.user?.user?.id || state.user?.user?._id;
    
    if (userId) {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(ADD_TO_CART_MUTATION, {
          userId,
          shopId: product.shopDetails || product.shopId || "default",
          productId: product.id || product._id,
          quantity: parseFloat(quantity),
          size: size || "Default"
        });
        
        return {
          isLoggedIn: true,
          cartItems: data.addToCart.products.map(item => ({
            product: {
              id: item.productId,
              name: item.productName,
              price: item.price,
              mrp: item.mrp,
              image: item.productImage
            },
            quantity: item.quantity,
            size: item.size
          }))
        };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      return {
        isLoggedIn: false,
        product,
        quantity,
        size
      };
    }
  }
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async ({ productId, size, newQuantity }, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.user?.user?.id || state.user?.user?._id;

    if (userId) {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        if (newQuantity < 1) {
          const data = await client.request(REMOVE_FROM_CART_MUTATION, {
            userId,
            productId,
            size
          });
          return {
            isLoggedIn: true,
            cartItems: data.removeFromCart.products.map(item => ({
              product: {
                id: item.productId,
                name: item.productName,
                price: item.price,
                mrp: item.mrp,
                image: item.productImage
              },
              quantity: item.quantity,
              size: item.size
            }))
          };
        } else {
          const existingItem = state.cart.cartItems.find(
            item => item.product.id === productId && item.size === size
          );
          const currentQuantity = existingItem ? existingItem.quantity : 0;
          const delta = newQuantity - currentQuantity;
          
          if (delta !== 0) {
            const data = await client.request(ADD_TO_CART_MUTATION, {
              userId,
              shopId: existingItem?.product?.shopDetails || existingItem?.product?.shopId || "default",
              productId,
              quantity: parseFloat(delta),
              size: size || "Default"
            });
            return {
              isLoggedIn: true,
              cartItems: data.addToCart.products.map(item => ({
                product: {
                  id: item.productId,
                  name: item.productName,
                  price: item.price,
                  mrp: item.mrp,
                  image: item.productImage
                },
                quantity: item.quantity,
                size: item.size
              }))
            };
          }
          return { isLoggedIn: true, cartItems: state.cart.cartItems };
        }
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      return {
        isLoggedIn: false,
        productId,
        size,
        newQuantity
      };
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, size }, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.user?.user?.id || state.user?.user?._id;

    if (userId) {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        const data = await client.request(REMOVE_FROM_CART_MUTATION, {
          userId,
          productId,
          size
        });
        return {
          isLoggedIn: true,
          cartItems: data.removeFromCart.products.map(item => ({
            product: {
              id: item.productId,
              name: item.productName,
              price: item.price,
              mrp: item.mrp,
              image: item.productImage
            },
            quantity: item.quantity,
            size: item.size
          }))
        };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      return {
        isLoggedIn: false,
        productId,
        size
      };
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState, rejectWithValue }) => {
    const state = getState();
    const userId = state.user?.user?.id || state.user?.user?._id;

    if (userId) {
      try {
        const client = new GraphQLClient(GRAPHQL_ENDPOINT);
        await client.request(CLEAR_CART_MUTATION, { userId });
        return { isLoggedIn: true };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    } else {
      return { isLoggedIn: false };
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
    clearLocalCart: (state) => {
      state.cartItems = [];
      state.coupon = null;
      state.couponError = null;
      state.couponInput = '';
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
      })
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(syncCartOnLogin.pending, (state) => {
        state.loading = true;
      })
      .addCase(syncCartOnLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.cartItems = action.payload;
      })
      .addCase(syncCartOnLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isLoggedIn) {
          state.cartItems = action.payload.cartItems;
        } else {
          const { product, quantity, size } = action.payload;
          const existingItemIndex = state.cartItems.findIndex(
            item => item.product.id === product.id && item.size === size
          );

          if (existingItemIndex > -1) {
            state.cartItems[existingItemIndex].quantity = Math.min(5, state.cartItems[existingItemIndex].quantity + quantity);
          } else {
            state.cartItems.push({ product, quantity: Math.min(5, quantity), size });
          }
        }
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isLoggedIn) {
          state.cartItems = action.payload.cartItems;
        } else {
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
        }
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.isLoggedIn) {
          state.cartItems = action.payload.cartItems;
        } else {
          const { productId, size } = action.payload;
          state.cartItems = state.cartItems.filter(
            item => !(item.product.id === productId && item.size === size)
          );
        }
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
        state.coupon = null;
        state.couponError = null;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearLocalCart, removeCoupon, clearCouponError, setCouponInput } = cartSlice.actions;

export default cartSlice.reducer;
