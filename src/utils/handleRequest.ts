export const baseUrl: string = process.env.NEXT_PUBLIC_API_URL ?? "";

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
