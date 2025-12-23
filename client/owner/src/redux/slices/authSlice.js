// src/redux/slices/authSlice.js – ĐÃ SỬA HOÀN HẢO
import {createSlice} from "@reduxjs/toolkit";

const authSlice = createSlice({
        name: "auth",
        initialState: {
            userId: null,
            token: null,           // token sau login
            user: null,
            isAuthenticated: false,
            roles: [],             // list roleId [2,3]
            selectedRoleId: null,  // CHỈ set SAU select-role
        },
        reducers: {
            login: (state, action) => {
                const {token, user} = action.payload;

                state.userId = user.userId;
                state.token = token;
                state.user = user;
                state.isAuthenticated = true;

                state.roles = user.roles;      // [2,3]
                state.selectedRoleId = null;   // CHƯA CHỌN
            },
    
            setSelectedRole: (state, action) => {
                state.selectedRoleId = action.payload;
            },
            
            updateToken: (state, action) => {
                state.token = action.payload;
            },
            
            logout: (state) => {
                state.userId = null;
                state.token = null;
                state.user = null;
                state.isAuthenticated = false;
                state.roles = [];
                state.selectedRoleId = null;
            },
        },
    })
;

// Export đúng tên
export const {login, logout, setSelectedRole, updateToken} = authSlice.actions;

// Action để dùng trong component (gọn hơn)
export const selectRole = (roleId) => (dispatch) => {
    dispatch(setSelectedRole(roleId));
};

export default authSlice.reducer;