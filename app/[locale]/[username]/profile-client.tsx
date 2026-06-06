"use client";

import { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { Phone, Share2 } from "lucide-react";
import { StarPicker } from "@/components/star-picker";
import { StarRating } from "@/components/star-rating";
import { submitReview, flagReview } from "@/app/actions/reviews";

// ---------------------------------------------------------------------------
// Profile view recorder
// ---------------------------------------------------------------------------

export function ProfileViewRecorder({ artistId }: { artistId: string }) {
  useEffect(() => {
    fetch("/api/profile-view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId }),
    }).catch(() => {});
  }, [artistId]);

  return null;
}

// ---------------------------------------------------------------------------
// Contact reveal button
// ---------------------------------------------------------------------------

export function ContactRevealButton({
  artistId,
  hasContact,
}: {
  artistId: string;
  hasContact: boolean;
}) {
  const [contactInfo, setContactInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!hasContact) return null;

  const handleReveal = async () => {
    if (contactInfo) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/contact-info/${artistId}`);
      const data = await res.json();
      setContactInfo(data.contact_info);
    } finally {
      setLoading(false);
    }
  };

  if (contactInfo) {
    return (
      <a
        href={`tel:${contactInfo.replace(/\s/g, "")}`}
        className="flex items-center gap-2 px-5 py-3 bg-[#C9A96E] text-white rounded-xl font-semibold hover:bg-[#B8925A] transition-colors"
      >
        <Phone className="w-4 h-4" /> {contactInfo}
      </a>
    );
  }

  return (
    <button
      onClick={handleReveal}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-3 bg-[#C9A96E] text-white rounded-xl font-semibold hover:bg-[#B8925A] transition-colors disabled:opacity-70"
    >
      <Phone className="w-4 h-4" />
      {loading ? "Đang tải..." : "Xem liên hệ"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Share button
// ---------------------------------------------------------------------------

export function ShareButton({ url, username }: { url: string; username: string }) {
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Đã sao chép link hồ sơ!", { duration: 2000 });
    } catch {
      toast.error("Không thể sao chép");
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-5 py-3 border-2 border-[#E8E2DB] text-[#1C1C1C] rounded-xl font-semibold hover:border-[#C9A96E] transition-colors"
      aria-label={`Sao chép link hồ sơ @${username}`}
    >
      <Share2 className="w-4 h-4" /> Chia sẻ
    </button>
  );
}

// ---------------------------------------------------------------------------
// Flag button — lets any logged-in user report a review
// ---------------------------------------------------------------------------

export function FlagButton({
  reviewId,
  artistUsername,
}: {
  reviewId: string;
  artistUsername: string;
}) {
  const [flagged, setFlagged] = useState(false);
  const [pending, startTransition] = useTransition();

  const handleFlag = () => {
    startTransition(async () => {
      const result = await flagReview(reviewId, artistUsername);
      if (result.error) {
        toast.error(result.error);
      } else {
        setFlagged(true);
        toast.success("Đã báo cáo đánh giá. Cảm ơn bạn!");
      }
    });
  };

  if (flagged) {
    return <span className="text-xs text-[#6B6560] italic">Đã báo cáo</span>;
  }

  return (
    <button
      onClick={handleFlag}
      disabled={pending}
      className="text-xs text-[#6B6560] hover:text-red-500 transition-colors disabled:opacity-50"
      title="Báo cáo đánh giá này"
    >
      {pending ? "..." : "Báo cáo"}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Review form — shown on the artist's public profile
// ---------------------------------------------------------------------------

type ReviewFormProps = {
  artistId: string;
  artistUsername: string;
  /** null = not logged in, string = logged-in user id */
  currentUserId: string | null;
  isOwnProfile: boolean;
  hasReviewed: boolean;
  loginPath: string;
};

export function ReviewFormSection({
  artistId,
  artistUsername,
  currentUserId,
  isOwnProfile,
  hasReviewed,
  loginPath,
}: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Artist viewing their own profile — no form
  if (isOwnProfile) return null;

  // Not logged in — prompt to sign in
  if (!currentUserId) {
    return (
      <div className="mt-6 bg-[#F2EDE8] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-[#1C1C1C]">Bạn đã từng dùng dịch vụ này?</p>
          <p className="text-xs text-[#6B6560] mt-0.5">Đăng nhập để để lại đánh giá cho nghệ sĩ.</p>
        </div>
        <Link
          href={loginPath}
          className="shrink-0 px-4 py-2 bg-[#C9A96E] text-white text-sm font-semibold rounded-xl hover:bg-[#B8925A] transition-colors"
        >
          Đăng nhập
        </Link>
      </div>
    );
  }

  // Already reviewed
  if (hasReviewed || submitted) {
    return (
      <div className="mt-6 bg-[#F2EDE8] rounded-2xl p-4 flex items-center gap-3">
        <span className="text-xl">✅</span>
        <p className="text-sm text-[#1C1C1C]">Bạn đã đánh giá nghệ sĩ này rồi. Cảm ơn!</p>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Vui lòng chọn số sao");
      return;
    }

    startTransition(async () => {
      const result = await submitReview(artistId, artistUsername, rating, text);
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
        toast.success("Đánh giá của bạn đã được gửi!");
      }
    });
  };

  return (
    <div className="mt-6 bg-white border border-[#E8E2DB] rounded-2xl p-5">
      <h3 className="font-semibold text-[#1C1C1C] text-sm mb-4">Viết đánh giá của bạn</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <StarPicker value={rating} onChange={setRating} />
        </div>

        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={150}
            placeholder="Chia sẻ trải nghiệm của bạn... (không bắt buộc)"
            rows={3}
            className="w-full text-sm border border-[#E8E2DB] rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A96E]/40 focus:border-[#C9A96E] bg-[#FAFAF8] placeholder:text-[#B0A99E]"
          />
          <p className="text-right text-xs text-[#6B6560] mt-1">{text.length}/150</p>
        </div>

        {error && <p className="text-xs text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="w-full sm:w-auto px-6 py-2.5 bg-[#C9A96E] text-white text-sm font-semibold rounded-xl hover:bg-[#B8925A] transition-colors disabled:opacity-60"
        >
          {pending ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Reviews list — renders reviews with optional flag buttons
// ---------------------------------------------------------------------------

type Review = {
  id: string;
  rating: number | null;
  review_text: string | null;
  created_at: string | null;
};

export function ReviewsList({
  reviews,
  artistUsername,
  isLoggedIn,
}: {
  reviews: Review[];
  artistUsername: string;
  isLoggedIn: boolean;
}) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-10 text-[#6B6560]">
        <p className="text-xs uppercase tracking-widest mb-2 text-[#C9A96E]">Chưa có đánh giá</p>
        <p className="text-sm">Hãy là người đầu tiên đánh giá nghệ sĩ này.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {reviews.map((review) => (
        <div
          key={review.id}
          className="bg-white rounded-2xl border border-[#E8E2DB] p-4 space-y-2"
        >
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating ?? 0} size="sm" />
            <span className="text-xs text-[#6B6560] ml-auto">
              {review.created_at
                ? new Date(review.created_at).toLocaleDateString("vi-VN")
                : ""}
            </span>
          </div>
          {review.review_text && (
            <p className="text-sm text-[#1C1C1C]">{review.review_text}</p>
          )}
          {isLoggedIn && (
            <div className="flex justify-end pt-1">
              <FlagButton reviewId={review.id} artistUsername={artistUsername} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
