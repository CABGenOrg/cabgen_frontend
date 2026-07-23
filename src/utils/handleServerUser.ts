import { cookies } from "next/headers";
import { baseUrl } from "@/utils/handleRequest";
import { AUTH_ENDPOINTS } from "@/redux/services/auth/authEndpoints";
import type { User } from "@/redux/AuthContext";

export async function getServerUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("AccessCookie")?.value;
  const refreshToken = cookieStore.get("RefreshCookie")?.value;

  if (!accessToken && !refreshToken) return null;

  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  try {
    const res = await fetch(`${baseUrl}${AUTH_ENDPOINTS.ME}`, {
      headers: { Cookie: cookieHeader },
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
