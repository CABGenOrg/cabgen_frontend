import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/handleRequest";
import { AUTH_ENDPOINTS } from "../services/authService";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

export type ApiResponse<T> = { data: T };
export type ApiMessage = { message: string };
export type ApiError = { error: string };

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 403) {
    const refreshResult = await baseQuery(
      { url: AUTH_ENDPOINTS.REFRESH, method: "POST" },
      api,
      extraOptions,
    );

    if (refreshResult.meta?.response?.ok) {
      result = await baseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: [],
});
