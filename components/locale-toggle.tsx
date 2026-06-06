"use client";

import { useRouter, usePathname } from "next/navigation";

export function LocaleToggle({ locale }: { locale: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: string) => {
    // Replace the locale segment in the current path
    const newPath = pathname.replace(/^\/(vi|en)/, `/${next}`);
    router.push(newPath);
  };

  return (
    <div className="flex items-center text-xs font-medium text-[#6B6560]">
      <button
        onClick={() => switchTo("vi")}
        className={`px-1.5 py-0.5 transition-colors ${locale === "vi" ? "text-[#1C1C1C] font-semibold" : "hover:text-[#1C1C1C]"}`}
        aria-label="Tiếng Việt"
      >
        VI
      </button>
      <span className="opacity-30">|</span>
      <button
        onClick={() => switchTo("en")}
        className={`px-1.5 py-0.5 transition-colors ${locale === "en" ? "text-[#1C1C1C] font-semibold" : "hover:text-[#1C1C1C]"}`}
        aria-label="English"
      >
        EN
      </button>
    </div>
  );
}
