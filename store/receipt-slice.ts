import { createSlice } from '@reduxjs/toolkit';

const receiptSlice = createSlice({
  name: 'receipt',
  initialState: null,
  reducers: {
    saveShippingInfo: (state, action) => {
      return action.payload;
    },
    clearReceipt: () => null,
  },
});

export const { saveShippingInfo, clearReceipt } = receiptSlice.actions;

export default receiptSlice.reducer;
