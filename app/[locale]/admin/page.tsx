import { isAdminAuthenticated, getFlaggedReviews } from "@/app/actions/admin";
import { AdminLoginForm, AdminLogoutButton, ReviewModerationCard } from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return <AdminLoginForm />;
  }

  const { data: reviews, error } = await getFlaggedReviews();

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      {/* Header */}
      <header className="bg-white border-b border-[#E8E2DB] sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-heading text-xl font-bold text-[#1C1C1C]">Showly</span>
            <span className="px-2 py-0.5 bg-[#F2EDE8] text-[#7A3F30] text-xs font-medium rounded-full">Admin</span>
          </div>
          <AdminLogoutButton />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Page title */}
        <div>
          <h1 className="font-heading text-2xl font-bold text-[#1C1C1C]">Kiểm duyệt nội dung</h1>
          <p className="text-sm text-[#6B6560] mt-1">
            Xem xét và xử lý các đánh giá bị báo cáo.
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#E8E2DB] p-4">
            <p className="text-2xl font-bold text-[#1C1C1C]">{reviews?.length ?? 0}</p>
            <p className="text-xs text-[#6B6560] mt-0.5">Đánh giá cần xử lý</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#E8E2DB] p-4">
            <p className="text-2xl font-bold text-green-600">
              {reviews?.length === 0 ? "✓" : "—"}
            </p>
            <p className="text-xs text-[#6B6560] mt-0.5">Trạng thái hàng đợi</p>
          </div>
        </div>

        {/* Flagged reviews section */}
        <section>
          <h2 className="font-semibold text-[#1C1C1C] mb-4">
            Đánh giá bị báo cáo
            {reviews && reviews.length > 0 && (
              <span className="ml-2 text-sm font-normal text-red-500">({reviews.length})</span>
            )}
          </h2>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-medium">Lỗi tải dữ liệu</p>
              <p className="text-sm text-red-400 mt-1">{error}</p>
            </div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="bg-white rounded-2xl border border-[#E8E2DB] p-12 text-center space-y-3">
              <p className="text-4xl">✓</p>
              <p className="font-semibold text-[#1C1C1C]">Không có đánh giá nào bị báo cáo</p>
              <p className="text-sm text-[#6B6560]">Tất cả đánh giá đều ổn. Không cần xử lý gì thêm.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <ReviewModerationCard
                  key={review.id}
                  review={review as Parameters<typeof ReviewModerationCard>[0]["review"]}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
