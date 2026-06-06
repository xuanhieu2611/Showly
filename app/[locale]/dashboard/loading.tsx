export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-[#F2EDE8] rounded-lg" />
          <div className="h-4 w-48 bg-[#F2EDE8] rounded" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-36 bg-[#F2EDE8] rounded-lg" />
          <div className="h-9 w-28 bg-[#C9A96E]/20 rounded-lg" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8E2DB] p-4 space-y-2">
            <div className="h-7 w-7 bg-[#F2EDE8] rounded" />
            <div className="h-6 w-16 bg-[#F2EDE8] rounded" />
            <div className="h-3 w-24 bg-[#F2EDE8] rounded" />
          </div>
        ))}
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-28 bg-[#F2EDE8] rounded" />
          <div className="h-4 w-20 bg-[#F2EDE8] rounded" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-2">
              <div className="h-4 w-20 bg-[#F2EDE8] rounded shrink-0" />
              <div className="h-4 flex-1 bg-[#F2EDE8] rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#E8E2DB] p-5 space-y-2">
            <div className="h-7 w-7 bg-[#F2EDE8] rounded" />
            <div className="h-4 w-28 bg-[#F2EDE8] rounded" />
            <div className="h-3 w-36 bg-[#F2EDE8] rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
