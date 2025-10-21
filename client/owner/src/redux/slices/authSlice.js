// src/redux/slices/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    userId: null,
    role: null,
    token: null,
    user: null, // Store user info (email, userName, fullName, etc)
    isAuthenticated: false,
  },
  reducers: {
    login: (state, action) => {
      state.userId = action.payload.userId;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.user = action.payload.user || null; // Store full user object
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
