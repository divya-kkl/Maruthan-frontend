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

const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginInput) {
    loginUser(input: $input) {
      user {
        id
        username
        email
        country
        state
        city
        address
        phone_number
        pincode
        gender
      }
      token
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation RegisterUser($input: RegisterInput) {
    registerUser(input: $input) {
      user {
        id
        username
        email
        country
        state
        city
        address
        phone_number
        pincode
        gender
      }
      token
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

export const loginUserThunk = createAsyncThunk(
  'user/loginUser',
  async (input, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(LOGIN_MUTATION, { input });
      const { user, token } = data.loginUser;
      
      if (token) {
        localStorage.setItem('token', token);
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        return { user, token };
      }
      return rejectWithValue("Login failed. No token received.");
    } catch (e) {
      let errorMessage = "Authentication failed. Please try again.";
      if (e.response && e.response.errors && e.response.errors.length > 0) {
        errorMessage = e.response.errors[0].message;
      } else if (e.message) {
        errorMessage = e.message;
      }
      if (errorMessage.includes("Invalid email or password")) {
        errorMessage = "Invalid email or password. If you don't have an account, please register a new one.";
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/registerUser',
  async (input, { rejectWithValue }) => {
    try {
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(REGISTER_MUTATION, { input });
      const { user, token } = data.registerUser;
      
      if (token) {
        // Just return the data, SignIn component handles the alert and mode switch
        return { user, token };
      }
      return rejectWithValue("Registration failed. No token received.");
    } catch (e) {
      let errorMessage = "Registration failed. Please try again.";
      if (e.response && e.response.errors && e.response.errors.length > 0) {
        errorMessage = e.response.errors[0].message;
      } else if (e.message) {
        errorMessage = e.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  user: null,
  orders: [],
  loadingOrders: false,
  loadingUser: false,
  loadingAuth: false,
  error: null,
  authError: null,
  registrationSuccess: false,
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
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    resetAuthError: (state) => {
      state.authError = null;
    },
    resetRegistrationSuccess: (state) => {
      state.registrationSuccess = false;
    }
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
      })
      .addCase(loginUserThunk.pending, (state) => {
        state.loadingAuth = true;
        state.authError = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.loadingAuth = false;
        state.user = action.payload.user;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loadingAuth = false;
        state.authError = action.payload;
      })
      .addCase(registerUserThunk.pending, (state) => {
        state.loadingAuth = true;
        state.authError = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.loadingAuth = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loadingAuth = false;
        state.authError = action.payload;
      });
  },
});

export const { setUser, logout, resetAuthError, resetRegistrationSuccess } = userSlice.actions;

export default userSlice.reducer;
