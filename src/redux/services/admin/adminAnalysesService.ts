import { apiSlice, ApiResponse, ApiMessage, Paged } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import {
  AnalysisTSVDownloadInput,
  AnalysisResponse,
  AnalysisResult,
  AnalysisFilters,
} from "../analyses/analysesService";
import { SelectOption } from "../select_options/selectOptionsService";

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
    getAdminAnalyses: builder.query<
      Paged<AnalysisResponse[]>,
      AdminAnalysisFilters
    >({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.originCode) params.append("originCode", filters.originCode);
        if (filters.type) params.append("type", filters.type);
        if (filters.username) params.append("username", filters.username);
        if (filters.page) params.append("page", String(filters.page));
        const qs = params.toString();
        const url = qs
          ? `${ADMIN_ENDPOINTS.ANALYSES}?${qs}`
          : ADMIN_ENDPOINTS.ANALYSES;
        return requestConfig(url, "GET");
      },
      transformResponse: (res: ApiResponse<AnalysisResponse[]>): Paged<
        AnalysisResponse[]
      > => ({ data: res.data, total_pages: res.total_pages ?? 1 }),
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Analyses"],
    }),
    getUsernames: builder.query<SelectOption[], void>({
      query: () => requestConfig(ADMIN_ENDPOINTS.USERNAMES, "GET"),
      transformResponse: (res: ApiResponse<string[]>) =>
        (res.data ?? []).map((u) => ({ label: u, value: u })),
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Users"],
    }),
    getAdminAnalysisByID: builder.query<AnalysisResponse, [string, string]>({
      query: ([id, lang]) =>
        requestConfig(`${ADMIN_ENDPOINTS.ANALYSES}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AnalysisResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, [id]) => [{ type: "Analyses", id }],
    }),
    getAdminAnalysisZip: builder.query<Blob, string>({
      query: (id) => ({
        url: `${ADMIN_ENDPOINTS.ANALYSES}/${id}/download/zip`,
        method: "GET",
        responseHandler: (res: Response) => res.blob(),
      }),
      providesTags: (_r, _e, id) => [{ type: "Analyses", id }],
    }),
    getAdminAnalysisFastQC: builder.query<Blob, [string, string]>({
      query: ([id, report]) => ({
        url: `${ADMIN_ENDPOINTS.ANALYSES}/${id}/${report}`,
        method: "GET",
        responseHandler: (res: Response) => res.blob(),
      }),
      providesTags: (_r, _e, [id]) => [{ type: "Analyses", id }],
    }),
    downloadAdminBatchAnalysisTSVs: builder.mutation<
      Blob,
      AnalysisTSVDownloadInput
    >({
      query: (data) => ({
        url: ADMIN_ENDPOINTS.ANALYSES_DOWNLOAD_BATCH_TSVS,
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        responseHandler: (res: Response) => res.blob(),
      }),
    }),
    downloadAdminDashboardTSVs: builder.mutation<Blob, void>({
      query: () => ({
        url: ADMIN_ENDPOINTS.ANALYSES_DOWNLOAD_DASHBOARD_TSV,
        method: "POST",
        body: JSON.stringify({}),
        headers: { "Content-Type": "application/json" },
        responseHandler: (res: Response) => res.blob(),
      }),
    }),
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
  useGetUsernamesQuery,
  useGetAdminAnalysisByIDQuery,
  useLazyGetAdminAnalysisZipQuery,
  useLazyGetAdminAnalysisFastQCQuery,
  useDownloadAdminBatchAnalysisTSVsMutation,
  useDownloadAdminDashboardTSVsMutation,
  useCreateAdminAnalysisMutation,
  useUpdateAdminAnalysisMutation,
  useDeleteAdminAnalysisMutation,
} = analysesService;
