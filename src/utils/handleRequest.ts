export const baseUrl: string | undefined =
  process.env.APP_ENV === "dev"
    ? process.env.APP_DEV_API_URL
    : process.env.APP_PROD_API_URL;

export const requestConfig = (url: string, method: string, data?: any) => {
  if (method === "GET" || (data === undefined || data === null)) {
    return { url, method };
  }

  return {
    url,
    method,
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  };
};
