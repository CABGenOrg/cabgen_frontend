const { REACT_APP_ENV, REACT_APP_DEV_API_URL, REACT_APP_PROD_API_URL } =
  process.env;
export const baseUrl: string | undefined =
  REACT_APP_ENV === "dev"
    ? `${REACT_APP_DEV_API_URL}`
    : `${REACT_APP_PROD_API_URL}`;

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
