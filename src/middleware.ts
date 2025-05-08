import { NextRequest, NextResponse } from "next/server";

import { getNetworkFromHeaders } from "@/common/network";

export const middleware = async (req: NextRequest) => {
  const network = await getNetworkFromHeaders(req.headers);

  if (!network) {
    const url = new URL(req.nextUrl);
    url.hostname = `mainnet.${url.hostname}`;
    return NextResponse.redirect(url);
  }

  // If the URL already starts with the network, don't rewrite
  if (req.nextUrl.pathname.startsWith(`/${network}`)) {
    return NextResponse.next();
  }

  const url = new URL(req.nextUrl);
  url.pathname = `/${network}${url.pathname}`;
  return NextResponse.rewrite(url);
};

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.*|sitemap.xml|site.webmanifest|monitoring|robots.txt).*)",
  ],
};
