import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { ORIGINS_ENDPOINTS } from "./originsEndpoints";

export type OriginFormResponse = {
  id: string;
  name: string;
};

const originsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveOrigins: builder.query<OriginFormResponse[], void>({
      query: () => requestConfig(ORIGINS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<OriginFormResponse[]>) => res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Origins"],
    }),
  }),
});

export const { useGetActiveOriginsQuery } = originsService;
