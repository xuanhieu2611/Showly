import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";
import { SpecialtyBadge } from "./specialty-badge";
import { StarRating } from "./star-rating";
import { getProvinceLabel } from "@/lib/vietnam-locations";
import type { ArtistCard } from "@/app/api/artists/route";

type Props = {
  artist: ArtistCard;
  locale: string;
};

export function ArtistCardComponent({ artist, locale }: Props) {
  return (
    <Link
      href={`/${locale}/@${artist.username}`}
      className="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Cover image — portrait orientation like editorial magazine */}
      <div className="relative aspect-[3/4] bg-[#F2EDE8] overflow-hidden">
        {artist.cover_url ? (
          <Image
            src={artist.cover_url}
            alt={`Portfolio của ${artist.display_name}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#E8C4B8] via-[#D4B8D4] to-[#B8D4C0]" />
        )}

        {/* Gradient overlay — always present for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Artist info overlaid on image */}
        <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
          {/* Specialty badges */}
          <div className="flex flex-wrap gap-1">
            {artist.specialties.map((s) => (
              <SpecialtyBadge key={s} specialty={s} size="sm" />
            ))}
          </div>

          {/* Name */}
          <p className="font-heading font-semibold text-sm text-white leading-snug">
            {artist.display_name}
          </p>

          {/* Location + rating row */}
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1 text-xs text-white/80">
              <MapPin className="w-3 h-3 shrink-0" />
              {getProvinceLabel(artist.city)}
            </p>
            {artist.avg_rating !== null && (
              <div className="flex items-center gap-1">
                <StarRating rating={artist.avg_rating} size="sm" />
                <span className="text-xs font-semibold text-white">{artist.avg_rating.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
