import { apiSlice } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { HEALTH_ENDPOINTS } from "./healthEndpoints";

export type HealthResponse = {
  status: string;
};

const healthService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getHealth: builder.query<HealthResponse, void>({
      query: () => requestConfig(HEALTH_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: unknown) => res as HealthResponse,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Health"],
    }),
  }),
});

export const { useGetHealthQuery } = healthService;
