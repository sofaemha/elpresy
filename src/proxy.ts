// filepath: src/proxy.ts
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const intlMiddleware = createMiddleware(routing);

const protectedRoutes = ["/dashboard", "/predict"];
const adminRoutes = ["/admin"];

export async function proxy(req: NextRequest) {
  const session = await getSessionFromRequest(req, auth);
  const pathname = req.nextUrl.pathname;
  const isProtected = protectedRoutes.some((r) => pathname.includes(r));
  const isAdmin = adminRoutes.some((r) => pathname.includes(r));

  if ((isProtected || isAdmin) && !session) {
    const locale = pathname.split("/")[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }
  if (isAdmin && session?.user.role !== "admin") {
    const locale = pathname.split("/")[1] || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)"
  ],
};
