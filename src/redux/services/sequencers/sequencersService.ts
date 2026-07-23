import { apiSlice, ApiResponse } from "@/redux/api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { SEQUENCERS_ENDPOINTS } from "./sequencersEndpoints";

export type SequencerFormResponse = {
  id: string;
  model: string;
  branch: string;
};

const sequencersService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getActiveSequencers: builder.query<SequencerFormResponse[], void>({
      query: () => requestConfig(SEQUENCERS_ENDPOINTS.DEFAULT, "GET"),
      transformResponse: (res: ApiResponse<SequencerFormResponse[]>) =>
        res.data,
      transformErrorResponse: (res) => handleError(res),
      providesTags: ["Sequencers"],
    }),
  }),
});

export const { useGetActiveSequencersQuery } = sequencersService;
