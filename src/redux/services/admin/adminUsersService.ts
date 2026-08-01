import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";

export type AdminUserResponse = {
  id: string;
  name: string;
  username: string;
  email: string;
  country_code: string;
  country: string;
  user_role: string;
  is_active: boolean;
  created_by: string;
  activated_by: string;
  activated_on: Date;
  interest: string;
  role: string;
  institution: string;
  created_at: Date;
  updated_at: Date;
};

export type AdminUserInput = {
  name: string;
  username: string;
  email: string;
  password: string;
  country_code: string;
  user_role: string;
  is_active: boolean;
  interest: string;
  role: string;
  institution: string;
};

export type AdminUserUpdateInput = {
  id: string;
  data: Partial<AdminUserInput>;
};

const adminUsersService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<AdminUserResponse[], void>({
      query: () => requestConfig(ADMIN_ENDPOINTS.USERS, "GET"),
      transformResponse: (res: ApiResponse<AdminUserResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Users"],
    }),
    getUserByID: builder.query<AdminUserResponse, string>({
      query: (id) => requestConfig(`${ADMIN_ENDPOINTS.USERS}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AdminUserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<AdminUserResponse, AdminUserInput>({
      query: (data) => requestConfig(ADMIN_ENDPOINTS.USERS, "POST", data),
      transformResponse: (res: ApiResponse<AdminUserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<AdminUserResponse, AdminUserUpdateInput>({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.USERS}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminUserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    activateUser: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.USER_ACTIVATE}/${id}`, "PATCH"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    deactivateUser: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.USER_DEACTIVATE}/${id}`, "PATCH"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation<string, string>({
      query: (id) => requestConfig(`${ADMIN_ENDPOINTS.USERS}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIDQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useActivateUserMutation,
  useDeactivateUserMutation,
  useDeleteUserMutation,
} = adminUsersService;
