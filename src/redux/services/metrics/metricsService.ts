import { apiSlice, ApiResponse } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { METRICS_ENDPOINTS } from "./metricsEndpoints";

export type MetricsResponse = {
  total_samples: number;
  total_countries: number;
  total_species: number;
  total_resistance_genes: number;
};

const metricsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<MetricsResponse, void>({
      query: () => requestConfig(METRICS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<MetricsResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Metrics"],
    }),
  }),
});

export const { useGetMetricsQuery } = metricsService;
