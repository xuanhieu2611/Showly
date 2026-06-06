import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const USERNAME_REGEX = /^[a-z0-9_]{3,30}$/;

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username");

  if (!username) {
    return NextResponse.json({ available: false, error: "missing" }, { status: 400 });
  }

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({ available: false, error: "invalid" });
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("artist_profiles")
    .select("username")
    .eq("username", username)
    .maybeSingle();

  return NextResponse.json({ available: data === null });
}
