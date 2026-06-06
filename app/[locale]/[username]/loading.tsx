export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] animate-pulse">
      {/* Nav */}
      <header className="bg-white border-b border-[#E8E2DB] h-14" />

      {/* Hero */}
      <div className="w-full h-48 sm:h-64 md:h-80 bg-[#F2EDE8]" />

      <div className="max-w-4xl mx-auto px-4">
        {/* Profile header */}
        <div className="relative -mt-16 pb-6 border-b border-[#E8E2DB]">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <div className="w-24 h-24 rounded-full border-4 border-white bg-[#F2EDE8] shrink-0" />
            <div className="flex-1 space-y-2 pb-2">
              <div className="h-8 w-48 bg-[#F2EDE8] rounded-lg" />
              <div className="h-4 w-24 bg-[#F2EDE8] rounded" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-[#F2EDE8] rounded-full" />
                <div className="h-6 w-20 bg-[#F2EDE8] rounded-full" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-6 w-12 bg-[#F2EDE8] rounded" />
                <div className="h-3 w-8 bg-[#F2EDE8] rounded" />
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-1.5">
            <div className="h-3 w-full max-w-sm bg-[#F2EDE8] rounded" />
            <div className="h-3 w-2/3 bg-[#F2EDE8] rounded" />
          </div>
        </div>

        {/* Portfolio grid */}
        <section className="py-8">
          <div className="h-6 w-24 bg-[#F2EDE8] rounded mb-5" />
          <div className="columns-2 sm:columns-3 gap-3 space-y-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="break-inside-avoid bg-[#F2EDE8] rounded-xl"
                style={{ height: `${140 + (i % 3) * 60}px` }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
