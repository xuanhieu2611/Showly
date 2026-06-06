"use server";

import { cookies } from "next/headers";
import { createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_COOKIE = "showly_admin";

export async function adminLogin(formData: FormData): Promise<{ error?: string }> {
  const password = formData.get("password") as string;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) return { error: "Admin not configured" };
  if (password !== adminPassword) return { error: "Mật khẩu không đúng" };

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, adminPassword, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });

  return {};
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_COOKIE)?.value === adminPassword;
}

export async function getFlaggedReviews() {
  const supabase = await createAdminClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, rating, review_text, created_at, is_flagged,
      artist_profiles!reviews_artist_id_fkey (
        id, username,
        users!artist_profiles_user_id_fkey ( display_name )
      ),
      users!reviews_reviewer_id_fkey ( display_name )
    `)
    .eq("is_flagged", true)
    .order("created_at", { ascending: false });

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function unflagReview(reviewId: string): Promise<{ error?: string }> {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("reviews")
    .update({ is_flagged: false })
    .eq("id", reviewId);

  if (error) return { error: error.message };
  revalidatePath("/vi/admin");
  revalidatePath("/en/admin");
  return {};
}

export async function deleteReview(reviewId: string): Promise<{ error?: string }> {
  const supabase = await createAdminClient();

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId);

  if (error) return { error: error.message };
  revalidatePath("/vi/admin");
  revalidatePath("/en/admin");
  return {};
}
