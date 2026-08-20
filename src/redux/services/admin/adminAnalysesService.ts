import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import {
  AnalysisTSVDownloadInput,
  AnalysisResponse,
  AnalysisResult,
  AnalysisFilters,
} from "../analyses/analysesService";

export type AdminAnalysisFilters = AnalysisFilters & {
  username?: string;
};

export type AdminAnalysisResponse = AnalysisResponse;

export type AdminAnalysisInput = {
  type: string;
  sample_id: string;
  user_id: string;
};

export type AdminAnalysisUpdateData = {
  status?: string | null;
  metrics?: AnalysisResult | null;
  fastqc1?: string | null;
  fastqc2?: string | null;
  results_zip_path?: string | null;
  error_message?: string | null;
};

export type AdminAnalysisUpdateInput = {
  id: string;
  data: Partial<AdminAnalysisUpdateData>;
};

const analysesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAnalyses: builder.query<AnalysisResponse[], AdminAnalysisFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.originCode) params.append("originCode", filters.originCode);
        if (filters.type) params.append("type", filters.type);
        if (filters.username) params.append("username", filters.username);
        const qs = params.toString();
        const url = qs
          ? `${ADMIN_ENDPOINTS.ANALYSES}?${qs}`
          : ADMIN_ENDPOINTS.ANALYSES;
        return requestConfig(url, "GET");
      },
      transformResponse: (res: ApiResponse<AnalysisResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Analyses"],
    }),
    getAdminAnalysisByID: builder.query<AnalysisResponse, [string, string]>({
      query: ([id, lang]) => requestConfig(`${ADMIN_ENDPOINTS.ANALYSES}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AnalysisResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, [id]) => [{ type: "Analyses", id }],
    }),
    getAdminAnalysisZip: builder.query<void, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.ANALYSES}/${id}/download/zip`, "GET"),
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, id) => [{ type: "Analyses", id }],
    }),
    getAdminBatchAnalysisTSVs: builder.mutation<void, AnalysisTSVDownloadInput>(
      {
        query: (data) =>
          requestConfig(
            ADMIN_ENDPOINTS.ANALYSES_DOWNLOAD_BATCH_TSVS,
            "POST",
            data,
          ),
        transformErrorResponse: (res) => handleError(res),
        invalidatesTags: ["Analyses"],
      },
    ),
    createAdminAnalysis: builder.mutation<string, AdminAnalysisInput>({
      query: (data) => requestConfig(ADMIN_ENDPOINTS.ANALYSES, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Analyses"],
    }),
    updateAdminAnalysis: builder.mutation<string, AdminAnalysisUpdateInput>({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.ANALYSES}/${id}`, "PUT", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Analyses"],
    }),
    deleteAdminAnalysis: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.ANALYSES}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: (_r, _e, id) => [{ type: "Analyses", id }, "Analyses"],
    }),
  }),
});

export const {
  useGetAdminAnalysesQuery,
  useGetAdminAnalysisByIDQuery,
  useGetAdminAnalysisZipQuery,
  useGetAdminBatchAnalysisTSVsMutation,
  useCreateAdminAnalysisMutation,
  useUpdateAdminAnalysisMutation,
  useDeleteAdminAnalysisMutation,
} = analysesService;
