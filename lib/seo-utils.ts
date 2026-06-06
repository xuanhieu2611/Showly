import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://showly.vn";

type ArtistProfileMeta = {
  displayName: string;
  username: string;
  bio: string | null;
  city: string;
  specialties: string[];
  coverPhotoUrl: string | null;
  avatarUrl: string | null;
};

type StructuredDataOptions = ArtistProfileMeta & {
  avgRating?: number | null;
  reviewCount?: number | null;
};

function specialtyLabel(specialties: string[]): string {
  return specialties
    .map((s) =>
      s === "nail" ? "Nail Artist" : s === "makeup" ? "Makeup Artist" : "Hair Stylist"
    )
    .join(", ");
}

export function generateArtistMetadata(artist: ArtistProfileMeta): Metadata {
  const label = specialtyLabel(artist.specialties);
  const title = `${artist.displayName} — ${label} tại ${artist.city} | Showly`;
  const description =
    artist.bio ??
    `Xem portfolio của ${artist.displayName}, ${label} tại ${artist.city} trên Showly.`;

  const profileUrl = `${SITE_URL}/@${artist.username}`;
  const ogImage = artist.coverPhotoUrl ?? `${SITE_URL}/og-default.jpg`;

  return {
    title,
    description,
    alternates: {
      canonical: profileUrl,
      languages: {
        vi: `${SITE_URL}/vi/@${artist.username}`,
        en: `${SITE_URL}/en/@${artist.username}`,
      },
    },
    openGraph: {
      title,
      description,
      url: profileUrl,
      siteName: "Showly",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `Portfolio của ${artist.displayName}`,
        },
      ],
      locale: "vi_VN",
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export function generatePersonStructuredData(opts: StructuredDataOptions) {
  const label = specialtyLabel(opts.specialties);

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "BeautySalon"],
    name: opts.displayName,
    description: opts.bio ?? `${label} tại ${opts.city}`,
    url: `${SITE_URL}/@${opts.username}`,
    image: opts.coverPhotoUrl ?? opts.avatarUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: opts.city,
      addressCountry: "VN",
    },
    knowsAbout: label,
  };

  if (opts.avgRating && opts.reviewCount && opts.reviewCount > 0) {
    data.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: opts.avgRating.toFixed(1),
      reviewCount: opts.reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
  }

  return data;
}
