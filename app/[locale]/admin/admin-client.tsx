"use client";

import { useState, useTransition } from "react";
import { unflagReview, deleteReview, adminLogout } from "@/app/actions/admin";
import { StarRating } from "@/components/star-rating";

type Review = {
  id: string;
  rating: number | null;
  review_text: string | null;
  created_at: string | null;
  is_flagged: boolean | null;
  artist_profiles: {
    id: string;
    username: string;
    users: { display_name: string | null } | null;
  } | null;
  users: { display_name: string | null } | null;
};

export function AdminLogoutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={() => startTransition(async () => { await adminLogout(); window.location.reload(); })}
    >
      <button
        type="submit"
        disabled={pending}
        className="px-3 py-1.5 text-sm text-[#6B6560] hover:text-red-500 border border-[#E8E2DB] rounded-lg hover:border-red-300 transition-colors disabled:opacity-60"
      >
        {pending ? "..." : "Đăng xuất"}
      </button>
    </form>
  );
}

export function ReviewModerationCard({ review }: { review: Review }) {
  const [isPending, startTransition] = useTransition();
  const [dismissed, setDismissed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (dismissed) return null;

  const artistName =
    review.artist_profiles?.users?.display_name ??
    review.artist_profiles?.username ??
    "Unknown";
  const reviewerName = review.users?.display_name ?? "Ẩn danh";

  const handleUnflag = () => {
    startTransition(async () => {
      const res = await unflagReview(review.id);
      if (res.error) { setError(res.error); return; }
      setDismissed(true);
    });
  };

  const handleDelete = () => {
    if (!confirm("Xóa vĩnh viễn đánh giá này?")) return;
    startTransition(async () => {
      const res = await deleteReview(review.id);
      if (res.error) { setError(res.error); return; }
      setDismissed(true);
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-3">
      {/* Artist context */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs text-[#6B6560] uppercase tracking-wide">Nghệ sĩ</p>
          <p className="font-semibold text-[#1C1C1C]">{artistName}</p>
          <a
            href={`/@${review.artist_profiles?.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[#C9A96E] hover:underline"
          >
            @{review.artist_profiles?.username}
          </a>
        </div>
        <span className="shrink-0 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
          Bị báo cáo
        </span>
      </div>

      {/* Review content */}
      <div className="bg-[#FAFAF8] rounded-xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          {review.rating && <StarRating rating={review.rating} size="sm" />}
          <span className="text-xs text-[#6B6560]">
            {reviewerName} •{" "}
            {review.created_at
              ? new Date(review.created_at).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })
              : ""}
          </span>
        </div>
        {review.review_text ? (
          <p className="text-sm text-[#1C1C1C]">{review.review_text}</p>
        ) : (
          <p className="text-sm text-[#6B6560] italic">Không có nội dung</p>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={handleUnflag}
          disabled={isPending}
          className="flex-1 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-60"
        >
          {isPending ? "..." : "✓ Giữ lại"}
        </button>
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex-1 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60"
        >
          {isPending ? "..." : "🗑 Xóa"}
        </button>
      </div>
    </div>
  );
}

export function AdminLoginForm({ error }: { error?: string }) {
  const [pending, startTransition] = useTransition();
  const [formError, setFormError] = useState(error ?? "");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const { adminLogin } = await import("@/app/actions/admin");
      const res = await adminLogin(formData);
      if (res.error) { setFormError(res.error); return; }
      window.location.reload();
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-[#1C1C1C]">Showly Admin</h1>
          <p className="text-sm text-[#6B6560] mt-1">Khu vực quản trị nội bộ</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E2DB] p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-[#1C1C1C]">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoFocus
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2DB] bg-[#FAFAF8] text-sm text-[#1C1C1C] focus:outline-none focus:border-[#C9A96E] focus:ring-1 focus:ring-[#C9A96E]"
              placeholder="Nhập mật khẩu admin"
            />
          </div>

          {formError && (
            <p className="text-sm text-red-500">{formError}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full py-2.5 bg-[#C9A96E] text-white rounded-xl font-medium hover:bg-[#B8925A] transition-colors disabled:opacity-60"
          >
            {pending ? "Đang kiểm tra..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
