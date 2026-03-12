import { Badge } from '../ui/Badge'
import type { Kpi } from '../../hooks/useKpiData'
import { animate, motion, useInView, useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

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
  const [displayValue, setDisplayValue] = useState(() => (reduceMotion ? kpi.value : 0))

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
      className="rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-[var(--shadow-sm)] transition will-change-transform hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]"
    >
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-[rgb(var(--color-muted))]">{kpi.label}</h3>
        {deltaText ? <Badge tone={kpi.tone}>{deltaText}</Badge> : null}
      </header>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-[rgb(var(--color-text))]">
        {formatValue(kpi, displayValue)}
      </p>

      <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">{kpi.detail}</p>
    </motion.article>
  )
}

