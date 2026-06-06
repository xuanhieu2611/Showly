export default function DiscoverLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Title skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-8 w-64 bg-[#F2EDE8] rounded-lg" />
          <div className="h-4 w-80 bg-[#F2EDE8] rounded" />
        </div>

        {/* Filters skeleton */}
        <div className="bg-white rounded-2xl border border-[#E8E2DB] p-4 space-y-4 animate-pulse">
          <div className="h-10 bg-[#F2EDE8] rounded-xl" />
          <div className="flex gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-8 w-24 bg-[#F2EDE8] rounded-full" />
            ))}
          </div>
          <div className="flex gap-2">
            <div className="h-10 flex-1 bg-[#F2EDE8] rounded-xl" />
            <div className="h-10 flex-1 bg-[#F2EDE8] rounded-xl" />
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#E8E2DB] overflow-hidden">
              <div className="aspect-[4/3] bg-[#F2EDE8]" />
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[#F2EDE8] rounded w-2/3" />
                <div className="h-4 bg-[#F2EDE8] rounded w-3/4" />
                <div className="h-3 bg-[#F2EDE8] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
