import { createSlice } from '@reduxjs/toolkit';

export const toastSlice = createSlice({
  name: 'toast',
  initialState: {
    content: '',
    header: '',
    show: false,
    type: '',
  },
  reducers: {
    setToastContent: (state, action) => {
      state.content = action.payload;
    },
    setToastShow: (state, action) => {
      state.show = action.payload;
    },
    setToastHeader: (state, action) => {
      state.header = action.payload;
    },
    setToastType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setToastContent, setToastShow, setToastHeader, setToastType } =
  toastSlice.actions;

export const selectToast = (state) => state.toastReducer.show;

export default toastSlice.reducer;
