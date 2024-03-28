// Redux
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// Reducers
import { logout } from "../auth/authSlice";
// Types
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
// Request
import { baseUrl } from "../../utils/handleRequest";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

export type CustomError = {
  status: number;
  data: { errors: any; message: string; mensaje: string };
};

// const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError | CustomError
// > = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);

//   if (result.error?.status === 403) {
//     // Send refresh token to get a new access token
//     const refreshResult = await baseQuery("/token/refresh", api, extraOptions);
//     if (refreshResult?.data) {
//       // Retry the original query with new access token
//       result = await baseQuery(args, api, extraOptions);
//       return result;
//     } else {
//       await baseQuery("/logout", api, extraOptions);
//       api.dispatch(logout());
//     }
//   }

//   return result;
// };

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}),
  tagTypes: [],
});
