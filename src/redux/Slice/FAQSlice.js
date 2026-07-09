import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = process.env.REACT_APP_GRAPHQL_ENDPOINT || "http://localhost:2000/graphql";

const GET_ACTIVE_FAQS = gql`
  query GetActiveFAQs($category: String) {
    getActiveFAQs(category: $category) {
      id
      question
      answer
      category
      order
    }
  }
`;

export const fetchFAQ = createAsyncThunk (
    'FAQ/fetchFAQ',

    async(_, {rejectWithValue}) =>{
        try{
            const client = new GraphQLClient (GRAPHQL_ENDPOINT);
            const data = await client.request(GET_ACTIVE_FAQS);
            const FAQ = ( data.getActiveFAQs || []);

            return FAQ;
        }
        catch(err){
            return rejectWithValue(err.message)
        }
    }
)

const FAQSlice = createSlice ({
    name: 'FAQ',
    initialState :{
        FAQ : [],
        isLoading : false,
        error : null,
        status : 'idle'
    },
    reducers: {},
    extraReducers: (bulider) =>{
        bulider
        .addCase(fetchFAQ.pending, state =>{
            state.status = 'loading';
            state.error = null;
        })
        .addCase(fetchFAQ.fulfilled, (state, action)=>{
            state.FAQ = action.payload;
            state.status = 'succeeded';
        })
        .addCase(fetchFAQ.rejected, (state, action)=>{
            state.FAQ = [];
            state.status = 'failed';
            state.error = action.payload;
        })
    }
    
});

export default FAQSlice.reducer;