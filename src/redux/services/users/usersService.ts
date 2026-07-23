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

const usersService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserResponse, void>({
      query: () => requestConfig(USERS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<UserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Users"],
    }),
    updateProfile: builder.mutation<UserResponse, UserInput>({
      query: (data) => requestConfig(USERS_ENDPOINTS.DEFAULT, "PUT", data),
      transformResponse: (res: ApiResponse<UserResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = usersService;
