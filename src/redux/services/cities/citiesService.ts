import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { CITIES_ENDPOINTS } from "./citiesEndpoints";
import { SelectOption } from "../select_options/selectOptionsService";

const citiesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCities: builder.query<SelectOption[], void>({
      query: () => requestConfig(CITIES_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<SelectOption[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Cities"],
    }),
  }),
});

export const { useGetCitiesQuery } = citiesService;
