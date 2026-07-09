import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || 'http://localhost:2000/graphql';

const GET_PRODUCTS = gql`
  query GetProduct($search: String) {
    getProduct(search: $search) {
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
  }
}`;

export const fetchProducts = createAsyncThunk(
    'product/fetchProducts',
    
    async (_, {rejectWithValue}) => {
      try{

        const client = new GraphQLClient(GRAPHQL_ENDPOINT);

        const data = await client.request( GET_PRODUCTS );
        const products = (data.getProduct?.products || []);
        


        const reversedProduct = [...products].reverse();

        return reversedProduct ;
      }
    
    catch(err){
        return rejectWithValue(err.message);
        
      }
    }
);

const productSlice = createSlice({
    name:'product',
    initialState:{
        product: [],
        status: 'idle',
        error: null
    },
    reducers:{},
    extraReducers: ( builder ) =>{
        builder
        .addCase(fetchProducts.pending, (state) =>{
            state.status = 'loading';
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.product = action.payload;
        })
        .addCase(fetchProducts.rejected, (state,action) => {
            state.status = 'failed';
            state.error = action.error.message
        })

    }
});
export default productSlice.reducer;
