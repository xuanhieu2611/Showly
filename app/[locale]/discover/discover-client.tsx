"use client";

import { useState, useCallback, useTransition, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { ArtistCardComponent } from "@/components/artist-card";
import { PROVINCES, getDistricts } from "@/lib/vietnam-locations";
import type { ArtistCard } from "@/app/api/artists/route";

const SPECIALTIES = [
  { value: "nail", label: "Nail Art" },
  { value: "makeup", label: "Trang điểm" },
  { value: "hair", label: "Làm tóc" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "rated", label: "Đánh giá cao nhất" },
  { value: "photos", label: "Nhiều ảnh nhất" },
];

type Props = {
  initialArtists: ArtistCard[];
  initialHasMore: boolean;
  initialTotal: number;
  locale: string;
  // Current URL filter state (from server)
  defaultQ: string;
  defaultSpecialties: string[];
  defaultCity: string;
  defaultDistrict: string;
  defaultSort: string;
};

export function DiscoverClient({
  initialArtists,
  initialHasMore,
  initialTotal,
  locale,
  defaultQ,
  defaultSpecialties,
  defaultCity,
  defaultDistrict,
  defaultSort,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Filter state — initialized from URL params
  const [q, setQ] = useState(defaultQ);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(defaultSpecialties);
  const [city, setCity] = useState(defaultCity);
  const [district, setDistrict] = useState(defaultDistrict);
  const [sort, setSort] = useState(defaultSort);

  // Artist list state
  const [artists, setArtists] = useState<ArtistCard[]>(initialArtists);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce search
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const buildQueryString = useCallback(
    (overrides: Record<string, string | string[]> = {}) => {
      const params = new URLSearchParams();
      const eff = {
        q: (overrides.q as string) ?? q,
        specialties: (overrides.specialties as string[]) ?? selectedSpecialties,
        city: (overrides.city as string) ?? city,
        district: (overrides.district as string) ?? district,
        sort: (overrides.sort as string) ?? sort,
      };
      if (eff.q) params.set("q", eff.q);
      for (const s of eff.specialties) params.append("specialty", s);
      if (eff.city) params.set("city", eff.city);
      if (eff.district) params.set("district", eff.district);
      if (eff.sort !== "newest") params.set("sort", eff.sort);
      return params.toString();
    },
    [q, selectedSpecialties, city, district, sort]
  );

  const fetchArtists = useCallback(
    async (overrides: Record<string, string | string[]> = {}, pageNum = 0) => {
      const params = new URLSearchParams();
      const eff = {
        q: (overrides.q as string) ?? q,
        specialties: (overrides.specialties as string[]) ?? selectedSpecialties,
        city: (overrides.city as string) ?? city,
        district: (overrides.district as string) ?? district,
        sort: (overrides.sort as string) ?? sort,
      };
      if (eff.q) params.set("q", eff.q);
      for (const s of eff.specialties) params.append("specialty", s);
      if (eff.city) params.set("city", eff.city);
      if (eff.district) params.set("district", eff.district);
      params.set("sort", eff.sort);
      params.set("page", String(pageNum));

      const res = await fetch(`/api/artists?${params.toString()}`);
      return res.json() as Promise<{ artists: ArtistCard[]; hasMore: boolean; total: number }>;
    },
    [q, selectedSpecialties, city, district, sort]
  );

  const applyFilters = useCallback(
    async (overrides: Record<string, string | string[]> = {}) => {
      // Update URL (shallow, no scroll)
      const qs = buildQueryString(overrides);
      startTransition(() => {
        router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
      });

      setLoading(true);
      setPage(0);
      try {
        const data = await fetchArtists(overrides, 0);
        setArtists(data.artists);
        setHasMore(data.hasMore);
        setTotal(data.total);
      } finally {
        setLoading(false);
      }
    },
    [buildQueryString, fetchArtists, pathname, router]
  );

  const handleSearch = (value: string) => {
    setQ(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      applyFilters({ q: value });
    }, 350);
  };

  const toggleSpecialty = (val: string) => {
    const next = selectedSpecialties.includes(val)
      ? selectedSpecialties.filter((s) => s !== val)
      : [...selectedSpecialties, val];
    setSelectedSpecialties(next);
    applyFilters({ specialties: next });
  };

  const handleCity = (val: string) => {
    setCity(val);
    setDistrict("");
    applyFilters({ city: val, district: "" });
  };

  const handleDistrict = (val: string) => {
    setDistrict(val);
    applyFilters({ district: val });
  };

  const handleSort = (val: string) => {
    setSort(val);
    applyFilters({ sort: val });
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    try {
      const data = await fetchArtists({}, nextPage);
      setArtists((prev) => [...prev, ...data.artists]);
      setHasMore(data.hasMore);
      setPage(nextPage);
    } finally {
      setLoadingMore(false);
    }
  };

  const clearFilters = () => {
    setQ("");
    setSelectedSpecialties([]);
    setCity("");
    setDistrict("");
    setSort("newest");
    applyFilters({ q: "", specialties: [], city: "", district: "", sort: "newest" });
  };

  const hasActiveFilters = q || selectedSpecialties.length > 0 || city || district || sort !== "newest";
  const districts = city ? getDistricts(city) : [];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E8E2DB] p-4 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
          <input
            type="search"
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm theo tên nghệ sĩ..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#E8E2DB] bg-[#FAFAF8] text-sm text-[#1C1C1C] placeholder:text-[#6B6560] focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]"
          />
        </div>

        {/* Specialty chips */}
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((s) => (
            <button
              key={s.value}
              onClick={() => toggleSpecialty(s.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                selectedSpecialties.includes(s.value)
                  ? "bg-[#1C1C1C] border-[#1C1C1C] text-white"
                  : "bg-white border-[#E8E2DB] text-[#6B6560] hover:border-[#1C1C1C] hover:text-[#1C1C1C]"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Location + Sort row */}
        <div className="flex flex-wrap gap-2">
          {/* City */}
          <select
            value={city}
            onChange={(e) => handleCity(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2 rounded-xl border border-[#E8E2DB] bg-[#FAFAF8] text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9A96E]"
          >
            <option value="">Tất cả thành phố</option>
            {PROVINCES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>

          {/* District — only shows when city selected */}
          {city && districts.length > 0 && (
            <select
              value={district}
              onChange={(e) => handleDistrict(e.target.value)}
              className="flex-1 min-w-[140px] px-3 py-2 rounded-xl border border-[#E8E2DB] bg-[#FAFAF8] text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9A96E]"
            >
              <option value="">Tất cả quận/huyện</option>
              {districts.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          )}

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => handleSort(e.target.value)}
            className="flex-1 min-w-[140px] px-3 py-2 rounded-xl border border-[#E8E2DB] bg-[#FAFAF8] text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9A96E]"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Clear filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-2 rounded-xl border border-[#E8E2DB] text-sm text-[#6B6560] hover:border-red-300 hover:text-red-500 transition-colors"
            >
              Xóa bộ lọc ×
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-[#6B6560]">
          {loading ? "Đang tìm kiếm..." : `${total.toLocaleString("vi-VN")} nghệ sĩ`}
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8E2DB] overflow-hidden animate-pulse">
              <div className="aspect-[4/3] bg-[#F2EDE8]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[#F2EDE8] rounded w-2/3" />
                <div className="h-4 bg-[#F2EDE8] rounded w-3/4" />
                <div className="h-3 bg-[#F2EDE8] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <p className="font-heading text-2xl text-[#1C1C1C]">Không tìm thấy nghệ sĩ nào</p>
          <p className="text-sm text-[#6B6560]">Hãy thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác.</p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="mt-2 px-4 py-2 bg-[#C9A96E] text-white rounded-xl text-sm font-medium hover:bg-[#B8925A] transition-colors"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {artists.map((artist) => (
              <ArtistCardComponent key={artist.id} artist={artist} locale={locale} />
            ))}
          </div>

          {/* Load more */}
          {hasMore && (
            <div className="flex justify-center pt-4">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="px-8 py-3 bg-white border-2 border-[#E8E2DB] text-[#1C1C1C] rounded-xl font-semibold hover:border-[#C9A96E] transition-colors disabled:opacity-60"
              >
                {loadingMore ? "Đang tải..." : "Tải thêm"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
