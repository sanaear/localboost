import createMiddleware from "next-intl/middleware";
import { locales } from "./lib/locales";

export default createMiddleware({
  locales: [...locales],
  defaultLocale: "en",
});

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
