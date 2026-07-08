import { Skeleton } from '~/components/ui/skeleton'

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64 mt-2" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border border-border rounded-xl p-3 sm:p-4 bg-surface/50">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 sm:h-8 w-20 sm:w-24 mt-2" />
          </div>
        ))}
      </div>
      <div className="border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
        <Skeleton className="h-4 w-32 mb-4" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
          <Skeleton className="h-4 w-24 mb-4" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
          <Skeleton className="h-4 w-24 mb-4" />
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="border border-border rounded-xl overflow-x-auto bg-surface/50">
      <div className="min-w-[600px]">
        <div className="p-4 border-b border-border">
          <div className="flex gap-4">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 border-b border-border last:border-0">
            <div className="flex gap-4">
              {Array.from({ length: cols }).map((_, j) => (
                <Skeleton key={j} className="h-4 flex-1" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="border border-border rounded-xl p-4 sm:p-5 bg-surface/50">
      <Skeleton className="h-4 w-32 mb-3" />
      <Skeleton className="h-3 w-48 mb-4" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}
