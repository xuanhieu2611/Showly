import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./edit-profile-form";

export default async function EditProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("*, specialties(specialty)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/join");

  const { data: userData } = await supabase
    .from("users")
    .select("display_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-[#1C1C1C]">Chỉnh sửa hồ sơ</h1>
        <p className="text-muted-foreground text-sm mt-1">Thông tin hiển thị trên trang portfolio công khai</p>
      </div>
      <EditProfileForm
        profile={profile}
        displayName={userData?.display_name ?? ""}
        specialties={(profile.specialties as { specialty: string }[]).map((s) => s.specialty)}
      />
    </div>
  );
}
