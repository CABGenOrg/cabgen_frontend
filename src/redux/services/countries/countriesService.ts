import { apiSlice } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";

export type Country = { code: string; name: string };

const countriesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCountries: builder.query<Country[], string>({
      query: (lang) => requestConfig("/countries", "GET"),
      transformResponse: (response: { data: Country[] }) => response.data,
    }),
  }),
});

export const { useGetCountriesQuery } = countriesService;
