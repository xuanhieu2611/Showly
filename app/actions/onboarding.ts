"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export type OnboardingData = {
  username: string;
  displayName: string;
  specialties: string[];
  city: string;
  district: string;
};

export async function createArtistProfile(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Return existing profile if the user already went through this step
  const { data: existing } = await supabase
    .from("artist_profiles")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) return { profileId: existing.id };

  const { data: profile, error } = await supabase
    .from("artist_profiles")
    .insert({
      user_id: user.id,
      username: data.username.toLowerCase(),
      city: data.city,
      district: data.district,
      is_published: false,
    })
    .select("id")
    .single();

  if (error) {
    return { error: error.message };
  }

  // Insert specialties
  if (data.specialties.length > 0) {
    const { error: specialtyError } = await supabase.from("specialties").insert(
      data.specialties.map((s) => ({ artist_id: profile.id, specialty: s }))
    );
    if (specialtyError) return { error: specialtyError.message };
  }

  // Update display name on the user row (non-critical, don't fail on error)
  if (data.displayName) {
    await supabase
      .from("users")
      .update({ display_name: data.displayName })
      .eq("id", user.id);
  }

  return { profileId: profile.id };
}

export async function uploadPortfolioPhoto(
  artistId: string,
  formData: FormData
): Promise<{ error?: string; photo?: { id: string; image_url: string; thumbnail_url: string } }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Chưa đăng nhập" };

  const file = formData.get("file") as File | null;
  if (!file) return { error: "Không có file" };

  if (file.size > 10 * 1024 * 1024) return { error: "File quá lớn (tối đa 10MB)" };
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return { error: "Chỉ chấp nhận JPG, PNG, WEBP" };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${user.id}/${Date.now()}.${ext}`;

  const { data: upload, error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("portfolio")
    .getPublicUrl(upload.path);

  // Thumbnail via Supabase image transformation
  const thumbnailUrl = `${publicUrl}?width=400&quality=80`;

  // Get current max sort_order
  const { data: photos } = await supabase
    .from("portfolio_photos")
    .select("sort_order")
    .eq("artist_id", artistId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (photos?.[0]?.sort_order ?? -1) + 1;

  const { data: photo, error: dbError } = await supabase
    .from("portfolio_photos")
    .insert({
      artist_id: artistId,
      image_url: publicUrl,
      thumbnail_url: thumbnailUrl,
      sort_order: nextOrder,
      is_cover: nextOrder === 0,
    })
    .select("id, image_url, thumbnail_url")
    .single();

  if (dbError) return { error: dbError.message };

  return { photo };
}

export async function publishProfile(
  artistId: string
): Promise<{ redirect: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { redirect: "/login" };

  // Require at least 3 photos
  const { count } = await supabase
    .from("portfolio_photos")
    .select("id", { count: "exact", head: true })
    .eq("artist_id", artistId);

  if (!count || count < 3) {
    return { error: "Cần ít nhất 3 ảnh để công bố hồ sơ" };
  }

  await supabase
    .from("artist_profiles")
    .update({ is_published: true })
    .eq("id", artistId)
    .eq("user_id", user.id);

  return { redirect: "/dashboard" };
}
