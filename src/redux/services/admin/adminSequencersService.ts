import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";

export type AdminSequencerTableResponse = {
  id: string;
  model: string;
  brand: string;
  is_active: boolean;
};

export type AdminSequencerInput = {
  model: string;
  brand: string;
  is_active: boolean;
};

export type AdminSequencerUpdateInput = {
  id: string;
  data: Partial<AdminSequencerInput>;
};

const adminSequencersService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSequencers: builder.query<AdminSequencerTableResponse[], void>({
      query: () => requestConfig(ADMIN_ENDPOINTS.SEQUENCERS, "GET"),
      transformResponse: (res: ApiResponse<AdminSequencerTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Sequencers"],
    }),
    getSequencerById: builder.query<AdminSequencerTableResponse, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.SEQUENCERS}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AdminSequencerTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Sequencers"],
    }),
    getSequencersByBrandOrModel: builder.query<
      AdminSequencerTableResponse[],
      string
    >({
      query: (input) =>
        requestConfig(`${ADMIN_ENDPOINTS.SEQUENCERS}/${input}`, "GET"),
      transformResponse: (res: ApiResponse<AdminSequencerTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Sequencers"],
    }),
    createSequencer: builder.mutation<
      AdminSequencerTableResponse,
      AdminSequencerInput
    >({
      query: (data) => requestConfig(ADMIN_ENDPOINTS.SEQUENCERS, "POST", data),
      transformResponse: (res: ApiResponse<AdminSequencerTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Sequencers"],
    }),
    updateSequencer: builder.mutation<
      AdminSequencerTableResponse,
      AdminSequencerUpdateInput
    >({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.SEQUENCERS}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminSequencerTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Sequencers"],
    }),
    deleteSequencer: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.SEQUENCERS}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Sequencers"],
    }),
  }),
});

export const {
  useGetSequencersQuery,
  useGetSequencerByIdQuery,
  useGetSequencersByBrandOrModelQuery,
  useCreateSequencerMutation,
  useUpdateSequencerMutation,
  useDeleteSequencerMutation,
} = adminSequencersService;
