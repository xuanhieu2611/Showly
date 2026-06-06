import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://showly.vn";

function u(path: string) {
  return `${SITE_URL}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: profiles } = await supabase
    .from("artist_profiles")
    .select("username, updated_at")
    .eq("is_published", true)
    .order("updated_at", { ascending: false });

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: u("/vi"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
      alternates: {
        languages: { vi: u("/vi"), en: u("/en") },
      },
    },
    {
      url: u("/vi/discover"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
      alternates: {
        languages: { vi: u("/vi/discover"), en: u("/en/discover") },
      },
    },
  ];

  const profilePages: MetadataRoute.Sitemap = (profiles ?? []).map((profile) => ({
    url: u(`/vi/@${profile.username}`),
    lastModified: profile.updated_at ? new Date(profile.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: {
      languages: {
        vi: u(`/vi/@${profile.username}`),
        en: u(`/en/@${profile.username}`),
      },
    },
  }));

  return [...staticPages, ...profilePages];
}
