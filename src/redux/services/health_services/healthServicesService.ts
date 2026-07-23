import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { HEALTH_SERVICES_ENDPOINTS } from "./healthServicesEndpoints";

export type HealthServiceFormResponse = {
  id: string;
  name: string;
};

const healthServicesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveHealthServices: builder.query<HealthServiceFormResponse[], void>({
      query: () => requestConfig(HEALTH_SERVICES_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<HealthServiceFormResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["HealthServices"],
    }),
  }),
});

export const { useGetActiveHealthServicesQuery } = healthServicesService;
