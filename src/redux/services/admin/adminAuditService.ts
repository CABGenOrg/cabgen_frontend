import { ApiResponse, apiSlice } from "@/redux/api/apiSlice";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";
import { requestConfig } from "@/utils/handleRequest";
import handleError from "@/utils/handleError";
import { SelectOption } from "../select_options/selectOptionsService";

export type AdminAuditFilters = {
  event?: string;
  source?: string;
  status?: string;
  date?: string;
  user_id?: string;
};

export type AdminAuditResponse = {
  id: string;
  event: string;
  source: string;
  status: number;
  metadata: string;
  created_at: string;
  username: string;
};

export type AdminAuditSelectOptionsResponse = {
  events: SelectOption[];
  users: SelectOption[];
};

const auditService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAudit: builder.query<AdminAuditResponse[], AdminAuditFilters>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.event) params.append("event", filters.event);
        if (filters.source) params.append("source", filters.source);
        if (filters.status) params.append("status", filters.status);
        if (filters.date) params.append("date", filters.date);
        if (filters.user_id) params.append("user", filters.user_id);
        const qs = params.toString();
        const url = qs
          ? `${ADMIN_ENDPOINTS.AUDIT}?${qs}`
          : ADMIN_ENDPOINTS.AUDIT;
        return requestConfig(url, "GET");
      },
      transformResponse: (res: ApiResponse<AdminAuditResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Audit"],
    }),
    getAuditSelectOptions: builder.query<AdminAuditSelectOptionsResponse, void>(
      {
        query: () => requestConfig(ADMIN_ENDPOINTS.AUDIT_SELECT_OPTIONS, "GET"),
        transformResponse: (
          res: ApiResponse<AdminAuditSelectOptionsResponse>,
        ) => res.data,
        transformErrorResponse: (res) => handleError(res),
        providesTags: ["Audit", "Users"],
      },
    ),
  }),
});

export const { useGetAuditQuery, useGetAuditSelectOptionsQuery } = auditService;
