import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ShippingInfo {
  name: string;
  address: string;
  // Add more shipping fields as needed
}

interface CheckoutState {
  shippingInfo: ShippingInfo;
}

const initialState: CheckoutState = {
  shippingInfo: {
    name: "",
    address: "",
    // Initialize other shipping fields as needed
  },
};

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    saveShippingInfo: (state, action: PayloadAction<ShippingInfo>) => {
      state.shippingInfo = action.payload;
    },
  },
});

export const { saveShippingInfo } = checkoutSlice.actions;

export default checkoutSlice.reducer;
