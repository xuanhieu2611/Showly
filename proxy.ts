import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

const PROTECTED_PATHS = ["/dashboard", "/select-role", "/join"];

const RESERVED_PATHS = new Set([
  "discover",
  "join",
  "login",
  "select-role",
  "dashboard",
  "admin",
  "auth",
  "api",
  "_next",
  "robots.txt",
  "sitemap.xml",
  "favicon.ico",
  "en",
  "vi",
]);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip locale routing for auth and API routes
  if (pathname.startsWith("/auth/") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Rewrite /@username → /username so Next.js [username] route handles it
  const atUsernameMatch = pathname.match(/^\/@([a-z0-9_]{3,30})(\/.*)?$/);
  if (atUsernameMatch) {
    const username = atUsernameMatch[1];
    const rest = atUsernameMatch[2] ?? "";
    if (!RESERVED_PATHS.has(username)) {
      const url = request.nextUrl.clone();
      url.pathname = `/${username}${rest}`;
      return intlMiddleware(new NextRequest(url, request));
    }
  }

  // Run next-intl locale routing (handles / → /vi redirect etc.)
  const response = intlMiddleware(request);

  // Always refresh Supabase session so Server Components get a valid token
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Strip locale prefix for protection checks (e.g. /vi/dashboard → /dashboard)
  const pathnameWithoutLocale = pathname.replace(/^\/(vi|en)/, "") || "/";
  const isProtected = PROTECTED_PATHS.some(
    (p) =>
      pathnameWithoutLocale === p ||
      pathnameWithoutLocale.startsWith(p + "/")
  );

  if (isProtected && !user) {
    const locale = pathname.split("/")[1];
    const validLocale = locale === "en" ? "en" : "vi";
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = `/${validLocale}/login`;
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)" ],
};
