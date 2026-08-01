import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { USERS_ENDPOINTS } from "./usersEndpoints";

export type UserResponse = {
  name: string;
  username: string;
  email: string;
  country_code: string;
  country: string;
  user_role: string;
  interest: string;
  role: string;
  institution: string;
};

export type UserInput = {
  name: string;
  username: string;
  country_code: string;
  interest: string;
  role: string;
  institution: string;
};

export type UpdatePasswordInput = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

export type RequestEmailUpdateInput = {
  new_email: string;
  confirm_new_email: string;
};

export type ConfirmEmailUpdateInput = {
  token: string;
};

const usersService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserResponse, void>({
      query: () => requestConfig(USERS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<UserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Users"],
    }),
    updateProfile: builder.mutation<UserResponse, Partial<UserInput>>({
      query: (data) => requestConfig(USERS_ENDPOINTS.DEFAULT, "PUT", data),
      transformResponse: (res: ApiResponse<UserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    deleteProfile: builder.mutation<string, void>({
      query: () => requestConfig(USERS_ENDPOINTS.DEFAULT, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    updatePassword: builder.mutation<string, UpdatePasswordInput>({
      query: (data) =>
        requestConfig(USERS_ENDPOINTS.UPDATE_PASSWORD, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
    }),
    requestEmailUpdate: builder.mutation<string, RequestEmailUpdateInput>({
      query: (data) =>
        requestConfig(USERS_ENDPOINTS.REQUEST_EMAIL_UPDATE, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    confirmEmailUpdate: builder.mutation<string, ConfirmEmailUpdateInput>({
      query: (data) =>
        requestConfig(USERS_ENDPOINTS.CONFIRM_EMAIL_UPDATE, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUpdatePasswordMutation,
  useRequestEmailUpdateMutation,
  useConfirmEmailUpdateMutation,
} = usersService;
