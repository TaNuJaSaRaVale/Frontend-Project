import { useKpiData } from '../../hooks/useKpiData'
import { KpiCard } from './KpiCard'

export function FeatureSection() {
  const q = useKpiData()

  return (
    <section aria-labelledby="feature-title" className="glass rounded-[var(--radius-lg)] p-6 sm:p-10">
      <header className="max-w-2xl">
        <p className="text-sm text-[rgb(var(--color-muted))]">Optimization overview</p>
        <h2
          id="feature-title"
          className="mt-2 text-balance font-semibold tracking-tight text-[rgb(var(--color-text))]"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          Cloud optimization insights
        </h2>
        <p className="mt-3 text-pretty text-[rgb(var(--color-muted))]">
          Live KPIs derived from a public API, cached for instant revisits.
        </p>
      </header>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {q.isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-[var(--shadow-sm)]"
            >
              <div className="h-4 w-24 rounded bg-[rgb(var(--color-border))] opacity-60" />
              <div className="mt-3 h-8 w-32 rounded bg-[rgb(var(--color-border))] opacity-40" />
              <div className="mt-3 h-3 w-40 rounded bg-[rgb(var(--color-border))] opacity-30" />
            </div>
          ))
        ) : q.isError ? (
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4">
              <p className="text-sm font-medium text-[rgb(var(--color-text))]">
                Couldn’t load KPIs.
              </p>
              <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
                Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => q.refetch()}
                className="mt-3 inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] px-3 py-2 text-sm font-medium text-[rgb(var(--color-text))] shadow-[var(--shadow-sm)] hover:bg-[rgb(var(--color-surface-2))] transition"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          q.data.kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)
        )}
      </div>
    </section>
  )
}

