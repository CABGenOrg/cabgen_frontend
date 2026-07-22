import { apiSlice, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { AUTH_ENDPOINTS } from "./authEndpoints";

const authService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => requestConfig(AUTH_ENDPOINTS.ME, "GET"),
      providesTags: ["Auth"],
      transformErrorResponse: (response) => handleError(response),
    }),
    register: builder.mutation<ApiMessage, Record<string, string>>({
      query: (userData) =>
        requestConfig(AUTH_ENDPOINTS.REGISTER, "POST", userData),
      transformErrorResponse: (response) => handleError(response),
    }),
    login: builder.mutation({
      query: (credentials) =>
        requestConfig(AUTH_ENDPOINTS.LOGIN, "POST", credentials),
      invalidatesTags: ["Auth"],
      transformErrorResponse: (response) => handleError(response),
    }),
    logout: builder.mutation({
      query: () => requestConfig(AUTH_ENDPOINTS.LOGOUT, "POST", null),
      invalidatesTags: ["Auth"],
      transformErrorResponse: (response) => handleError(response),
    }),
    refresh: builder.mutation({
      query: () => requestConfig(AUTH_ENDPOINTS.REFRESH, "POST", null),
      transformErrorResponse: (response) => handleError(response),
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) =>
        requestConfig(AUTH_ENDPOINTS.FORGOT_PASSWORD, "POST", data),
      transformErrorResponse: (response) => handleError(response),
    }),
    resetPassword: builder.mutation({
      query: (data: { token: string; password: string; newPassword: string }) =>
        requestConfig(AUTH_ENDPOINTS.RESET_PASSWORD, "POST", data),
      transformErrorResponse: (response) => handleError(response),
    }),
  }),
});

export const {
  useGetMeQuery,
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authService;
