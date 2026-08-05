import { apiSlice, ApiMessage, ApiResponse } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { AUTH_ENDPOINTS } from "./authEndpoints";
import { UserInput } from "../users/usersService";

export type UserToken = {
  id: string;
  username: string;
  user_role: string;
};

const authService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserToken, void>({
      query: () => requestConfig(AUTH_ENDPOINTS.ME, "GET"),
      transformResponse: (res: ApiResponse<UserToken>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Auth"],
    }),
    register: builder.mutation<string, UserInput>({
      query: (userData) =>
        requestConfig(AUTH_ENDPOINTS.REGISTER, "POST", userData),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
    }),
    login: builder.mutation({
      query: (credentials) =>
        requestConfig(AUTH_ENDPOINTS.LOGIN, "POST", credentials),
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Auth", "Users"],
    }),
    logout: builder.mutation({
      query: () => requestConfig(AUTH_ENDPOINTS.LOGOUT, "POST", null),
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Auth", "Users"],
    }),
    refresh: builder.mutation({
      query: () => requestConfig(AUTH_ENDPOINTS.REFRESH, "POST", null),
      transformErrorResponse: (res) => handleError(res),
    }),
    forgotPassword: builder.mutation({
      query: (data: { email: string }) =>
        requestConfig(AUTH_ENDPOINTS.FORGOT_PASSWORD, "POST", data),
      transformErrorResponse: (res) => handleError(res),
    }),
    resetPassword: builder.mutation({
      query: (data: { token: string; password: string; newPassword: string }) =>
        requestConfig(AUTH_ENDPOINTS.RESET_PASSWORD, "POST", data),
      transformErrorResponse: (res) => handleError(res),
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
