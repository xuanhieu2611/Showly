import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SpecialtyBadge } from "@/components/specialty-badge";
import { StarRating } from "@/components/star-rating";
import { getProvinceLabel, getDistrictLabel } from "@/lib/vietnam-locations";
import { CopyLinkButton } from "./copy-link-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("*, specialties(specialty)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/join");

  const { count: photoCount } = await supabase
    .from("portfolio_photos")
    .select("id", { count: "exact", head: true })
    .eq("artist_id", profile.id);

  const { count: viewCount } = await supabase
    .from("profile_views")
    .select("id", { count: "exact", head: true })
    .eq("artist_id", profile.id);

  const { data: allReviews } = await supabase
    .from("reviews")
    .select("id, rating, review_text, created_at, is_flagged")
    .eq("artist_id", profile.id)
    .order("created_at", { ascending: false });

  const unflaggedReviews = allReviews?.filter((r) => !r.is_flagged) ?? [];

  const avgRating =
    unflaggedReviews.length > 0
      ? unflaggedReviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / unflaggedReviews.length
      : null;

  const profileUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://showly.vn"}/@${profile.username}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1C1C1C]">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Xin chào, {user.user_metadata?.full_name ?? profile.username} 👋
          </p>
        </div>
        <div className="flex gap-2">
          <CopyLinkButton url={profileUrl} />
          <Link
            href={`/@${profile.username}`}
            className="px-4 py-2 bg-[#C9A96E] text-white rounded-lg text-sm font-medium hover:bg-[#B8925A] transition-colors"
            target="_blank"
          >
            Xem hồ sơ ↗
          </Link>
        </div>
      </div>

      {/* Status banner if draft */}
      {!profile.is_published && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-amber-600 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-medium text-amber-800">Hồ sơ chưa công bố</p>
            <p className="text-xs text-amber-600 mt-0.5">
              Tải lên ít nhất 3 ảnh để kích hoạt hồ sơ công khai.{" "}
              <Link href="/dashboard/portfolio" className="underline">Tải ảnh ngay</Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Lượt xem hồ sơ" value={viewCount ?? 0} icon="👁️" />
        <StatCard label="Ảnh portfolio" value={photoCount ?? 0} icon="📸" />
        <StatCard
          label="Đánh giá TB"
          value={avgRating ? `${avgRating.toFixed(1)} ⭐` : "—"}
          icon="⭐"
        />
        <StatCard
          label="Trạng thái"
          value={profile.is_published ? "Công khai" : "Nháp"}
          icon={profile.is_published ? "✅" : "🔒"}
        />
      </div>

      {/* Profile summary */}
      <div className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1C1C1C]">Hồ sơ của bạn</h2>
          <Link href="/dashboard/edit" className="text-sm text-[#C9A96E] hover:underline">
            Chỉnh sửa →
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <Row label="URL" value={`showly.vn/@${profile.username}`} mono />
          <Row
            label="Chuyên môn"
            value={
              <div className="flex gap-1 flex-wrap">
                {(profile.specialties as { specialty: string }[]).map((s) => (
                  <SpecialtyBadge key={s.specialty} specialty={s.specialty} size="sm" />
                ))}
              </div>
            }
          />
          <Row
            label="Vị trí"
            value={`${getDistrictLabel(profile.city, profile.district)}, ${getProvinceLabel(profile.city)}`}
          />
          {profile.bio && <Row label="Bio" value={profile.bio} />}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickCard href="/dashboard/portfolio" icon="📸" title="Quản lý ảnh" desc="Tải lên, sắp xếp, xóa ảnh" />
        <QuickCard href="/dashboard/edit" icon="✏️" title="Chỉnh sửa hồ sơ" desc="Cập nhật thông tin, liên hệ" />
        <QuickCard href="/dashboard/analytics" icon="📊" title="Thống kê" desc="Lượt xem theo ngày" />
      </div>

      {/* Reviews received */}
      <div className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1C1C1C]">
            Đánh giá nhận được
            {unflaggedReviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-[#6B6560]">
                ({unflaggedReviews.length})
              </span>
            )}
          </h2>
          {avgRating && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={avgRating} size="sm" />
              <span className="text-sm font-semibold text-[#1C1C1C]">{avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {unflaggedReviews.length === 0 ? (
          <p className="text-sm text-[#6B6560] py-4 text-center">
            Chưa có đánh giá nào. Chia sẻ hồ sơ của bạn để nhận đánh giá đầu tiên!
          </p>
        ) : (
          <div className="space-y-3">
            {unflaggedReviews.map((review) => (
              <div
                key={review.id}
                className="flex gap-3 py-3 border-b border-[#F2EDE8] last:border-0"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating ?? 0} size="sm" />
                    <span className="text-xs text-[#6B6560]">
                      {review.created_at
                        ? new Date(review.created_at).toLocaleDateString("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })
                        : ""}
                    </span>
                  </div>
                  {review.review_text && (
                    <p className="text-sm text-[#1C1C1C]">{review.review_text}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {(allReviews?.filter((r) => r.is_flagged) ?? []).length > 0 && (
          <p className="text-xs text-[#6B6560] border-t border-[#F2EDE8] pt-3">
            {allReviews!.filter((r) => r.is_flagged).length} đánh giá đang chờ kiểm duyệt.
          </p>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2DB] p-4 space-y-1">
      <span className="text-2xl">{icon}</span>
      <p className="text-xl font-bold text-[#1C1C1C]">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex gap-2">
      <span className="text-muted-foreground w-24 shrink-0">{label}</span>
      <span className={`text-[#1C1C1C] ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}

function QuickCard({ href, icon, title, desc }: { href: string; icon: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="bg-white rounded-2xl border border-[#E8E2DB] p-5 hover:border-[#C9A96E] hover:shadow-sm transition-all group space-y-1"
    >
      <span className="text-2xl">{icon}</span>
      <p className="font-semibold text-sm text-[#1C1C1C] group-hover:text-[#C9A96E] transition-colors">{title}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </Link>
  );
}
