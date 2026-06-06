import { cache } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Award, Banknote, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SiteHeader } from "@/components/site-header";
import { SpecialtyBadge } from "@/components/specialty-badge";
import { StarRating } from "@/components/star-rating";
import { ProfilePortfolio } from "@/components/photo-lightbox";
import { generateArtistMetadata, generatePersonStructuredData } from "@/lib/seo-utils";
import { getProvinceLabel, getDistrictLabel } from "@/lib/vietnam-locations";
import {
  ProfileViewRecorder,
  ContactRevealButton,
  ShareButton,
  ReviewFormSection,
  ReviewsList,
} from "./profile-client";
import { Toaster } from "@/components/ui/sonner";

type Props = {
  params: Promise<{ username: string; locale: string }>;
};

// React.cache() deduplicates these across generateMetadata + page component within one request
const getArtistByUsername = cache(async (rawUsername: string) => {
  const username = rawUsername.startsWith("@") ? rawUsername.slice(1) : rawUsername;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("artist_profiles")
    .select(`
      id, username, bio, city, district,
      price_range, years_experience,
      instagram_url, tiktok_url, contact_info,
      is_published, created_at,
      specialties ( specialty ),
      users!artist_profiles_user_id_fkey ( display_name, avatar_url )
    `)
    .eq("username", username)
    .maybeSingle();
  return profile;
});

const getCoverPhoto = cache(async (artistId: string) => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_photos")
    .select("image_url")
    .eq("artist_id", artistId)
    .eq("is_cover", true)
    .maybeSingle();
  return data;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const profile = await getArtistByUsername(username);

  if (!profile || !profile.is_published) {
    return { title: "Không tìm thấy | Showly" };
  }

  const cover = await getCoverPhoto(profile.id);
  const userData = profile.users as { display_name: string | null; avatar_url: string | null } | null;
  const specialties = (profile.specialties as { specialty: string }[]).map((s) => s.specialty);

  return generateArtistMetadata({
    displayName: userData?.display_name ?? profile.username,
    username: profile.username,
    bio: profile.bio,
    city: getProvinceLabel(profile.city),
    specialties,
    coverPhotoUrl: cover?.image_url ?? null,
    avatarUrl: userData?.avatar_url ?? null,
  });
}

const PRICE_LABELS: Record<string, string> = {
  contact: "Liên hệ",
  under_200k: "Dưới 200.000₫",
  "200k_500k": "200.000₫ – 500.000₫",
  "500k_1m": "500.000₫ – 1.000.000₫",
  above_1m: "Trên 1.000.000₫",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  under_1: "Dưới 1 năm",
  "1_3": "1 – 3 năm",
  "3_5": "3 – 5 năm",
  "5_plus": "Trên 5 năm",
};

export default async function ArtistProfilePage({ params }: Props) {
  const { username: rawUsername, locale } = await params;

  const supabase = await createClient();

  // Round 1: profile + auth in parallel
  const [profile, { data: { user: currentUser } }] = await Promise.all([
    getArtistByUsername(rawUsername),
    supabase.auth.getUser(),
  ]);

  if (!profile || !profile.is_published) notFound();

  // Check ownership + review status (depends on both profile and currentUser)
  let isOwnProfile = false;
  let hasReviewed = false;

  if (currentUser) {
    const { data: ownArtistProfile } = await supabase
      .from("artist_profiles")
      .select("id")
      .eq("user_id", currentUser.id)
      .eq("id", profile.id)
      .maybeSingle();

    isOwnProfile = !!ownArtistProfile;

    if (!isOwnProfile) {
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("artist_id", profile.id)
        .eq("reviewer_id", currentUser.id)
        .maybeSingle();
      hasReviewed = !!existingReview;
    }
  }

  // Round 2: photos + reviews + cover all in parallel (cover is cached — free if generateMetadata ran first)
  const [{ data: photos }, { data: reviews }, { count: reviewCount }, cover] = await Promise.all([
    supabase
      .from("portfolio_photos")
      .select("id, image_url, thumbnail_url, title")
      .eq("artist_id", profile.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("reviews")
      .select("id, rating, review_text, created_at")
      .eq("artist_id", profile.id)
      .eq("is_flagged", false)
      .order("created_at", { ascending: false }),
    supabase
      .from("reviews")
      .select("id", { count: "exact", head: true })
      .eq("artist_id", profile.id)
      .eq("is_flagged", false),
    getCoverPhoto(profile.id),
  ]);

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : null;

  const userData = profile.users as { display_name: string | null; avatar_url: string | null } | null;
  const displayName = userData?.display_name ?? profile.username;
  const avatarUrl = userData?.avatar_url ?? null;
  const specialties = (profile.specialties as { specialty: string }[]).map((s) => s.specialty);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://showly.vn";
  const profileUrl = `${siteUrl}/@${profile.username}`;

  const structuredData = generatePersonStructuredData({
    displayName,
    username: profile.username,
    bio: profile.bio,
    city: getProvinceLabel(profile.city),
    specialties,
    coverPhotoUrl: cover?.image_url ?? null,
    avatarUrl,
    avgRating,
    reviewCount: reviewCount ?? 0,
  });

  const loginPath = `/${locale}/login`;

  return (
    <>
      <Toaster />
      <ProfileViewRecorder artistId={profile.id} />

      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen bg-[#FAFAF8]">
        <SiteHeader locale={locale} transparent />

        {/* Hero — cover photo, magazine editorial height */}
        <div className="relative w-full h-64 sm:h-80 md:h-[50vh] lg:h-[55vh] bg-[#F2EDE8] overflow-hidden">
          {cover?.image_url ? (
            <Image
              src={cover.image_url}
              alt={`Portfolio của ${displayName}`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#E8C4B8] via-[#D4B8D4] to-[#B8D4C0]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        <div className="max-w-4xl mx-auto px-4">
          {/* Profile header */}
          <div className="relative -mt-16 pb-6 border-b border-[#E8E2DB]">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#F2EDE8] shrink-0">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={displayName} fill className="object-cover" sizes="96px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name & info */}
              <div className="flex-1 min-w-0">
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1C1C] leading-tight">
                  {displayName}
                </h1>
                <p className="text-sm text-[#6B6560] mt-0.5">@{profile.username}</p>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {specialties.map((s) => (
                    <SpecialtyBadge key={s} specialty={s} size="sm" />
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-[#6B6560]">
                  <span>
                    📍 {getDistrictLabel(profile.city, profile.district)}, {getProvinceLabel(profile.city)}
                  </span>
                  {profile.years_experience && (
                    <span>✦ {EXPERIENCE_LABELS[profile.years_experience] ?? profile.years_experience}</span>
                  )}
                  {profile.price_range && (
                    <span>💰 {PRICE_LABELS[profile.price_range] ?? profile.price_range}</span>
                  )}
                </div>

                <div className="flex items-center gap-3 mt-3">
                  {profile.instagram_url && (
                    <a
                      href={profile.instagram_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#6B6560] hover:text-[#1C1C1C] flex items-center gap-1 transition-colors"
                    >
                      📷 Instagram
                    </a>
                  )}
                  {profile.tiktok_url && (
                    <a
                      href={profile.tiktok_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#6B6560] hover:text-[#1C1C1C] flex items-center gap-1 transition-colors"
                    >
                      🎵 TikTok
                    </a>
                  )}
                </div>
              </div>

              {/* Action buttons — desktop */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <ContactRevealButton artistId={profile.id} hasContact={!!profile.contact_info} />
                <ShareButton url={profileUrl} username={profile.username} />
              </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="text-center">
                <p className="font-bold text-[#1C1C1C] text-lg">{photos?.length ?? 0}</p>
                <p className="text-xs text-[#6B6560]">Ảnh</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1">
                  {avgRating ? (
                    <>
                      <StarRating rating={avgRating} size="sm" />
                      <span className="font-bold text-[#1C1C1C] text-lg">{avgRating.toFixed(1)}</span>
                    </>
                  ) : (
                    <span className="font-bold text-[#1C1C1C] text-lg">—</span>
                  )}
                </div>
                <p className="text-xs text-[#6B6560]">{reviewCount ?? 0} đánh giá</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-[#1C1C1C] text-lg">
                  {profile.created_at
                    ? new Date(profile.created_at).toLocaleDateString("vi-VN", {
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
                <p className="text-xs text-[#6B6560]">Tham gia</p>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-4 text-sm text-[#1C1C1C] leading-relaxed max-w-xl">{profile.bio}</p>
            )}

            {/* Action buttons — mobile */}
            <div className="flex sm:hidden items-center gap-2 mt-4">
              <ContactRevealButton artistId={profile.id} hasContact={!!profile.contact_info} />
              <ShareButton url={profileUrl} username={profile.username} />
            </div>
          </div>

          {/* Portfolio grid */}
          <section className="py-8">
            <h2 className="font-heading text-xl font-semibold text-[#1C1C1C] mb-5">Portfolio</h2>
            <ProfilePortfolio photos={photos ?? []} />
          </section>

          {/* Reviews */}
          <section className="pb-12 border-t border-[#E8E2DB] pt-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-semibold text-[#1C1C1C]">
                Đánh giá {reviewCount ? `(${reviewCount})` : ""}
              </h2>
              {avgRating && (
                <div className="flex items-center gap-2">
                  <StarRating rating={avgRating} size="md" />
                  <span className="font-semibold text-[#1C1C1C]">{avgRating.toFixed(1)}</span>
                </div>
              )}
            </div>

            {/* Review submission form */}
            <ReviewFormSection
              artistId={profile.id}
              artistUsername={profile.username}
              currentUserId={currentUser?.id ?? null}
              isOwnProfile={isOwnProfile}
              hasReviewed={hasReviewed}
              loginPath={loginPath}
            />

            {/* Existing reviews list */}
            <div className="mt-6">
              <ReviewsList
                reviews={reviews ?? []}
                artistUsername={profile.username}
                isLoggedIn={!!currentUser}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
