import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { MICROORGANISMS_ENDPOINTS } from "./microorganismsEndpoints";

export type MicroorganismFormResponse = {
  id: string;
  species: string;
};

const microorganismsService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveMicroorganisms: builder.query<MicroorganismFormResponse[], void>({
      query: () => requestConfig(MICROORGANISMS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<MicroorganismFormResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Microorganisms"],
    }),
  }),
});

export const { useGetActiveMicroorganismsQuery } = microorganismsService;
