import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export const proxy = createMiddleware(routing);

export const config = {
  matcher: [
    // Match all pathnames except for
    // - api routes, _next, _vercel, static files
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
