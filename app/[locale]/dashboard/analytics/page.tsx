import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/join");

  // Total views
  const { count: totalViews } = await supabase
    .from("profile_views")
    .select("id", { count: "exact", head: true })
    .eq("artist_id", profile.id);

  // Views last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: weekViews } = await supabase
    .from("profile_views")
    .select("id", { count: "exact", head: true })
    .eq("artist_id", profile.id)
    .gte("viewed_at", sevenDaysAgo);

  // Views last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count: monthViews } = await supabase
    .from("profile_views")
    .select("id", { count: "exact", head: true })
    .eq("artist_id", profile.id)
    .gte("viewed_at", thirtyDaysAgo);

  // Reviews
  const { data: reviews } = await supabase
    .from("reviews")
    .select("rating, review_text, created_at")
    .eq("artist_id", profile.id)
    .order("created_at", { ascending: false });

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / reviews.length
      : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#1C1C1C]">Thống kê</h1>
        <p className="text-muted-foreground text-sm mt-1">Lượt xem hồ sơ và đánh giá của bạn</p>
      </div>

      {/* View stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Tổng lượt xem" value={totalViews ?? 0} />
        <StatCard label="7 ngày qua" value={weekViews ?? 0} />
        <StatCard label="30 ngày qua" value={monthViews ?? 0} />
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[#1C1C1C]">Đánh giá nhận được</h2>
          {avgRating && (
            <span className="text-sm font-medium text-[#C9A96E]">
              ⭐ {avgRating.toFixed(1)} ({reviews?.length} đánh giá)
            </span>
          )}
        </div>

        {!reviews || reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Chưa có đánh giá nào. Chia sẻ hồ sơ để nhận đánh giá đầu tiên!
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="border border-[#E8E2DB] rounded-xl p-3 space-y-1">
                <div className="flex items-center gap-2">
                  <span>{"⭐".repeat(r.rating ?? 0)}</span>
                  <span className="text-xs text-muted-foreground">
                    {r.created_at
                      ? new Date(r.created_at).toLocaleDateString("vi-VN")
                      : ""}
                  </span>
                </div>
                {r.review_text && (
                  <p className="text-sm text-[#1C1C1C]">{r.review_text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8E2DB] p-4 text-center space-y-1">
      <p className="text-2xl font-bold text-[#1C1C1C]">{value.toLocaleString("vi-VN")}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
