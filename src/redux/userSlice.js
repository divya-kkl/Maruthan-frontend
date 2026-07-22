import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_ORDERS = gql`
  query GetOrder($search: String) {
    getOrder(search: $search) {
      orders {
        id
        userId
        orderNumber
        subTotal
        totalAmount
        status
        paymentMethod
        deliveryAddress {
          name
          street
          city
          state
          country
          phone
        }
        notes
        createdAt
        items {
          name
          image
          price
          quantity
        }
      }
    }
  }
`;

const GET_USER = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      username
      email
      phone_number
      addresses {
        id
        firstName
        lastName
        address
        apartment
        city
        state
        pincode
        country
        phone
        isDefault
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput) {
    updateUser(id: $id, input: $input) {
      id
      addresses {
        id
        firstName
        lastName
        address
        apartment
        city
        state
        pincode
        country
        phone
        isDefault
      }
    }
  }
`;

export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await client.request(GET_USER, { id: userId });
      return data.getUserById;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'user/fetchUserOrders',
  async ({ userId, token }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await client.request(GET_ORDERS, { search: userId });
      
      const allOrders = data.getOrder?.orders || [];
      const userOrders = allOrders.filter(order => order.userId === userId);
      userOrders.sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));
      
      return userOrders;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserAddress = createAsyncThunk(
  'user/updateUserAddress',
  async ({ userId, token, newAddress, currentAddresses }, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const updatedAddresses = (currentAddresses || []).map(addr => ({
        ...addr,
        isDefault: newAddress.isDefault ? false : addr.isDefault
      }));

      const finalAddresses = [...updatedAddresses, newAddress];

      const input = {
        addresses: finalAddresses.map(addr => ({
          firstName: addr.firstName,
          lastName: addr.lastName,
          address: addr.address,
          apartment: addr.apartment,
          city: addr.city,
          state: addr.state,
          pincode: addr.pincode,
          country: addr.country,
          phone: addr.phone,
          isDefault: !!addr.isDefault
        }))
      };

      const data = await client.request(UPDATE_USER, { id: userId, input });
      return data.updateUser.addresses;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  orders: [],
  loadingOrders: false,
  loadingUser: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loadingUser = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loadingUser = false;
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), ...action.payload }));
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loadingUser = false;
        state.error = action.payload;
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.loadingOrders = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loadingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loadingOrders = false;
        state.error = action.payload;
      })
      .addCase(updateUserAddress.fulfilled, (state, action) => {
        if (state.user) {
          state.user.addresses = action.payload;
          localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), addresses: action.payload }));
        }
      });
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
