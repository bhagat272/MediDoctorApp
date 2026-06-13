import { combineReducers } from "@reduxjs/toolkit";

import loading from "./loadingReducer";
import session from "./userSessionReducer";
import tabReducer from "./tabReducer";

export default combineReducers({
  loading,
  session,
  tabReducer,
});
