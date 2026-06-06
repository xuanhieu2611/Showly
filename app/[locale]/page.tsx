import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { SiteHeader } from "@/components/site-header";
import { ArtistCardComponent } from "@/components/artist-card";
import { createClient } from "@/lib/supabase/server";
import type { ArtistCard } from "@/app/api/artists/route";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://showly.vn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === "vi";

  const title = isVi
    ? "Showly — Portfolio cho Beauty Artists Việt Nam"
    : "Showly — Portfolio Platform for Vietnamese Beauty Artists";
  const description = isVi
    ? "Nền tảng portfolio và khám phá beauty artists hàng đầu Việt Nam. Tạo trang cá nhân tại showly.vn/@tên-của-bạn và chia sẻ lên TikTok, Instagram ngay hôm nay."
    : "Vietnam's #1 portfolio platform for nail artists, makeup artists, and hairstylists. Create your professional page at showly.vn/@yourname.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        vi: `${SITE_URL}/vi`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Showly",
      locale: isVi ? "vi_VN" : "en_US",
      type: "website",
    },
  };
}

async function getFeaturedArtists(): Promise<ArtistCard[]> {
  const supabase = await createClient();

  const { data: artists } = await supabase
    .from("artist_profiles")
    .select("id, username, city, district, created_at, users!artist_profiles_user_id_fkey(display_name, avatar_url)")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (!artists || artists.length === 0) return [];

  const artistIds = artists.map((a) => a.id);

  const [{ data: covers }, { data: specialtyRows }, { data: reviewRows }, { data: photoRows }] =
    await Promise.all([
      supabase.from("portfolio_photos").select("artist_id, image_url").in("artist_id", artistIds).eq("is_cover", true),
      supabase.from("specialties").select("artist_id, specialty").in("artist_id", artistIds),
      supabase.from("reviews").select("artist_id, rating").in("artist_id", artistIds).eq("is_flagged", false),
      supabase.from("portfolio_photos").select("artist_id").in("artist_id", artistIds),
    ]);

  return artists.map((artist) => {
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
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, featured] = await Promise.all([
    getTranslations("home"),
    getFeaturedArtists(),
  ]);

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader locale={locale} />

      {/* Editorial hero */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="max-w-3xl">
          {/* Eyebrow label */}
          <p className="text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-medium mb-5">
            Vietnam&apos;s Beauty Portfolio Platform
          </p>

          <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl font-bold text-[#1C1C1C] leading-[1.05] mb-6">
            {t("headline")}
          </h1>

          <p className="text-[#6B6560] text-lg md:text-xl max-w-xl mb-10 leading-relaxed">
            {t("subheadline")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/${locale}/join`}
              className="inline-flex items-center justify-center bg-[#1C1C1C] text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-[#C9A96E] transition-colors text-sm tracking-wide"
            >
              {t("cta_artist")}
            </Link>
            <Link
              href={`/${locale}/discover`}
              className="inline-flex items-center justify-center border border-[#E8E2DB] text-[#1C1C1C] px-8 py-3.5 rounded-lg font-semibold hover:border-[#1C1C1C] transition-colors text-sm tracking-wide"
            >
              {t("cta_discover")}
            </Link>
          </div>
        </div>
      </section>

      {/* Featured artists */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 pb-24">
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C9A96E] font-medium mb-1">
                Nghệ sĩ nổi bật
              </p>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[#1C1C1C]">
                Khám phá tài năng
              </h2>
            </div>
            <Link
              href={`/${locale}/discover`}
              className="text-sm text-[#6B6560] hover:text-[#1C1C1C] transition-colors hidden sm:block"
            >
              Xem tất cả →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {featured.map((artist) => (
              <ArtistCardComponent key={artist.id} artist={artist} locale={locale} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link
              href={`/${locale}/discover`}
              className="text-sm text-[#6B6560] hover:text-[#1C1C1C] transition-colors"
            >
              Xem tất cả nghệ sĩ →
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
