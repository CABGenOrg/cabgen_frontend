import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";

export type AdminLaboratoryTableResponse = {
  id: string;
  name: string;
  abbreviation: string;
  is_active: boolean;
};

export type AdminLaboratoryInput = {
  name: string;
  abbreviation: string;
  is_active: boolean;
};

export type AdminLaboratoryUpdateInput = {
  id: string;
  data: Partial<AdminLaboratoryInput>;
};

const adminLaboratoriesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLaboratories: builder.query<AdminLaboratoryTableResponse[], void>({
      query: () => requestConfig(ADMIN_ENDPOINTS.LABORATORIES, "GET"),
      transformResponse: (res: ApiResponse<AdminLaboratoryTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Laboratories"],
    }),
    getLaboratoryById: builder.query<AdminLaboratoryTableResponse, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.LABORATORIES}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AdminLaboratoryTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Laboratories"],
    }),
    getLaboratoriesByNameOrAbbreviation: builder.query<
      AdminLaboratoryTableResponse[],
      string
    >({
      query: (input) =>
        requestConfig(`${ADMIN_ENDPOINTS.LABORATORIES_SEARCH}${input}`, "GET"),
      transformResponse: (res: ApiResponse<AdminLaboratoryTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Laboratories"],
    }),
    createLaboratory: builder.mutation<
      AdminLaboratoryTableResponse,
      AdminLaboratoryInput
    >({
      query: (data) =>
        requestConfig(ADMIN_ENDPOINTS.LABORATORIES, "POST", data),
      transformResponse: (res: ApiResponse<AdminLaboratoryTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Laboratories"],
    }),
    updateLaboratory: builder.mutation<
      AdminLaboratoryTableResponse,
      AdminLaboratoryUpdateInput
    >({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.LABORATORIES}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminLaboratoryTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Laboratories"],
    }),
    deleteLaboratory: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.LABORATORIES}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Laboratories"],
    }),
  }),
});

export const {
  useGetLaboratoriesQuery,
  useGetLaboratoryByIdQuery,
  useGetLaboratoriesByNameOrAbbreviationQuery,
  useCreateLaboratoryMutation,
  useUpdateLaboratoryMutation,
  useDeleteLaboratoryMutation,
} = adminLaboratoriesService;
