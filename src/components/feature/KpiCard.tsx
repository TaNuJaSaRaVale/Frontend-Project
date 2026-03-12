import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '../ui/Badge'
import type { Kpi } from '../../hooks/useKpiData'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

const EASE_OUT_QUINT = [0.2, 0.9, 0.2, 1] as [number, number, number, number]

function formatValue(kpi: Kpi, value: number) {
  if (kpi.unit === '$') return `$${Math.round(value).toLocaleString()}`
  if (kpi.unit === '%') return `${Math.round(value)}%`
  return `${Math.round(value).toLocaleString()}`
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const delta = typeof kpi.delta === 'number' ? kpi.delta : undefined
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.65 })
  const [displayValue, setDisplayValue] = useState<number>(() => (reduceMotion ? kpi.value : 0))

  useEffect(() => {
    if (reduceMotion) {
      setDisplayValue(kpi.value)
      return
    }
    if (!isInView) return

    const controls = animate(0, kpi.value, {
      duration: 0.9,
      ease: EASE_OUT_QUINT,
      onUpdate: (v) => setDisplayValue(v),
    })
    return () => controls.stop()
  }, [isInView, kpi.value, reduceMotion])

  // Telemetry: fire once when card comes into view (optional; guarded)
  useEffect(() => {
    const TELEMETRY_ENABLED = import.meta.env.VITE_ENABLE_TELEMETRY === 'true'
    const TELEMETRY_ENDPOINT = 'http://127.0.0.1:7831/ingest/bcf89508-d7d1-4ae5-b288-3d69bb1527ff'
    const TELEMETRY_SESSION = '0d0ec3'
    if (!TELEMETRY_ENABLED) return
    if (!isInView) return

    const payload = {
      sessionId: TELEMETRY_SESSION,
      runId: 'run1',
      hypothesisId: 'H3',
      location: 'KpiCard.tsx:inView',
      message: 'KpiCard viewed',
      data: {
        id: kpi.id,
        label: kpi.label,
        value: kpi.value,
      },
      timestamp: Date.now(),
    }

    try {
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        navigator.sendBeacon(TELEMETRY_ENDPOINT, JSON.stringify(payload))
      } else {
        fetch(TELEMETRY_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': TELEMETRY_SESSION },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {})
      }
    } catch {
      // swallow
    }
  }, [isInView, kpi.id, kpi.value, kpi.label])

  const deltaText =
    delta === undefined
      ? null
      : kpi.unit === '$'
      ? `+${delta}%`
      : kpi.unit === '%'
      ? `+${delta} pts`
      : `+${delta}%`

  const cardVariants = useMemo(
    () =>
      reduceMotion
        ? undefined
        : {
            hidden: { opacity: 0, y: 14, scale: 0.98, filter: 'blur(6px)' },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: 'blur(0px)',
              transition: { duration: 0.55, ease: EASE_OUT_QUINT },
            },
          },
    [reduceMotion],
  )

  return (
    <motion.article
      ref={ref}
      variants={cardVariants}
      initial={reduceMotion ? undefined : 'hidden'}
      animate={isInView && !reduceMotion ? 'show' : undefined}
      className="rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-[var(--shadow-sm)]"
      tabIndex={0}
      aria-labelledby={`kpi-${kpi.id}-title`}
    >
      <header className="flex items-start justify-between gap-3">
        <h3 id={`kpi-${kpi.id}-title`} className="text-sm font-medium text-[rgb(var(--color-muted))]">
          {kpi.label}
        </h3>
        {deltaText ? <Badge tone={kpi.tone}>{deltaText}</Badge> : null}
      </header>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-[rgb(var(--color-text))]">
        {formatValue(kpi, displayValue)}
      </p>

      <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">{kpi.detail}</p>
    </motion.article>
  )
}

export default KpiCard