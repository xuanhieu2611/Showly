"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type ProfileUpdateData = {
  displayName: string;
  bio: string;
  city: string;
  district: string;
  priceRange: string;
  yearsExperience: string;
  instagramUrl: string;
  tiktokUrl: string;
  contactInfo: string;
  specialties: string[];
};

export async function updateProfile(data: ProfileUpdateData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return { error: "Không tìm thấy hồ sơ" };

  const { error } = await supabase
    .from("artist_profiles")
    .update({
      bio: data.bio || null,
      city: data.city,
      district: data.district,
      price_range: data.priceRange || null,
      years_experience: data.yearsExperience || null,
      instagram_url: data.instagramUrl || null,
      tiktok_url: data.tiktokUrl || null,
      contact_info: data.contactInfo || null,
    })
    .eq("id", profile.id);

  if (error) return { error: error.message };

  await supabase.from("users").update({ display_name: data.displayName }).eq("id", user.id);

  // Re-sync specialties
  await supabase.from("specialties").delete().eq("artist_id", profile.id);
  if (data.specialties.length > 0) {
    await supabase.from("specialties").insert(
      data.specialties.map((s) => ({ artist_id: profile.id, specialty: s }))
    );
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/edit");
  return { success: true };
}

export async function deletePhoto(photoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: photo } = await supabase
    .from("portfolio_photos")
    .select("image_url, artist_id")
    .eq("id", photoId)
    .single();

  if (!photo) return { error: "Không tìm thấy ảnh" };

  // Verify ownership
  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("id", photo.artist_id ?? "")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return { error: "Không có quyền" };

  // Extract storage path from URL
  const url = new URL(photo.image_url);
  const path = url.pathname.replace(/^\/storage\/v1\/object\/public\/portfolio\//, "");
  await supabase.storage.from("portfolio").remove([path]);
  await supabase.from("portfolio_photos").delete().eq("id", photoId);

  revalidatePath("/dashboard/portfolio");
  return { success: true };
}

export async function updatePhotoOrder(photoIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await Promise.all(
    photoIds.map((id, index) =>
      supabase.from("portfolio_photos").update({ sort_order: index }).eq("id", id)
    )
  );

  revalidatePath("/dashboard/portfolio");
  return { success: true };
}

export async function setCoverPhoto(photoId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: photo } = await supabase
    .from("portfolio_photos")
    .select("artist_id")
    .eq("id", photoId)
    .single();

  if (!photo) return { error: "Không tìm thấy ảnh" };

  // Verify ownership
  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("id", photo.artist_id ?? "")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) return { error: "Không có quyền" };

  // Unset all existing cover photos for this artist, then set the new one
  await supabase
    .from("portfolio_photos")
    .update({ is_cover: false })
    .eq("artist_id", photo.artist_id ?? "");

  await supabase
    .from("portfolio_photos")
    .update({ is_cover: true })
    .eq("id", photoId);

  revalidatePath("/dashboard/portfolio");
  return { success: true };
}
