import { useKpiData } from '../../hooks/useKpiData'
import { KpiCard } from './KpiCard'
import { motion, useReducedMotion } from 'framer-motion'

export function FeatureSection() {
  const q = useKpiData()
  const reduceMotion = useReducedMotion()

  const gridVariants = reduceMotion
    ? undefined
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
          },
        },
      }

  return (
    <section
      aria-labelledby="feature-title"
      className="glass rounded-[var(--radius-lg)] px-6 py-7 sm:px-10 sm:py-8"
    >
      <header className="max-w-2xl">
        <p className="text-sm text-[rgb(var(--color-muted))]">Sustainability overview</p>
        <h2
          id="feature-title"
          className="mt-2 text-balance font-semibold tracking-tight text-[rgb(var(--color-text))]"
          style={{ fontSize: 'var(--text-2xl)' }}
        >
          Sustainability impact pulse
        </h2>
        <p className="mt-3 text-pretty text-[rgb(var(--color-muted))]">
          See, at a glance, how climate-friendly your digital portfolio looks right now.
        </p>
      </header>

      {/* #region agent log */}
      {(() => {
        fetch('http://127.0.0.1:7831/ingest/bcf89508-d7d1-4ae5-b288-3d69bb1527ff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': '0d0ec3',
          },
          body: JSON.stringify({
            sessionId: '0d0ec3',
            runId: 'run1',
            hypothesisId: 'H2',
            location: 'FeatureSection.tsx:render',
            message: 'FeatureSection render state',
            data: {
              status: q.status,
              isLoading: q.isLoading,
              isError: q.isError,
              hasData: Boolean(q.data),
              kpiCount: q.data?.kpis.length ?? 0,
            },
            timestamp: Date.now(),
          }),
        }).catch(() => {})
        return null
      })()}
      {/* #endregion agent log */}

      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={gridVariants}
        initial={reduceMotion ? undefined : 'hidden'}
        whileInView={reduceMotion ? undefined : 'show'}
        viewport={{ once: true, amount: 0.35 }}
      >
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
          q.data ? q.data.kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />) : null
        )}
      </motion.div>
    </section>
  )
}

