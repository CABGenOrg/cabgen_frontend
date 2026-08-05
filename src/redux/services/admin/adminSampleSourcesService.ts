import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import { Translations } from "@/types/api";

export type AdminSampleSourceTableResponse = {
  id: string;
  name: string;
  group: string;
  is_active: boolean;
};

export type AdminSampleSourceDetailResponse = {
  id: string;
  names: Translations;
  groups: Translations;
  is_active: boolean;
};

export type AdminSampleSourceInput = {
  names: Translations;
  groups: Translations;
  is_active: boolean;
};

export type AdminSampleSourceUpdateInput = {
  id: string;
  data: Partial<AdminSampleSourceInput>;
};

const adminSampleSourcesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSampleSources: builder.query<AdminSampleSourceTableResponse[], string>({
      query: (lang) => requestConfig(ADMIN_ENDPOINTS.SAMPLE_SOURCES, "GET"),
      transformResponse: (res: ApiResponse<AdminSampleSourceTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["SampleSources"],
    }),
    getSampleSourceById: builder.query<AdminSampleSourceDetailResponse, string>(
      {
        query: (id) =>
          requestConfig(`${ADMIN_ENDPOINTS.SAMPLE_SOURCES}/${id}`, "GET"),
        transformResponse: (
          res: ApiResponse<AdminSampleSourceDetailResponse>,
        ) => res.data,
        transformErrorResponse: (res) => handleError(res),
        providesTags: ["SampleSources"],
      },
    ),
    getSampleSourcesNyNameOrGroup: builder.query<
      AdminSampleSourceTableResponse[],
      string
    >({
      query: (input) =>
        requestConfig(`${ADMIN_ENDPOINTS.SAMPLE_SOURCES}/${input}`, "GET"),
      transformResponse: (res: ApiResponse<AdminSampleSourceTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["SampleSources"],
    }),
    createSampleSource: builder.mutation<
      AdminSampleSourceDetailResponse,
      AdminSampleSourceInput
    >({
      query: (data) =>
        requestConfig(ADMIN_ENDPOINTS.SAMPLE_SOURCES, "POST", data),
      transformResponse: (res: ApiResponse<AdminSampleSourceDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["SampleSources"],
    }),
    updateSampleSource: builder.mutation<
      AdminSampleSourceDetailResponse,
      AdminSampleSourceUpdateInput
    >({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.SAMPLE_SOURCES}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminSampleSourceDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["SampleSources"],
    }),
    deleteSampleSource: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.SAMPLE_SOURCES}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["SampleSources"],
    }),
  }),
});

export const {
  useGetSampleSourcesQuery,
  useGetSampleSourceByIdQuery,
  useGetSampleSourcesNyNameOrGroupQuery,
  useCreateSampleSourceMutation,
  useUpdateSampleSourceMutation,
  useDeleteSampleSourceMutation,
} = adminSampleSourcesService;
