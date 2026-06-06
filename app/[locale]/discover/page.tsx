import type { Metadata } from "next";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { DiscoverClient } from "./discover-client";
import type { ArtistCard } from "@/app/api/artists/route";
import { Toaster } from "@/components/ui/sonner";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "Khám phá Beauty Artists Việt Nam | Showly",
  description:
    "Tìm thợ nail, trang điểm, làm tóc uy tín gần bạn. Khám phá hàng ngàn beauty artists chuyên nghiệp trên Showly.",
};

const PAGE_SIZE = 24;

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function fetchInitialArtists(filters: {
  q: string;
  specialties: string[];
  city: string;
  district: string;
  sort: string;
}): Promise<{ artists: ArtistCard[]; hasMore: boolean; total: number }> {
  const supabase = await createClient();

  // If specialty filter active, get matching artist IDs first
  let specialtyArtistIds: string[] | null = null;
  if (filters.specialties.length > 0) {
    const { data: rows } = await supabase
      .from("specialties")
      .select("artist_id")
      .in("specialty", filters.specialties);
    specialtyArtistIds = [
      ...new Set((rows ?? []).map((r) => r.artist_id).filter(Boolean) as string[]),
    ];
    if (specialtyArtistIds.length === 0) {
      return { artists: [], hasMore: false, total: 0 };
    }
  }

  let dataQuery = supabase
    .from("artist_profiles")
    .select(
      "id, username, city, district, created_at, users!artist_profiles_user_id_fkey(display_name, avatar_url)"
    )
    .eq("is_published", true);

  let countQuery = supabase
    .from("artist_profiles")
    .select("id", { count: "exact", head: true })
    .eq("is_published", true);

  if (filters.q) {
    dataQuery = dataQuery.ilike("username", `%${filters.q}%`);
    countQuery = countQuery.ilike("username", `%${filters.q}%`);
  }
  if (filters.city) {
    dataQuery = dataQuery.eq("city", filters.city);
    countQuery = countQuery.eq("city", filters.city);
  }
  if (filters.district) {
    dataQuery = dataQuery.eq("district", filters.district);
    countQuery = countQuery.eq("district", filters.district);
  }
  if (specialtyArtistIds) {
    dataQuery = dataQuery.in("id", specialtyArtistIds);
    countQuery = countQuery.in("id", specialtyArtistIds);
  }

  dataQuery = dataQuery.order("created_at", { ascending: false }).range(0, PAGE_SIZE - 1);

  const [{ data: artists }, { count: total }] = await Promise.all([dataQuery, countQuery]);

  if (!artists || artists.length === 0) {
    return { artists: [], hasMore: false, total: total ?? 0 };
  }

  const artistIds = artists.map((a) => a.id);
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

  if (filters.sort === "rated") enriched.sort((a, b) => (b.avg_rating ?? 0) - (a.avg_rating ?? 0));
  else if (filters.sort === "photos") enriched.sort((a, b) => b.photo_count - a.photo_count);

  return {
    artists: enriched,
    hasMore: (total ?? 0) > PAGE_SIZE,
    total: total ?? 0,
  };
}

export default async function DiscoverPage({ params: routeParams, searchParams }: Props) {
  const { locale } = await routeParams;
  const params = await searchParams;

  const q = typeof params.q === "string" ? params.q : "";
  const specialties = Array.isArray(params.specialty)
    ? params.specialty
    : params.specialty
    ? [params.specialty]
    : [];
  const city = typeof params.city === "string" ? params.city : "";
  const district = typeof params.district === "string" ? params.district : "";
  const sort = typeof params.sort === "string" ? params.sort : "newest";

  const { artists, hasMore, total } = await fetchInitialArtists({
    q, specialties, city, district, sort,
  });

  return (
    <>
      <Toaster />
      <div className="min-h-screen bg-[#FAFAF8]">
        <SiteHeader locale={locale} />

        <main className="max-w-6xl mx-auto px-4 py-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold text-[#1C1C1C]">Khám phá Beauty Artists</h1>
            <p className="text-[#6B6560] mt-1">Tìm thợ nail, trang điểm, làm tóc uy tín gần bạn</p>
          </div>

          <Suspense>
            <DiscoverClient
              initialArtists={artists}
              initialHasMore={hasMore}
              initialTotal={total}
              locale={locale}
              defaultQ={q}
              defaultSpecialties={specialties}
              defaultCity={city}
              defaultDistrict={district}
              defaultSort={sort}
            />
          </Suspense>
        </main>
      </div>
    </>
  );
}
