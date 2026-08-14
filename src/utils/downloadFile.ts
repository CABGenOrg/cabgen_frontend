import { baseUrl } from "./handleRequest";
import { AUTH_ENDPOINTS } from "@/redux/services/auth/authEndpoints";

export async function downloadGetFile(
  url: string,
  filename: string,
): Promise<void> {
  const doFetch = () =>
    fetch(url.startsWith("http") ? url : `${baseUrl}${url}`, {
      credentials: "include",
    });

  let res = await doFetch();

  if (res.status === 401 || res.status === 403) {
    const refreshRes = await fetch(`${baseUrl}${AUTH_ENDPOINTS.REFRESH}`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) res = await doFetch();
  }

  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}

export async function openGetFile(url: string): Promise<void> {
  const fullUrl = url.startsWith("http") ? url : `${baseUrl}${url}`;
  const doFetch = () => fetch(fullUrl, { credentials: "include" });

  let res = await doFetch();

  if (res.status === 401 || res.status === 403) {
    const refreshRes = await fetch(`${baseUrl}${AUTH_ENDPOINTS.REFRESH}`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshRes.ok) res = await doFetch();
  }

  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  window.open(href, "_blank");
  setTimeout(() => URL.revokeObjectURL(href), 10000);
}

export async function downloadPostFile(
  url: string,
  body: unknown,
  filename: string,
): Promise<void> {
  const res = await fetch(`${baseUrl}${url}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Download failed (${res.status})`);
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(href);
}