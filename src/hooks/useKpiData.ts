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

export function useKpiData() {
  return useQuery({
    queryKey: ['feature-kpis', 'products'],
    queryFn: async () => {
      const data = await fetchProducts(12)
      const items = data.products

      const avgDiscount = items.reduce((a, p) => a + p.discountPercentage, 0) / items.length
      const avgRating = items.reduce((a, p) => a + p.rating, 0) / items.length
      const lowStock = items.filter((p) => p.stock < 50).length
      const totalPrice = items.reduce((a, p) => a + p.price, 0)

      // Creative “savings” metric: assume we can reclaim part of discounted spend.
      const potentialSavings = totalPrice * (avgDiscount / 100) * 0.42

      // Creative “optimization score”: weighted by discount, rating stability, and stock risk.
      const score =
        100 -
        (avgDiscount * 0.55 + (5 - avgRating) * 10 + (lowStock / items.length) * 30)

      const kpis: Kpi[] = [
        {
          id: 'savings',
          label: 'Potential savings',
          value: round(potentialSavings, 0),
          unit: '$',
          delta: round(avgDiscount * 0.35, 1),
          tone: 'success',
          detail: 'Estimated monthly reclaim from inefficient spend.',
        },
        {
          id: 'flagged',
          label: 'Resources flagged',
          value: lowStock,
          unit: '',
          delta: round((lowStock / items.length) * 100, 0),
          tone: lowStock >= 5 ? 'warning' : 'accent',
          detail: 'Items that look risky based on low “capacity”.',
        },
        {
          id: 'rating',
          label: 'Signal quality',
          value: round((avgRating / 5) * 100, 0),
          unit: '%',
          delta: round((avgRating - 4) * 10, 0),
          tone: avgRating >= 4.2 ? 'accent' : 'warning',
          detail: 'Confidence score derived from data consistency.',
        },
        {
          id: 'score',
          label: 'Optimization score',
          value: round(Math.max(0, Math.min(100, score)), 0),
          unit: '%',
          delta: round(6 + avgDiscount * 0.1, 0),
          tone: score >= 72 ? 'accent' : 'danger',
          detail: 'A blended score you can explain in the README.',
        },
      ]

      return { kpis, sample: items.slice(0, 4) }
    },
  })
}

