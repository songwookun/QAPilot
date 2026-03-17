export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="h-7 w-28 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-4 w-12 animate-pulse rounded bg-gray-200" />
          <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="mt-6 flex gap-1 border-b pb-2">
          {["기획서", "TC", "테스트 진행", "버그 리포트", "QA 결과"].map((label) => (
            <div key={label} className="h-8 w-20 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-lg border bg-white p-5 shadow-sm">
              <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
