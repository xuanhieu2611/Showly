import type { Metadata } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { SiteHeader } from "@/components/site-header";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://showly.vn";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === "vi";

  const title = isVi
    ? "Showly — Portfolio cho Beauty Artists Việt Nam"
    : "Showly — Portfolio Platform for Vietnamese Beauty Artists";
  const description = isVi
    ? "Nền tảng portfolio và khám phá beauty artists hàng đầu Việt Nam. Tạo trang cá nhân tại showly.vn/@tên-của-bạn và chia sẻ lên TikTok, Instagram ngay hôm nay."
    : "Vietnam's #1 portfolio platform for nail artists, makeup artists, and hairstylists. Create your professional page at showly.vn/@yourname.";

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: {
        vi: `${SITE_URL}/vi`,
        en: `${SITE_URL}/en`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}`,
      siteName: "Showly",
      locale: isVi ? "vi_VN" : "en_US",
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen bg-background">
      <SiteHeader locale={locale} />
      <HeroSection locale={locale} />
    </main>
  );
}

function HeroSection({ locale }: { locale: string }) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const t = useTranslations("home");

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-4 text-center">
      <h1 className="font-heading text-4xl md:text-6xl font-bold text-near-black mb-4">
        {t("headline")}
      </h1>
      <p className="text-muted-foreground text-lg max-w-md mb-8">
        {t("subheadline")}
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={`/${locale}/join`}
          className="bg-gold text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          {t("cta_artist")}
        </Link>
        <Link
          href={`/${locale}/discover`}
          className="border border-gold text-gold px-8 py-3 rounded-lg font-semibold hover:bg-blush transition-colors"
        >
          {t("cta_discover")}
        </Link>
      </div>
    </section>
  );
}
