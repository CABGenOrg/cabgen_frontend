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

export type AnalysisTypeMetric = {
  type: string;
  count: number;
  avg_duration_seconds: number;
  p95_duration_seconds: number;
};

export type NetworkMetric = {
  in_network: number;
  out_network: number;
};

export type GeneMetric = {
  gene: string;
  count: number;
};

export type MonthMetric = {
  month: string;
  count: number;
};

export type QueueWaitMetric = {
  avg_seconds: number;
  p95_seconds: number;
};

export type AdminMetricsResponse = {
  total_samples: number;
  total_countries: number;
  total_species: number;
  total_resistance_genes: number;
  total_users: number;
  total_analyses: number;
  users_by_network: NetworkMetric;
  samples_by_network: NetworkMetric;
  analyses_by_status: AnalysesByStatus;
  analyses_by_type: AnalysisTypeMetric[];
  top_resistance_genes: GeneMetric[];
  samples_by_month: MonthMetric[];
  queue_wait: QueueWaitMetric;
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
