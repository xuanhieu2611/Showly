import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PortfolioManager } from "./portfolio-manager";

export default async function PortfolioPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("id, username, is_published")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!profile) redirect("/join");

  const { data: photos } = await supabase
    .from("portfolio_photos")
    .select("id, image_url, thumbnail_url, title, is_cover, sort_order")
    .eq("artist_id", profile.id)
    .order("sort_order", { ascending: true });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1C1C1C]">Quản lý ảnh</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {photos?.length ?? 0}/50 ảnh · Kéo thả để sắp xếp lại
          </p>
        </div>
      </div>
      <PortfolioManager
        artistId={profile.id}
        photos={photos ?? []}
        isPublished={profile.is_published ?? false}
      />
    </div>
  );
}
