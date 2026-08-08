import { apiSlice, ApiResponse } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";

export type AnalysesByStatus = {
  done: number;
  running: number;
  pending: number;
  failed: number;
};

export type CountryMetric = {
  country: string;
  count: number;
};

export type SpeciesMetric = {
  species: string;
  count: number;
};

export type AdminMetricsResponse = {
  total_samples: number;
  total_countries: number;
  total_species: number;
  total_resistance_genes: number;
  total_users: number;
  total_analyses: number;
  analyses_by_status: AnalysesByStatus;
  top_countries: CountryMetric[];
  species_breakdown: SpeciesMetric[];
};

const metricsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMetrics: builder.query<AdminMetricsResponse, void>({
      query: () => requestConfig(ADMIN_ENDPOINTS.METRICS, "GET"),
      transformResponse: (res: ApiResponse<AdminMetricsResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Metrics"],
    }),
  }),
});

export const { useGetAdminMetricsQuery } = metricsService;
