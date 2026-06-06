"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitReview(
  artistId: string,
  artistUsername: string,
  rating: number,
  reviewText: string
): Promise<{ error?: string }> {
  if (rating < 1 || rating > 5) return { error: "Vui lòng chọn số sao (1–5)" };
  if (reviewText.length > 150) return { error: "Nhận xét tối đa 150 ký tự" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập để đánh giá" };

  // Prevent self-review
  const { data: ownProfile } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("user_id", user.id)
    .eq("id", artistId)
    .maybeSingle();
  if (ownProfile) return { error: "Bạn không thể tự đánh giá hồ sơ của mình" };

  const { error } = await supabase.from("reviews").insert({
    artist_id: artistId,
    reviewer_id: user.id,
    rating,
    review_text: reviewText.trim() || null,
  });

  if (error) {
    if (error.code === "23505") return { error: "Bạn đã đánh giá nghệ sĩ này rồi" };
    return { error: error.message };
  }

  revalidatePath(`/vi/@${artistUsername}`);
  revalidatePath(`/en/@${artistUsername}`);
  return {};
}

export async function flagReview(
  reviewId: string,
  artistUsername: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Bạn cần đăng nhập" };

  const { error } = await supabase
    .from("reviews")
    .update({ is_flagged: true })
    .eq("id", reviewId);

  if (error) return { error: error.message };

  revalidatePath(`/vi/@${artistUsername}`);
  revalidatePath(`/en/@${artistUsername}`);
  return {};
}
