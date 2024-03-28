export const baseUrl: string | undefined =
  process.env.APP_ENV === "dev"
    ? process.env.APP_DEV_API_URL
    : process.env.APP_PROD_API_URL;

export const requestConfig = (url: string, method: string, data: any) => {
  let config;

  if (
    method === "GET" ||
    (method === "DELETE" && data === null) ||
    (method === "POST" && data === null)
  ) {
    config = {
      url,
      method,
    };
  } else if (url.includes("/login") || url.includes("/register")) {
    config = {
      url,
      method,
      body: data,
    };
  } else {
    config = {
      url,
      method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }

  return config;
};
