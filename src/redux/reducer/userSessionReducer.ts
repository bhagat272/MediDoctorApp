import {createSlice, PayloadAction} from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState = {
  userData: global?.userData,
};

const userDataSlice = createSlice({
  name: 'userSession',
  initialState,
  reducers: {
    userPayload: (state, action: PayloadAction<any>) => {
      state.userData = action.payload;
    },
  },
});

export const {userPayload} = userDataSlice.actions;

export default userDataSlice.reducer;
