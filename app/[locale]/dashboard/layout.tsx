import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/logout-button";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("artist_profiles")
    .select("username")
    .eq("user_id", user.id)
    .maybeSingle();

  const displayName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email ??
    "Artist";

  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-[#E8E2DB] sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="font-heading text-xl font-bold text-[#1C1C1C]">
            Showly
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <NavLink href="/dashboard">Dashboard</NavLink>
            <NavLink href="/dashboard/edit">Hồ sơ</NavLink>
            <NavLink href="/dashboard/portfolio">Ảnh</NavLink>
            <NavLink href="/dashboard/analytics">Thống kê</NavLink>
            {profile?.username && (
              <Link
                href={`/@${profile.username}`}
                className="ml-2 px-3 py-1.5 bg-[#C9A96E] text-white rounded-lg text-sm font-medium hover:bg-[#B8925A] transition-colors"
                target="_blank"
              >
                Xem hồ sơ ↗
              </Link>
            )}
            <div className="flex items-center gap-2 ml-3 pl-3 border-l border-[#E8E2DB]">
              <div className="w-7 h-7 rounded-full bg-[#C9A96E] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
                {initials}
              </div>
              <LogoutButton label="Đăng xuất" />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-lg text-[#6B6560] hover:text-[#1C1C1C] hover:bg-[#F2EDE8] transition-colors"
    >
      {children}
    </Link>
  );
}
