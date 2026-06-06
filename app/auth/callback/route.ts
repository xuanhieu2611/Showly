import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=no_code`);
  }

  const cookieStore = await cookies();
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // Check if this user has set their account_type yet
  const { data: userRow } = await supabase
    .from("users")
    .select("account_type")
    .eq("id", data.user.id)
    .single();

  // New user or no account type set → send to account type selection
  if (!userRow?.account_type) {
    return NextResponse.redirect(`${origin}/select-role`);
  }

  // Artist with no profile yet → send to onboarding
  if (userRow.account_type === "artist") {
    const { data: profile } = await supabase
      .from("artist_profiles")
      .select("id")
      .eq("user_id", data.user.id)
      .single();

    if (!profile) {
      return NextResponse.redirect(`${origin}/join`);
    }
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  // Client → go to discover page
  return NextResponse.redirect(`${origin}${next}`);
}
