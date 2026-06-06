import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ artistId: string }> }
) {
  const { artistId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ contact_info: null }, { status: 401 });

  const { data } = await supabase
    .from("artist_profiles")
    .select("contact_info")
    .eq("id", artistId)
    .single();

  return NextResponse.json({ contact_info: data?.contact_info ?? null });
}
