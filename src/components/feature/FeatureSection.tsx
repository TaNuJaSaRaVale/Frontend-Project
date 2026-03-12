import React, { useEffect } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useKpiData } from '../../hooks/useKpiData'
import { KpiCard } from './KpiCard'

const TELEMETRY_ENABLED = import.meta.env.VITE_ENABLE_TELEMETRY === 'true'
const TELEMETRY_ENDPOINT = 'http://127.0.0.1:7831/ingest/bcf89508-d7d1-4ae5-b288-3d69bb1527ff'
const TELEMETRY_SESSION = '0d0ec3'

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

  // Telemetry: run only when status changes (guarded)
  useEffect(() => {
    if (!TELEMETRY_ENABLED) return
    // minimal payload
    const payload = {
      sessionId: TELEMETRY_SESSION,
      runId: 'run1',
      hypothesisId: 'H2',
      location: 'FeatureSection.tsx:useEffect',
      message: 'FeatureSection query state',
      data: {
        status: q.status,
        isLoading: q.isLoading,
        isError: q.isError,
        hasData: Boolean(q.data),
        kpiCount: q.data?.kpis?.length ?? 0,
      },
      timestamp: Date.now(),
    }

    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        // sendBeacon expects Blob or string — create a blob for JSON
        navigator.sendBeacon(TELEMETRY_ENDPOINT, JSON.stringify(payload))
      } else {
        // non-blocking fetch with keepalive; it may still fail if endpoint down
        fetch(TELEMETRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': TELEMETRY_SESSION },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {
          /* ignore telemetry errors */
        })
      }
    } catch {
      /* swallow */
    }
  }, [q.status, q.isLoading, q.isError, q.data?.kpis?.length])

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
        ) : q.data?.kpis ? (
          q.data.kpis.map((kpi) => <KpiCard key={kpi.id} kpi={kpi} />)
        ) : null}
      </motion.div>
    </section>
  )
}

export default FeatureSection