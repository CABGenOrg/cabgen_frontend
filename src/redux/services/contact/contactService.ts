import { apiSlice, ApiMessage } from "../../api/apiSlice";
import { requestConfig } from "../../../utils/handleRequest";
import handleError from "@/utils/handleError";
import { CONTACT_ENDPOINTS } from "./contactEndpoints";

const contactService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contact: builder.mutation<ApiMessage, Record<string, string>>({
      query: (contactData) =>
        requestConfig(CONTACT_ENDPOINTS.CONTACT, "POST", contactData),
      transformErrorResponse: (response) => handleError(response),
    }),
  }),
});

export const { useContactMutation } = contactService;
