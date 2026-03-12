export default function App() {
  return (
    <div className="ocean-glow">
      <main className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <section
          aria-labelledby="feature-title"
          className="glass rounded-[var(--radius-lg)] p-6 sm:p-10"
        >
          <header className="max-w-2xl">
            <p className="text-sm text-[rgb(var(--color-muted))]">
              Atomity-style section (your interpretation)
            </p>
            <h1
              id="feature-title"
              className="mt-2 text-balance text-3xl font-semibold tracking-tight text-[rgb(var(--color-text))] sm:text-4xl"
              style={{ fontSize: 'var(--text-2xl)' }}
            >
              Cloud optimization insights
            </h1>
            <p className="mt-3 text-pretty text-[rgb(var(--color-muted))]">
              Next we’ll fetch data, cache it with React Query, and animate KPI cards on
              scroll with Framer Motion.
            </p>
          </header>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-[var(--shadow-sm)]"
              >
                <div className="h-4 w-24 rounded bg-[rgb(var(--color-border))] opacity-60" />
                <div className="mt-3 h-8 w-32 rounded bg-[rgb(var(--color-border))] opacity-40" />
                <div className="mt-3 h-3 w-40 rounded bg-[rgb(var(--color-border))] opacity-30" />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
