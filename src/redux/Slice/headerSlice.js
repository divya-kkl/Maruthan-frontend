import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql'; 

const GET_PRODUCT_CATEGORIES = gql`
  query GetProductCategories($search: String) {
    getProductCategories(search: $search) {
      categories {
        id
        name
        code
        description
        imageUrl
        status
        parentCategoryId
        subCategories {
          id
          name
          code
          productCategoryId
          description
          imageUrl
          status
          createdTime
        }
        createdTime
      }
    }
  }
`;

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, { rejectWithValue }) =>{
   
    try{
      const client = new GraphQLClient(GRAPHQL_ENDPOINT);
      const data = await client.request(GET_PRODUCT_CATEGORIES);
      const parentCategories = (data.getProductCategories?.categories || [])

      .filter(cat => !cat.parentCategoryId)
      .reverse();
      
      return parentCategories;
    }
    catch(err){
      return rejectWithValue(err.message);
    }
  },
  {
    condition: (_, { getState }) => {
      const { category } = getState();
      if (category.categories && category.categories.length > 0) {
        return false; // Don't fetch if already loaded
      }
    }
  }
);

const headerSlice = createSlice({
  name: 'category',
  initialState:{
    categories:[],
    loading:true,
    error: null
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

    .addCase(fetchCategories.pending, (state) => {
      state.loading = true;
    })
    .addCase(fetchCategories.fulfilled, (state, action) => {
      state.loading = false;
      state.categories = action.payload;
    })
    .addCase(fetchCategories.rejected, (state, action)=>{
      state.loading  = false;
      state.error = action.payload;
    });
  },
});


export default headerSlice.reducer;