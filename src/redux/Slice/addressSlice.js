import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    formDate : {
        country: 'India',
        firstName: '',
        lastName: '',
        address: '',
        apartment: '',
        city: '',
        state: 'TamilNadu',
        pincode: '',
        phone: '+91',
        isDefault: false
    },
}

const addressSlice = createSlice({
    name: 'address',
    initialState,

    reducers: {
        updateAddressField: (state, action) =>{
            const { name, value } = action.payload;
            state.formDate[name] = value;
        },
        resetAddressForm: (state) =>{
            state.formDate = initialState.formDate;
        }
    }
})
export const { updateAddressField, resetAddressForm } = addressSlice.actions;
export default addressSlice.reducer