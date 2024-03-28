import { apiSlice } from "../api/apiSlice";
import { requestConfig } from "../../utils/handleRequest";
import handleError from "@/utils/handleError";

const authService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) =>
        requestConfig("/admin/users/register", "POST", userData),
      transformErrorResponse: (response) => handleError(response),
    }),
    login: builder.mutation({
      query: (credentials) =>
        requestConfig("/admin/users/login", "POST", credentials),
      transformErrorResponse: (response) => handleError(response),
    }),
    logout: builder.query({
      query: () => requestConfig("/admin/logout", "GET", null),
      transformErrorResponse: (response) => handleError(response),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutQuery } =
  authService;
