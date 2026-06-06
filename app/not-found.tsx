import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 text-center font-sans">
      <p className="text-7xl font-bold text-[#C9A96E] mb-4">404</p>
      <h1 className="text-2xl font-bold text-[#1C1C1C] mb-3">Trang không tồn tại</h1>
      <p className="text-[#6B6560] mb-8 max-w-sm">
        Trang bạn đang tìm không còn ở đây.
      </p>
      <Link
        href="/"
        className="px-6 py-2.5 bg-[#C9A96E] text-white rounded-xl font-medium hover:bg-[#B8925A] transition-colors"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
