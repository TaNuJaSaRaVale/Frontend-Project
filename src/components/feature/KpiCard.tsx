import { Badge } from '../ui/Badge'
import type { Kpi } from '../../hooks/useKpiData'

function formatValue(kpi: Kpi) {
  if (kpi.unit === '$') return `$${Math.round(kpi.value).toLocaleString()}`
  if (kpi.unit === '%') return `${Math.round(kpi.value)}%`
  return `${Math.round(kpi.value).toLocaleString()}`
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const delta = typeof kpi.delta === 'number' ? kpi.delta : undefined
  const deltaText =
    delta === undefined
      ? null
      : kpi.unit === '$'
        ? `+${delta}%`
        : kpi.unit === '%'
          ? `+${delta} pts`
          : `+${delta}%`

  return (
    <article className="rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-4 shadow-[var(--shadow-sm)]">
      <header className="flex items-start justify-between gap-3">
        <h3 className="text-sm font-medium text-[rgb(var(--color-muted))]">{kpi.label}</h3>
        {deltaText ? <Badge tone={kpi.tone}>{deltaText}</Badge> : null}
      </header>

      <p className="mt-3 text-3xl font-semibold tracking-tight text-[rgb(var(--color-text))]">
        {formatValue(kpi)}
      </p>

      <p className="mt-2 text-sm text-[rgb(var(--color-muted))]">{kpi.detail}</p>
    </article>
  )
}

