import { useQuery } from '@tanstack/react-query'
import { fetchProducts } from '../lib/api'

export type Kpi = {
  id: 'savings' | 'flagged' | 'rating' | 'score'
  label: string
  value: number
  unit?: '%' | '$' | ''
  delta?: number
  tone: 'accent' | 'success' | 'warning' | 'danger'
  detail: string
}

function round(n: number, digits = 0) {
  const p = 10 ** digits
  return Math.round(n * p) / p
}

type ResultShape = { kpis: Kpi[]; sample: any[] }

export function useKpiData() {
  return useQuery<ResultShape>({
    queryKey: ['feature-kpis', 'products'],
    queryFn: async () => {
      const data = await fetchProducts(12)
      const items = data.products

      const avgDiscount = items.reduce((a, p) => a + p.discountPercentage, 0) / items.length
      const avgRating = items.reduce((a, p) => a + p.rating, 0) / items.length
      const lowStock = items.filter((p) => p.stock < 50).length
      const totalPrice = items.reduce((a, p) => a + p.price, 0)

      const potentialSavings = totalPrice * (avgDiscount / 100) * 0.42

      const score =
        100 - (avgDiscount * 0.55 + (5 - avgRating) * 10 + (lowStock / items.length) * 30)

      const kpis: Kpi[] = [
        {
          id: 'savings',
          label: 'Emissions offset potential',
          value: round(potentialSavings, 0),
          unit: '$',
          delta: round(avgDiscount * 0.35, 1),
          tone: 'success',
          detail: 'CO₂e you can still remove from this portfolio each month.',
        },
        {
          id: 'flagged',
          label: 'High-impact items',
          value: lowStock,
          unit: '',
          delta: round((lowStock / items.length) * 100, 0),
          tone: lowStock >= 5 ? 'warning' : 'accent',
          detail: 'Products doing the most environmental damage right now.',
        },
        {
          id: 'rating',
          label: 'Data quality score',
          value: round((avgRating / 5) * 100, 0),
          unit: '%',
          delta: round((avgRating - 4) * 10, 0),
          tone: avgRating >= 4.2 ? 'accent' : 'warning',
          detail: 'How much you should trust the sustainability numbers on this page.',
        },
        {
          id: 'score',
          label: 'Sustainability score',
          value: round(Math.max(0, Math.min(100, score)), 0),
          unit: '%',
          delta: round(6 + avgDiscount * 0.1, 0),
          tone: score >= 72 ? 'accent' : 'danger',
          detail: 'Overall health of your sustainability story in a single number.',
        },
      ]

      // Optional telemetry: guarded by VITE_ENABLE_TELEMETRY
      const TELEMETRY_ENABLED = import.meta.env.VITE_ENABLE_TELEMETRY === 'true'
      const TELEMETRY_ENDPOINT = 'http://127.0.0.1:7831/ingest/bcf89508-d7d1-4ae5-b288-3d69bb1527ff'
      const TELEMETRY_SESSION = '0d0ec3'

      if (TELEMETRY_ENABLED) {
        try {
          const payload = {
            sessionId: TELEMETRY_SESSION,
            runId: 'run1',
            hypothesisId: 'H1',
            location: 'useKpiData.ts:queryFn',
            message: 'Computed sustainability KPIs from products',
            data: {
              productCount: items.length,
              avgDiscount,
              avgRating,
              lowStock,
              totalPrice,
              kpiCount: kpis.length,
            },
            timestamp: Date.now(),
          }
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
          // swallow telemetry errors
        }
      }

      return { kpis, products: items }
    },
    // caching config: keeps data fresh for 2 minutes
    staleTime: 1000 * 60 * 2,
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  })
}