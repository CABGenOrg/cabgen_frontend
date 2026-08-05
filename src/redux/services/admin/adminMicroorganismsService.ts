import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import { Translations } from "@/types/api";

export type AdminMicroorganismDetailResponse = {
  id: string;
  taxon: string;
  species: string;
  variety: Translations;
  is_active: boolean;
};

export type AdminMicroorganismTableResponse = {
  id: string;
  taxon: string;
  species: string;
  variety: string;
  is_active: boolean;
};

export type AdminMicroorganismInput = {
  taxon: string;
  species: string;
  variety?: Translations | null;
  is_active: boolean;
};

export type AdminMicroorganismUpdateInput = {
  id: string;
  data: Partial<AdminMicroorganismInput>;
};

const adminMicroorganismsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMicroorganisms: builder.query<AdminMicroorganismTableResponse[], string>({
      query: (lang) => requestConfig(ADMIN_ENDPOINTS.MICROORGANISMS, "GET"),
      transformResponse: (
        res: ApiResponse<AdminMicroorganismTableResponse[]>,
      ) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Microorganisms"],
    }),
    getMicroorganismById: builder.query<
      AdminMicroorganismDetailResponse,
      string
    >({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.MICROORGANISMS}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AdminMicroorganismDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Microorganisms"],
    }),
    getMicroorganismsBySpecies: builder.query<
      AdminMicroorganismTableResponse[],
      string
    >({
      query: (species) =>
        requestConfig(
          `${ADMIN_ENDPOINTS.MICROORGANISMS_SEARCH}/${species}`,
          "GET",
        ),
      transformResponse: (
        res: ApiResponse<AdminMicroorganismTableResponse[]>,
      ) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Microorganisms"],
    }),
    createMicroorganism: builder.mutation<
      AdminMicroorganismDetailResponse,
      AdminMicroorganismInput
    >({
      query: (data) =>
        requestConfig(ADMIN_ENDPOINTS.MICROORGANISMS, "POST", data),
      transformResponse: (res: ApiResponse<AdminMicroorganismDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Microorganisms"],
    }),
    updateMicroorganism: builder.mutation<
      AdminMicroorganismDetailResponse,
      AdminMicroorganismUpdateInput
    >({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.MICROORGANISMS}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminMicroorganismDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Microorganisms"],
    }),
    deleteMicroorganism: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.MICROORGANISMS}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Microorganisms"],
    }),
  }),
});

export const {
  useGetMicroorganismsQuery,
  useGetMicroorganismByIdQuery,
  useGetMicroorganismsBySpeciesQuery,
  useCreateMicroorganismMutation,
  useUpdateMicroorganismMutation,
  useDeleteMicroorganismMutation,
} = adminMicroorganismsService;
