import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { SAMPLE_SOURCES_ENDPOINTS } from "./sampleSourcesEndpoints";

export type SampleSourceFormResponse = {
  id: string;
  name: string;
  group: string;
};

const sampleSourcesService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSampleSources: builder.query<SampleSourceFormResponse[], void>({
      query: () => requestConfig(SAMPLE_SOURCES_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<SampleSourceFormResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["SampleSources"],
    }),
  }),
});

export const { useGetActiveSampleSourcesQuery } = sampleSourcesService;
