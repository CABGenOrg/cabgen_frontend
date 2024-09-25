import { NextRequest } from "next/server";

export const buildURLWithLanguage = (request: NextRequest, URLPath: string) => {
  const lang = request.nextUrl.pathname.split("/")[1];
  const builtURL = new URL(`/${lang}/${URLPath}`, request.url);
  return builtURL;
};
