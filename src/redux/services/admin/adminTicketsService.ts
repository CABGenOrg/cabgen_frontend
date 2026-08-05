import { apiSlice, ApiResponse, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ADMIN_ENDPOINTS } from "./adminEndpoints";

export type TicketResponse = {
  id: string;
  name: string;
  email: string;
  institution: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  admin_id?: string | null;
  admin?: string | null;
};

export type TicketFilter = {
  status: string;
  adminID: string;
};

const adminTicketsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTickets: builder.query<TicketResponse[], TicketFilter>({
      query: ({ status, adminID }) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);
        if (adminID) params.append("admin", adminID);
 
        const queryString = params.toString();

        const url = queryString
          ? `${ADMIN_ENDPOINTS.TICKETS}?${queryString}`
          : ADMIN_ENDPOINTS.TICKETS;

        return requestConfig(url, "GET");
      },
      transformResponse: (res: ApiResponse<TicketResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Tickets"],
    }),
    getTicketById: builder.query<TicketResponse, string>({
      query: (ticketId) =>
        requestConfig(`${ADMIN_ENDPOINTS.TICKETS}/${ticketId}`, "GET"),
      transformResponse: (res: ApiResponse<TicketResponse>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Tickets"],
    }),
    assignTicket: builder.mutation<void, string>({
      query: (ticketId) =>
        requestConfig(
          `${ADMIN_ENDPOINTS.TICKETS}/${ticketId}/assign`,
          "PUT",
          {},
        ),
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Tickets"],
    }),
    resolveTicket: builder.mutation<void, string>({
      query: (ticketId) =>
        requestConfig(
          `${ADMIN_ENDPOINTS.TICKETS}/${ticketId}/resolve`,
          "PUT",
          {},
        ),
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Tickets"],
    }),
    deleteTicket: builder.mutation<string, string>({
      query: (ticketId) =>
        requestConfig(`${ADMIN_ENDPOINTS.TICKETS}/${ticketId}`, "DELETE"),
      transformResponse: (res: ApiMessage) => res.message,
      transformErrorResponse: (res) => handleError(res),
      invalidatesTags: ["Tickets"],
    }),
  }),
});

export const {
  useGetTicketsQuery,
  useGetTicketByIdQuery,
  useAssignTicketMutation,
  useResolveTicketMutation,
  useDeleteTicketMutation,
} = adminTicketsService;
