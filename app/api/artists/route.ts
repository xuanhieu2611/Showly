import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const PAGE_SIZE = 24;

export type ArtistCard = {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
  city: string;
  district: string;
  cover_url: string | null;
  specialties: string[];
  avg_rating: number | null;
  review_count: number;
  photo_count: number;
  created_at: string | null;
};

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q")?.trim() ?? "";
  const specialties = searchParams.getAll("specialty").filter(Boolean);
  const city = searchParams.get("city") ?? "";
  const district = searchParams.get("district") ?? "";
  const sort = searchParams.get("sort") ?? "newest";
  const page = parseInt(searchParams.get("page") ?? "0", 10);

  const supabase = await createClient();

  // If specialty filter active, get matching artist IDs first
  let specialtyArtistIds: string[] | null = null;
  if (specialties.length > 0) {
    const { data: rows } = await supabase
      .from("specialties")
      .select("artist_id")
      .in("specialty", specialties);
    specialtyArtistIds = [...new Set((rows ?? []).map((r) => r.artist_id).filter(Boolean) as string[])];
    if (specialtyArtistIds.length === 0) {
      return NextResponse.json({ artists: [], hasMore: false, total: 0 });
    }
  }

  // Base query — count total matching for pagination indicator
  let countQuery = supabase
    .from("artist_profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  let dataQuery = supabase
    .from("artist_profiles")
    .select("id, username, city, district, created_at, users!artist_profiles_user_id_fkey(display_name, avatar_url)")
    .eq("is_published", true);

  if (q) {
    dataQuery = dataQuery.ilike("username", `%${q}%`);
    countQuery = countQuery.ilike("username", `%${q}%`);
  }
  if (city) {
    dataQuery = dataQuery.eq("city", city);
    countQuery = countQuery.eq("city", city);
  }
  if (district) {
    dataQuery = dataQuery.eq("district", district);
    countQuery = countQuery.eq("district", district);
  }
  if (specialtyArtistIds) {
    dataQuery = dataQuery.in("id", specialtyArtistIds);
    countQuery = countQuery.in("id", specialtyArtistIds);
  }

  // Sort (newest/most-photos/highest-rated applied after enrichment for rated/photos)
  dataQuery = dataQuery.order("created_at", { ascending: false });

  const [{ data: artists, error }, { count: total }] = await Promise.all([
    dataQuery.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
    countQuery,
  ]);

  if (error || !artists) {
    return NextResponse.json({ artists: [], hasMore: false, total: 0 }, { status: 500 });
  }

  if (artists.length === 0) {
    return NextResponse.json({ artists: [], hasMore: false, total: total ?? 0 });
  }

  const artistIds = artists.map((a) => a.id);

  // Parallel enrichment queries
  const [{ data: covers }, { data: specialtyRows }, { data: reviewRows }, { data: photoRows }] =
    await Promise.all([
      supabase.from("portfolio_photos").select("artist_id, image_url").in("artist_id", artistIds).eq("is_cover", true),
      supabase.from("specialties").select("artist_id, specialty").in("artist_id", artistIds),
      supabase.from("reviews").select("artist_id, rating").in("artist_id", artistIds).eq("is_flagged", false),
      supabase.from("portfolio_photos").select("artist_id").in("artist_id", artistIds),
    ]);

  const enriched: ArtistCard[] = artists.map((artist) => {
    const userData = artist.users as { display_name: string | null; avatar_url: string | null } | null;
    const cover = covers?.find((c) => c.artist_id === artist.id);
    const artistSpecialties = (specialtyRows ?? [])
      .filter((s) => s.artist_id === artist.id)
      .map((s) => s.specialty)
      .filter(Boolean) as string[];
    const artistReviews = (reviewRows ?? []).filter((r) => r.artist_id === artist.id);
    const avgRating =
      artistReviews.length > 0
        ? artistReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / artistReviews.length
        : null;
    const photoCount = (photoRows ?? []).filter((p) => p.artist_id === artist.id).length;

    return {
      id: artist.id,
      username: artist.username,
      display_name: userData?.display_name ?? artist.username,
      avatar_url: userData?.avatar_url ?? null,
      city: artist.city,
      district: artist.district,
      cover_url: cover?.image_url ?? null,
      specialties: artistSpecialties,
      avg_rating: avgRating,
      review_count: artistReviews.length,
      photo_count: photoCount,
      created_at: artist.created_at,
    };
  });

  // Client-requested sorts that need enrichment data
  if (sort === "rated") {
    enriched.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
  } else if (sort === "photos") {
    enriched.sort((a, b) => b.photo_count - a.photo_count);
  }

  const hasMore = (total ?? 0) > (page + 1) * PAGE_SIZE;

  return NextResponse.json(
    { artists: enriched, hasMore, total: total ?? 0 },
    { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
  );
}
