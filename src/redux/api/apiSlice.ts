import {
  createApi,
  fetchBaseQuery,
  BaseQueryApi,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/handleRequest";
import { AUTH_ENDPOINTS } from "../services/auth/authEndpoints";
import { i18n } from "@/i18n/i18n.config";

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const locale = window.location.pathname.split("/")[1];
      const validLocale = i18n.locales.includes(
        locale as (typeof i18n.locales)[number],
      )
        ? locale
        : document.cookie.match(/NEXT_LOCALE=([^;]+)/)?.[1];
      if (
        validLocale &&
        i18n.locales.includes(validLocale as (typeof i18n.locales)[number])
      ) {
        headers.set("Accept-Language", validLocale);
      }
    }
    return headers;
  },
});

export type ApiResponse<T> = { data: T };
export type ApiMessage = { message: string };
export type ApiError = { error: string };

let refreshPromise: Promise<boolean> | null = null;
let isLoggingOut = false;

const isPublicRoute = () => {
  if (typeof window === "undefined") return false;
  return ["/login", "/register"].some((p) =>
    window.location.pathname.includes(p),
  );
};

const forceLogoutAndRedirect = async (
  api: BaseQueryApi,
  extraOptions: object,
) => {
  if (isLoggingOut || isPublicRoute()) return;
  isLoggingOut = true;
  await baseQuery(
    { url: AUTH_ENDPOINTS.LOGOUT, method: "POST" },
    api,
    extraOptions,
  );
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

const baseQueryWithReauth = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOptions: object,
) => {
  const url = typeof args === "string" ? args : args.url;
  let result = await baseQuery(args, api, extraOptions);

  const status = result.error?.status;
  const isAuthEndpoint =
    url === AUTH_ENDPOINTS.REFRESH || url === AUTH_ENDPOINTS.LOGOUT;

  if (result.error && !isAuthEndpoint && !isLoggingOut) {
    if (status === 403) {
      if (!refreshPromise) {
        refreshPromise = (async () => {
          const res = await baseQuery(
            { url: AUTH_ENDPOINTS.REFRESH, method: "POST" },
            api,
            extraOptions,
          );
          return !!res.meta?.response?.ok;
        })();
      }

      const ok = await refreshPromise;
      refreshPromise = null;

      if (ok) {
        result = await baseQuery(args, api, extraOptions);
      } else {
        await forceLogoutAndRedirect(api, extraOptions);
      }
    } else if (status === 401) {
      await forceLogoutAndRedirect(api, extraOptions);
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: [
    "Auth",
    "Samples",
    "Users",
    "Countries",
    "Origins",
    "Microorganisms",
    "SampleSources",
    "SelectOptions",
    "Sequencers",
    "Laboratories",
    "HealthServices",
    "Cities",
    "Analyses",
    "Tickets",
    "Metrics",
  ],
});
