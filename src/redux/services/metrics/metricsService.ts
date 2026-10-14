import { apiSlice, ApiResponse } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { METRICS_ENDPOINTS } from "./metricsEndpoints";
import {
  type AnalysesByStatus,
  type AnalysisTypeMetric,
  type SpeciesMetric,
  type GeneMetric,
  type MonthMetric,
} from "../admin/adminMetricsService";

export type MetricsResponse = {
  total_samples: number;
  total_countries: number;
  total_species: number;
  total_resistance_genes: number;
};

export type UserMetricsResponse = {
  analyses_by_status: AnalysesByStatus;
  analyses_by_type: AnalysisTypeMetric[];
  top_species: SpeciesMetric[];
  top_resistance_genes: GeneMetric[];
  samples_by_month: MonthMetric[];
};

const metricsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMetrics: builder.query<MetricsResponse, void>({
      query: () => requestConfig(METRICS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<MetricsResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Metrics"],
    }),
    getUserMetrics: builder.query<UserMetricsResponse, void>({
      query: () => requestConfig(METRICS_ENDPOINTS.USER, "GET"),
      transformResponse: (res: ApiResponse<UserMetricsResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Metrics"],
    }),
  }),
});

export const { useGetMetricsQuery, useGetUserMetricsQuery } = metricsService;
