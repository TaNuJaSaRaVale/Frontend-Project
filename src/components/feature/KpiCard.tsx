/* eslint-disable no-empty */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Badge } from '../ui/Badge'
import type { Kpi } from '../../hooks/useKpiData'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

function formatValue(kpi: Kpi, value: number) {
  if (kpi.unit === '$') return `$${Math.round(value).toLocaleString()}`
  if (kpi.unit === '%') return `${Math.round(value)}%`
  return `${Math.round(value).toLocaleString()}`
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const reduceMotion = useReducedMotion()
  const ref = useRef<HTMLElement | null>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  const [display, setDisplay] = useState(() =>
    reduceMotion ? kpi.value : 0
  )

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(kpi.value)
      return
    }

    if (!inView) return

    const controls = animate(0, kpi.value, {
      duration: 1,
      ease,
      onUpdate: (v) => setDisplay(v),
    })

    return () => controls.stop()
  }, [inView, reduceMotion, kpi.value])

  useEffect(() => {
    const TELEMETRY_ENABLED = import.meta.env.VITE_ENABLE_TELEMETRY === 'true'
    const TELEMETRY_ENDPOINT = 'http://127.0.0.1:7831/ingest/bcf89508-d7d1-4ae5-b288-3d69bb1527ff'
    const TELEMETRY_SESSION = '0d0ec3'

    if (!TELEMETRY_ENABLED || !inView) return

    const payload = {
      sessionId: TELEMETRY_SESSION,
      runId: 'run1',
      hypothesisId: 'H3',
      location: 'KpiCard.tsx:view',
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
          headers: {
            'Content-Type': 'application/json',
            'X-Debug-Session-Id': TELEMETRY_SESSION,
          },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {})
      }
    } catch {}
  }, [inView, kpi.id, kpi.label, kpi.value])

  const delta =
    typeof kpi.delta === 'number'
      ? kpi.unit === '%'
        ? `+${kpi.delta} pts`
        : `+${kpi.delta}%`
      : null

  const variants = useMemo(
    () =>
      reduceMotion
        ? undefined
        : {
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { duration: 0.5, ease },
            },
          },
    [reduceMotion],
  )

  const radius = 20
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(100, Math.max(0, display))
  const offset = circumference - (progress / 100) * circumference

  return (
    <motion.article
      ref={ref}
      variants={variants}
      initial={reduceMotion ? undefined : 'hidden'}
      animate={inView && !reduceMotion ? 'show' : undefined}
      whileHover={
        reduceMotion
          ? undefined
          : { y: -6, scale: 1.02 }
      }
      className="group relative rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-[var(--shadow-sm)] transition"
      tabIndex={0}
      aria-labelledby={`kpi-${kpi.id}`}
    >
      <header className="flex items-start justify-between gap-3">
        <h3
          id={`kpi-${kpi.id}`}
          className="text-sm font-medium text-[rgb(var(--color-muted))]"
        >
          {kpi.label}
        </h3>

        {delta ? <Badge tone={kpi.tone}>{delta}</Badge> : null}
      </header>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative h-20 w-20 flex items-center justify-center">

          <svg viewBox="0 0 48 48" className="absolute h-full w-full">
  <defs>
    <linearGradient id={`grad-${kpi.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stopColor="rgb(59 130 246)" />
      <stop offset="100%" stopColor="rgb(34 197 94)" />
    </linearGradient>
  </defs>
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="4"
            />

            <motion.circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              stroke={`url(#grad-${kpi.id})`}
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={circumference}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease }}
              strokeLinecap="round"
              transform="rotate(-90 24 24)"
            />
          </svg>

          <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
            {Math.round(display)}
            {kpi.unit === '%' ? '%' : ''}
          </span>
        </div>

        <p className="text-3xl font-semibold tracking-tight text-[rgb(var(--color-text))]">
          {formatValue(kpi, display)}
        </p>
      </div>

      <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">
        {kpi.detail}
      </p>

      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition">
        <div className="absolute -inset-px rounded-[var(--radius-md)] bg-gradient-to-r from-blue-500/10 to-green-400/10 blur-xl"></div>
      </div>
    </motion.article>
  )
}

export default KpiCard