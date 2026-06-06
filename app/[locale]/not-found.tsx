import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center">
      {/* Decorative gradient blob */}
      <div className="relative mb-8">
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-[#E8C4B8] via-[#D4B8D4] to-[#B8D4C0] opacity-40 blur-2xl absolute -inset-8" />
        <p className="relative text-7xl font-heading font-bold text-[#C9A96E]">404</p>
      </div>

      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#1C1C1C] mb-3">
        Trang không tồn tại
      </h1>
      <p className="text-[#6B6560] max-w-sm mb-8 leading-relaxed">
        Trang bạn đang tìm không còn ở đây. Có thể đường link đã thay đổi hoặc nghệ sĩ chưa công bố hồ sơ.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-[#C9A96E] text-white rounded-xl font-medium hover:bg-[#B8925A] transition-colors"
        >
          Về trang chủ
        </Link>
        <Link
          href="/discover"
          className="px-6 py-2.5 border border-[#E8E2DB] text-[#1C1C1C] rounded-xl font-medium hover:border-[#C9A96E] transition-colors"
        >
          Khám phá nghệ sĩ →
        </Link>
      </div>

      {/* Showly branding */}
      <p className="mt-16 font-heading text-sm text-[#C9A96E] font-semibold">Showly</p>
    </div>
  );
}
