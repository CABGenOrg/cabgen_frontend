import { apiSlice } from "../api/apiSlice";
import { requestConfig } from "../../utils/handleRequest";

const authService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) =>
        requestConfig("/admin/users/register", "POST", userData),
    }),
    login: builder.mutation({
      query: (credentials) =>
        requestConfig("/admin/users/login", "POST", credentials),
    }),
    logout: builder.query({
      query: () => requestConfig("/admin/logout", "GET", null),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutQuery } =
  authService;
