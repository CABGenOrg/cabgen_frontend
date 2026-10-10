import {
  apiSlice,
  ApiResponse,
  ApiMessage,
  Paged,
} from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import { SampleResponse } from "../samples/samplesService";

export type AdminSampleInput = {
  collection_date: string;
  run_number: string;
  run_date: string;
  city: string;
  origin_code: string;
  gender?: string | null;
  date_of_birth?: string | null;
  in_network: boolean;
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
    getAdminSamples: builder.query<
      Paged<SampleResponse[]>,
      { lang: string; page?: number }
    >({
      query: ({ page }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        const qs = params.toString();
        const url = qs
          ? `${ADMIN_ENDPOINTS.SAMPLES}?${qs}`
          : ADMIN_ENDPOINTS.SAMPLES;
        return requestConfig(url, "GET");
      },
      transformResponse: (res: ApiResponse<SampleResponse[]>): Paged<
        SampleResponse[]
      > => ({ data: res.data, total_pages: res.total_pages ?? 1 }),
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
    updateAdminSample: builder.mutation<SampleResponse, AdminSampleUpdateInput>(
      {
        query: ({ id, data }) =>
          requestConfig(`${ADMIN_ENDPOINTS.SAMPLES}/${id}`, "PUT", data),
        transformResponse: (res: ApiResponse<SampleResponse>) => res.data,
        transformErrorResponse: (res) => handleError(res),
        invalidatesTags: (_r, _e, { id }) => [
          { type: "Samples", id },
          "Samples",
        ],
      },
    ),
    createAdminSamplesFromTable: builder.mutation<string, FormData>({
      query: (fd) => ({
        url: `${ADMIN_ENDPOINTS.SAMPLES}/table`,
        method: "POST",
        body: fd,
      }),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Samples"],
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
  useCreateAdminSamplesFromTableMutation,
} = adminSamplesService;
