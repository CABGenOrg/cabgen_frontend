import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { SAMPLES_ENDPOINTS } from "./samplesEndpoints";

export type SampleResponse = {
  id: string;
  origin_code: string;
  collection_date: Date;
  run_number: string;
  run_date: Date;
  city: string;
  gender: string;
  date_of_birth: Date;
  fastq1: string;
  fastq2: string;
  fasta: string;
  country_code: string;
  user: string;
  origin: string;
  sample_source: string;
  microorganism: string;
  sequencer: string;
  laboratory: string;
  health_service: string;
};

export type SampleInput = {
  origin_code: string;
  collection_date: Date;
  run_number: string;
  run_date: Date;
  city?: string  | null;
  gender?: string  | null;
  date_of_birth?: Date  | null;
  country_code: string;
  origin: string;
  sample_source: string;
  microorganism: string;
  sequencer: string;
  laboratory: string;
  health_service: string;
};

const samplesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSamples: builder.query<SampleResponse[], string>({
      query: (input = "") => {
        const params = new URLSearchParams();
        if (input) params.append("input", input);
        const qs = params.toString();
        const url = qs
          ? `${SAMPLES_ENDPOINTS.DEFAULT}?${qs}`
          : SAMPLES_ENDPOINTS.DEFAULT;
        return requestConfig(url, "GET");
      },
      transformResponse: (res: ApiResponse<SampleResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Samples"],
    }),
    getSampleByID: builder.query<SampleResponse, string>({
      query: (id) => requestConfig(`${SAMPLES_ENDPOINTS.DEFAULT}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<SampleResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, id) => [{ type: "Samples", id }],
    }),
    createSample: builder.mutation<string, SampleInput>({
      query: (data) => requestConfig(SAMPLES_ENDPOINTS.DEFAULT, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Samples"],
    }),
    updateSample: builder.mutation<
      SampleResponse,
      { id: string; data: Partial<SampleInput> }
    >({
      query: ({ id, data }) =>
        requestConfig(`${SAMPLES_ENDPOINTS.DEFAULT}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<SampleResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Samples", id }, "Samples"],
    }),
    deleteSample: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${SAMPLES_ENDPOINTS.DEFAULT}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: (_r, _e, id) => [{ type: "Samples", id }, "Samples"],
    }),
  }),
});

export const {
  useGetSamplesQuery,
  useGetSampleByIDQuery,
  useCreateSampleMutation,
  useUpdateSampleMutation,
  useDeleteSampleMutation,
} = samplesService;
