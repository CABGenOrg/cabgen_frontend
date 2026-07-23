import { cookies } from "next/headers";
import { baseUrl } from "@/utils/handleRequest";
import { AUTH_ENDPOINTS } from "@/redux/services/auth/authEndpoints";
import type { User } from "@/redux/AuthContext";

async function fetchMe(cookieHeader: string) {
  return fetch(`${baseUrl}${AUTH_ENDPOINTS.ME}`, {
    headers: { Cookie: cookieHeader },
    cache: "no-store",
  });
}

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("AccessCookie")?.value;
  const refreshToken = cookieStore.get("RefreshCookie")?.value;

  if (!accessToken && !refreshToken) return null;

  let cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    let res = await fetchMe(cookieHeader);

    if (res.status === 403 && refreshToken) {
      const refreshRes = await fetch(`${baseUrl}${AUTH_ENDPOINTS.REFRESH}`, {
        method: "POST",
        headers: { Cookie: cookieHeader },
        cache: "no-store",
      });

      if (refreshRes.ok) {
        const newAccess = refreshRes.headers
          .get("set-cookie")
          ?.match(/AccessCookie=([^;]+)/)?.[1];

        if (newAccess) {
          cookieHeader = cookieHeader
            .split("; ")
            .filter((c) => !c.startsWith("AccessCookie="))
            .concat(`AccessCookie=${newAccess}`)
            .join("; ");
        }
        res = await fetchMe(cookieHeader);
      }
    }

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}