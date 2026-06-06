"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative mb-8">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#E8C4B8] via-[#D4B8D4] to-[#B8D4C0] opacity-30 blur-2xl absolute -inset-8" />
        <p className="relative text-6xl">⚠️</p>
      </div>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-3">
        Có lỗi xảy ra
      </h1>
      <p className="text-[#6B6560] max-w-sm mb-8 leading-relaxed">
        Đã xảy ra lỗi không mong muốn. Vui lòng thử lại hoặc quay về trang chủ.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-[#C9A96E] text-white rounded-xl font-medium hover:bg-[#B8925A] transition-colors"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 border border-[#E8E2DB] text-[#1C1C1C] rounded-xl font-medium hover:border-[#C9A96E] transition-colors"
        >
          Về trang chủ
        </Link>
      </div>

      <p className="mt-16 font-heading text-sm text-[#C9A96E] font-semibold">Showly</p>
    </div>
  );
}
