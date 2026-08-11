import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ANALYSES_ENDPOINTS } from "./analysesEndpoints";

export type AnalysisResult = {
  coverage: number;
  completeness: string;
  contamination: string;
  genome_size: string;
  n50: string;
  primary_species: string;
  secondary_species: string;
  mlst: string;
  poli_mutations: string[];
  other_mutations: string[];
  gene: string[];
  resfinder: string[];
  vfdb: string[];
  plasmid: string[];
};

export type AnalysisResponse = {
  id: string;
  type: string;
  status: string;
  step: string;
  error_message: string;
  sample: string;
  sample_id: string;
  user: string;
  user_id: string;
  metrics: AnalysisResult;
  results_zip_path: string;
  fastqc1: string;
  fastqc2: string;
  started_at: Date;
  finished_at: Date;
};

export type AnalysisInput = {
  type: string;
  sample_id: string;
};

export type AnalysisTSVDownloadInput = {
  ids: string[];
};

const analysesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAnalyses: builder.query<AnalysisResponse[], void>({
      query: () => requestConfig(ANALYSES_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<AnalysisResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Analyses"],
    }),
    getAnalysisByID: builder.query<AnalysisResponse, string>({
      query: (id) =>
        requestConfig(`${ANALYSES_ENDPOINTS.DEFAULT}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AnalysisResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, id) => [{ type: "Analyses", id }],
    }),
    getAnalysisZip: builder.query<void, string>({
      query: (id) =>
        requestConfig(
          `${ANALYSES_ENDPOINTS.DEFAULT}/${id}/download/zip`,
          "GET",
        ),
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, id) => [{ type: "Analyses", id }],
    }),
    getBatchAnalysisTSVs: builder.mutation<void, AnalysisTSVDownloadInput>({
      query: (data) =>
        requestConfig(ANALYSES_ENDPOINTS.DOWNLOAD_BATCH_TSVS, "POST", data),
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Analyses"],
    }),
    createAnalysis: builder.mutation<string, AnalysisInput>({
      query: (data) => requestConfig(ANALYSES_ENDPOINTS.DEFAULT, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Analyses"],
    }),
    deleteAnalysis: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ANALYSES_ENDPOINTS.DEFAULT}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: (_r, _e, id) => [{ type: "Analyses", id }, "Analyses"],
    }),
  }),
});

export const {
  useGetAnalysesQuery,
  useGetAnalysisByIDQuery,
  useGetAnalysisZipQuery,
  useGetBatchAnalysisTSVsMutation,
  useCreateAnalysisMutation,
  useDeleteAnalysisMutation,
} = analysesService;
