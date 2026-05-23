// Pulse skeleton card for Candidate Booth
export function CandidatesSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-slate-900/40 border border-slate-800/80 rounded-2xl h-[260px] p-5 flex flex-col justify-between animate-pulse">
          <div className="space-y-4">
            <div className="flex gap-4 items-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-slate-800 rounded-md w-3/4" />
                <div className="h-2.5 bg-slate-800 rounded-md w-1/3" />
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="h-3 bg-slate-800 rounded-md w-full" />
              <div className="h-3 bg-slate-800 rounded-md w-5/6" />
            </div>
          </div>
          <div className="border-t border-slate-800/60 pt-4 flex items-center justify-between mt-4">
            <div className="space-y-1">
              <div className="h-2.5 bg-slate-800 rounded-md w-10" />
              <div className="h-4 bg-slate-800 rounded-md w-16" />
            </div>
            <div className="h-8 bg-slate-800 rounded-xl w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Pulse stats cards for Dashboard
export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div key={idx} className="bg-slate-900/40 border border-slate-800/85 p-6 rounded-2xl flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 rounded-xl bg-slate-800" />
          <div className="space-y-2">
            <div className="h-3 bg-slate-800 rounded-md w-16" />
            <div className="h-6 bg-slate-800 rounded-md w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Table loading state for Admin panel candidates management
export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-slate-900/60 rounded-xl border border-slate-800 w-full" />
      <div className="border border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-800/60">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="p-4 flex justify-between items-center bg-slate-900/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-800" />
              <div className="h-4 bg-slate-800 rounded-md w-32" />
            </div>
            <div className="h-4 bg-slate-800 rounded-md w-16" />
            <div className="h-8 bg-slate-800 rounded-xl w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
