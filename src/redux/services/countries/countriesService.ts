import { apiSlice, ApiResponse } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import { COUNTRIES_ENDPOINTS } from "./countriesEndpoints";
import handleError from "@/utils/handleError";

export type Country = { code: string; name: string };

const countriesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], string>({
      query: (lang) => requestConfig(COUNTRIES_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<Country[]>) => res.data,
      transformErrorResponse: (response) => handleError(response),
      providesTags: ["Countries"],
    }),
  }),
});

export const { useGetCountriesQuery } = countriesService;
