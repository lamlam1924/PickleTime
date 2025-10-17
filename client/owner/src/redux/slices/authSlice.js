// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    role: null,
    token: null,
    user: null,
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user || null;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.userId = null;
      state.token = null;
      state.role = null;
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
