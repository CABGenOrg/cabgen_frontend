import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import { Translations } from "@/types/api";

export type AdminOriginDetailResponse = {
  id: string;
  names: Translations;
  is_active: boolean;
};

export type AdminOriginTableResponse = {
  id: string;
  name: string;
  is_active: boolean;
};

export type AdminOriginInput = {
  names: Translations;
  is_active: boolean;
};

export type AdminOriginUpdateInput = {
  id: string;
  data: Partial<AdminOriginInput>;
};

const adminOriginsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrigins: builder.query<AdminOriginTableResponse[], string>({
      query: (lang) => requestConfig(ADMIN_ENDPOINTS.ORIGINS, "GET"),
      transformResponse: (res: ApiResponse<AdminOriginTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Origins"],
    }),
    getOriginByID: builder.query<AdminOriginDetailResponse, string>({
      query: (id) => requestConfig(`${ADMIN_ENDPOINTS.ORIGINS}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AdminOriginDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Origins"],
    }),
    getOriginsByName: builder.query<AdminOriginTableResponse[], string>({
      query: (name) =>
        requestConfig(`${ADMIN_ENDPOINTS.ORIGINS_SEARCH}${name}`, "GET"),
      transformResponse: (res: ApiResponse<AdminOriginTableResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Origins"],
    }),
    createOrigin: builder.mutation<AdminOriginDetailResponse, AdminOriginInput>(
      {
        query: (data) => requestConfig(ADMIN_ENDPOINTS.ORIGINS, "POST", data),
        transformResponse: (res: ApiResponse<AdminOriginDetailResponse>) =>
          res.data,
        transformErrorResponse: (res) => handleError(res),
        invalidatesTags: ["Origins"],
      },
    ),
    updateOrigin: builder.mutation<
      AdminOriginDetailResponse,
      AdminOriginUpdateInput
    >({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.ORIGINS}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminOriginDetailResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Origins"],
    }),
    deleteOrigin: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.ORIGINS}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Origins"],
    }),
  }),
});

export const {
  useGetOriginsQuery,
  useGetOriginByIDQuery,
  useGetOriginsByNameQuery,
  useCreateOriginMutation,
  useUpdateOriginMutation,
  useDeleteOriginMutation,
} = adminOriginsService;
