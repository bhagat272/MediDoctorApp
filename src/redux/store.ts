// import {configureStore} from '@reduxjs/toolkit';
// import reducer from './reducer';

// const store = configureStore({reducer});

// export default store;
import { configureStore } from "@reduxjs/toolkit";
import reducer from "./reducer";

export const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
