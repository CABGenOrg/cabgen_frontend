import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/handleRequest";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
});

export type CustomError = {
  status: number;
  data: { errors: any; message: string; mensaje: string };
};

export const apiSlice = createApi({
  baseQuery,
  endpoints: (builder) => ({}),
  tagTypes: [],
});
