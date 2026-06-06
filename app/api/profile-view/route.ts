import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function hashIP(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + (process.env.IP_HASH_SALT ?? "showly-salt-2026"));
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const artistId = body?.artistId;
  if (!artistId) return NextResponse.json({ ok: false }, { status: 400 });

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const ipHash = await hashIP(ip);
  const supabase = await createClient();

  await supabase.from("profile_views").insert({
    artist_id: artistId,
    viewer_ip_hash: ipHash,
  });

  return NextResponse.json({ ok: true });
}
