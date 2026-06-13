import { createSlice } from "@reduxjs/toolkit";
const tabSlice = createSlice({
  name: "tab",
  initialState: { initialTab: null },
  reducers: {
    setInitialTab: (state, action) => {
      state.initialTab = action.payload;
    },
  },
});
export const { setInitialTab } = tabSlice.actions;
export default tabSlice.reducer;
