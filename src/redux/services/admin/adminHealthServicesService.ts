import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";

export type AdminHealthServiceTableResponse = {
  id: string;
  name: string;
  type: string;
  country: string;
  city: string;
  contactant: string;
  contact_email: string;
  contact_phone: string;
  is_active: boolean;
};

export type AdminHealthServiceInput = {
  name: string;
  type: string;
  country_code: string;
  city?: string | null;
  contactant?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  is_active: boolean;
};

export type AdminHealthServiceUpdateInput = {
  id: string;
  data: Partial<AdminHealthServiceInput>;
};

const adminHealthServicesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHealthServices: builder.query<AdminHealthServiceTableResponse[], void>({
      query: () => requestConfig(ADMIN_ENDPOINTS.HEALTH_SERVICES, "GET"),
      transformResponse: (
        res: ApiResponse<AdminHealthServiceTableResponse[]>,
      ) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["HealthServices"],
    }),
    getHealthServiceByID: builder.query<
      AdminHealthServiceTableResponse,
      string
    >({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.HEALTH_SERVICES}/${id}`, "GET"),
      transformResponse: (res: ApiResponse<AdminHealthServiceTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["HealthServices"],
    }),
    getHealthServicesByName: builder.query<
      AdminHealthServiceTableResponse[],
      string
    >({
      query: (name) =>
        requestConfig(
          `${ADMIN_ENDPOINTS.HEALTH_SERVICES_SEARCH}${name}`,
          "GET",
        ),
      transformResponse: (
        res: ApiResponse<AdminHealthServiceTableResponse[]>,
      ) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["HealthServices"],
    }),
    createHealthService: builder.mutation<
      AdminHealthServiceTableResponse,
      AdminHealthServiceInput
    >({
      query: (data) =>
        requestConfig(ADMIN_ENDPOINTS.HEALTH_SERVICES, "POST", data),
      transformResponse: (res: ApiResponse<AdminHealthServiceTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["HealthServices"],
    }),
    updateHealthService: builder.mutation<
      AdminHealthServiceTableResponse,
      AdminHealthServiceUpdateInput
    >({
      query: ({ id, data }) =>
        requestConfig(`${ADMIN_ENDPOINTS.HEALTH_SERVICES}/${id}`, "PUT", data),
      transformResponse: (res: ApiResponse<AdminHealthServiceTableResponse>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["HealthServices"],
    }),
    deleteHealthService: builder.mutation<string, string>({
      query: (id) =>
        requestConfig(`${ADMIN_ENDPOINTS.HEALTH_SERVICES}/${id}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["HealthServices"],
    }),
  }),
});

export const {
  useGetHealthServicesQuery,
  useGetHealthServiceByIDQuery,
  useGetHealthServicesByNameQuery,
  useCreateHealthServiceMutation,
  useUpdateHealthServiceMutation,
  useDeleteHealthServiceMutation,
} = adminHealthServicesService;
