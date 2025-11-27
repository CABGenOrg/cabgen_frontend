import { apiSlice } from "../api/apiSlice";
import { requestConfig } from "../../utils/handleRequest";
import handleError from "@/utils/handleError";

const contactService = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    contact: builder.mutation({
      query: (contactData) =>
        requestConfig("/admin/contact", "POST", contactData),
      transformErrorResponse: (response) => handleError(response),
    }),
  }),
});

export const { useContactMutation } = contactService;
