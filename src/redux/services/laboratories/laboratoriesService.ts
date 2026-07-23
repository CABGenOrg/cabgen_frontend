import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { LABORATORIES_ENDPOINTS } from "./laboratoriesEndpoints";

export type LaboratoryFormResponse = {
  id: string;
  name: string;
  abbreviation: string;
};

const laboratoriesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveLaboratories: builder.query<LaboratoryFormResponse[], void>({
      query: () => requestConfig(LABORATORIES_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<LaboratoryFormResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Laboratories"],
    }),
  }),
});

export const { useGetActiveLaboratoriesQuery } = laboratoriesService;
