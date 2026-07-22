import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    formData: {
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
        updateAddressField: (state, action) => {
            const { name, value } = action.payload;
            state.formData[name] = value;
        },
        resetAddressForm: (state) => {
            state.formData = initialState.formData;
        }
    }
})
export const { updateAddressField, resetAddressForm } = addressSlice.actions;
export default addressSlice.reducer