// src/redux/rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import themeReducer from "./slices/themeSlice";
import authReducer from "./slices/authSlice";
import turfReducer from "./slices/turfSlice";
import { createSelector } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  theme: themeReducer,
  auth: authReducer,
  turf: turfReducer,
});

// Selector to compute current role name from selectedRoleId
export const selectCurrentRole = createSelector(
  [(state) => state.auth.selectedRoleId],
  (selectedRoleId) => {
    if (!selectedRoleId) return null;
    if (selectedRoleId === 1) return 'admin';
    if (selectedRoleId === 2) return 'owner';
    if (selectedRoleId === 3) return 'customer';
    return null;
  }
);

export default rootReducer;
