import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import { SampleResponse } from "../samples/samplesService";

export type AdminSampleInput = {
  collection_date: string;
  run_number: string;
  run_date: string;
  city?: string | null;
  origin_code: string;
  gender?: string | null;
  date_of_birth?: string | null;
  country_code: string;
  user_id: string;
  origin_id: string;
  sample_source_id: string;
  microorganism_id: string;
  sequencer_id: string;
  laboratory_id: string;
  health_service_id: string;
};

export type AdminSampleUpdateInput = {
  id: string;
  data: Partial<AdminSampleInput>;
};

const adminSamplesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminSamples: builder.query<SampleResponse[], string>({
      query: (lang) => requestConfig(ADMIN_ENDPOINTS.SAMPLES, "GET"),
      transformResponse: (res: ApiResponse<SampleResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Samples"],
    }),
    getAdminSampleByID: builder.query<SampleResponse, string>({
      query: (id) => requestConfig(`${ADMIN_ENDPOINTS.SAMPLES}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<SampleResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: (_r, _e, id) => [{ type: "Samples", id }],
    }),
    createAdminSample: builder.mutation<string, AdminSampleInput>({
      query: (data) => requestConfig(ADMIN_ENDPOINTS.SAMPLES, "POST", data),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Samples"],
    }),
    updateAdminSample: builder.mutation<SampleResponse, AdminSampleUpdateInput>({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.SAMPLES}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<SampleResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Samples", id }, "Samples"],
    }),
    deleteAdminSample: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.SAMPLES}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: (_r, _e, id) => [{ type: "Samples", id }, "Samples"],
    }),
  }),
});

export const {
  useGetAdminSamplesQuery,
  useGetAdminSampleByIDQuery,
  useCreateAdminSampleMutation,
  useUpdateAdminSampleMutation,
  useDeleteAdminSampleMutation,
} = adminSamplesService;
