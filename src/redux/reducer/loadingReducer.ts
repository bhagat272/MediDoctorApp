import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LoadingState {
  show?: boolean;
  buttonLoader?: boolean;
}

const initialState: LoadingState = {
  show: false,
  buttonLoader: false,
};

const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    loading: (state, action: PayloadAction<any>) => {
      state.show = action.payload;
    },
    buttonLoading: (state, action: PayloadAction<any>) => {
      state.buttonLoader = action.payload;
    },
  },
});

export const {loading, buttonLoading} = loadingSlice.actions;

export default loadingSlice.reducer;
