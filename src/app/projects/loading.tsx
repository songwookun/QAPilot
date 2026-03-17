export default function ProjectsLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="h-7 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-200" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-4 h-3 w-1/2 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
