import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: Cookies.get("cabgenAuthCookie") || null },
  reducers: {
    setCredentials: (state, action) => {
      const user = action.payload;
      Cookies.set("cabgenAuthCookie", user, { maxAge: 60 * 60 * 24 });
      state.user = user;
    },
    logout: (state) => {
      state.user = null;
      Cookies.remove("cabgenAuthCookie");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: { user: string | null } }) =>
  state.auth.user;
