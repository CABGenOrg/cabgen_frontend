import type { ApiError } from "@/redux/api/apiSlice";

const handleError = (response: unknown): string => {
  const err = response as { data?: unknown };
  if (err?.data && typeof err.data === "object" && "error" in err.data) {
    return (err.data as ApiError).error;
  }
  return "internalServer";
};

export default handleError;
