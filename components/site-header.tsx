import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { LocaleToggle } from "./locale-toggle";

interface SiteHeaderProps {
  locale: string;
  /** Apply glass effect (used on artist profile page) */
  transparent?: boolean;
}

export async function SiteHeader({ locale, transparent = false }: SiteHeaderProps) {
  const t = await getTranslations("nav");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let username: string | null = null;
  let accountType: string | null = null;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select("account_type")
      .eq("id", user.id)
      .maybeSingle();
    accountType = userData?.account_type ?? null;

    if (accountType === "artist") {
      const { data: profile } = await supabase
        .from("artist_profiles")
        .select("username")
        .eq("user_id", user.id)
        .maybeSingle();
      username = profile?.username ?? null;
    }
  }

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    null;

  const initials = displayName
    ? displayName
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : null;

  const headerClass = transparent
    ? "bg-white/80 backdrop-blur-sm border-b border-[#E8E2DB] sticky top-0 z-10"
    : "bg-white border-b border-[#E8E2DB] sticky top-0 z-10";

  return (
    <header className={headerClass}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link
          href={`/${locale}`}
          className="font-heading text-xl italic tracking-wide text-[#1C1C1C]"
        >
          Showly
        </Link>

        <nav className="flex items-center gap-1 text-sm">
          <Link
            href={`/${locale}/discover`}
            className="px-3 py-1.5 rounded-lg text-[#6B6560] hover:text-[#1C1C1C] hover:bg-[#F2EDE8] transition-colors"
          >
            {t("discover")}
          </Link>

          {user ? (
            <>
              {accountType === "artist" && username && (
                <Link
                  href={`/${locale}/dashboard`}
                  className="px-3 py-1.5 rounded-lg text-[#6B6560] hover:text-[#1C1C1C] hover:bg-[#F2EDE8] transition-colors"
                >
                  {t("dashboard")}
                </Link>
              )}
              {accountType === "artist" && !username && (
                <Link
                  href={`/${locale}/join`}
                  className="px-3 py-1.5 rounded-lg text-[#6B6560] hover:text-[#1C1C1C] hover:bg-[#F2EDE8] transition-colors"
                >
                  {t("create_portfolio")}
                </Link>
              )}
              <div className="flex items-center gap-2 ml-2">
                <Link
                  href={`/${locale}/dashboard`}
                  title={displayName ?? "Dashboard"}
                  className="w-8 h-8 rounded-full bg-[#C9A96E] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0 hover:bg-[#B8925A] transition-colors"
                >
                  {initials ?? "U"}
                </Link>
                <LogoutButton label={t("logout")} />
              </div>
            </>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="ml-2 px-4 py-1.5 bg-[#C9A96E] text-white rounded-lg font-medium hover:bg-[#B8925A] transition-colors"
            >
              {t("login")}
            </Link>
          )}

          <div className="ml-2 pl-2 border-l border-[#E8E2DB]">
            <LocaleToggle locale={locale} />
          </div>
        </nav>
      </div>
    </header>
  );
}
