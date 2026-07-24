import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { SELECT_OPTIONS_ENDPOINTS } from "./selectOptionsEndpoints";

export type SelectOption = {
  label: string;
  value: string;
};

export type EnumSelectsResponse = {
  roles: SelectOption[];
  taxons: SelectOption[];
  genders: SelectOption[];
  health_service_types: SelectOption[];
  analysis_types: SelectOption[];
};

export type FormSelectsResponse = {
  laboratories: SelectOption[];
  sequencers: SelectOption[];
  origins: SelectOption[];
  health_service: SelectOption[];
  microorganisms: SelectOption[];
  sample_sources: SelectOption[];
};

const selectOptionsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getEnumSelectOptions: builder.query<EnumSelectsResponse, void>({
      query: () => requestConfig(SELECT_OPTIONS_ENDPOINTS.ENUM, "GET"),
      transformResponse: (res: ApiResponse<EnumSelectsResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["SelectOptions"],
    }),
    getFormSelectOptions: builder.query<FormSelectsResponse, string>({
      query: (lang) => requestConfig(SELECT_OPTIONS_ENDPOINTS.FORM, "GET"),
      transformResponse: (res: ApiResponse<FormSelectsResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["SelectOptions"],
    }),
  }),
});

export const { useGetEnumSelectOptionsQuery, useGetFormSelectOptionsQuery } =
  selectOptionsService;
