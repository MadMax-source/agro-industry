export function PageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl animate-pulse px-4 py-14 sm:px-6 lg:px-8" aria-busy="true" aria-label="Loading">
      <div className="h-4 w-40 rounded bg-muted" />
      <div className="mt-5 h-10 w-2/3 max-w-md rounded bg-muted" />
      <div className="mt-4 h-4 w-full max-w-xl rounded bg-muted" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
