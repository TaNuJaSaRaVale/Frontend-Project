/* eslint-disable @typescript-eslint/no-explicit-any */

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { useKpiData } from "../../hooks/useKpiData"

type InsightIcon = "warning" | "star" | "chart"

type Insight = {
  key: string
  label: string
  value: string
  detail: string
  icon: InsightIcon
}

export function OptimizationInsights() {
  const { data } = useKpiData()
  const reduceMotion = useReducedMotion()

  if (!data?.products) return null

  const products = data.products

  const lowStock = products.filter((p: any) => p.stock < 50).length

  const avgRating =
    products.reduce((a: number, p: any) => a + p.rating, 0) / products.length

  const avgDiscount =
    products.reduce((a: number, p: any) => a + p.discountPercentage, 0) /
    products.length

  const insights: Insight[] = [
    {
      key: "lowStock",
      label: "Low-stock risk",
      value: `${lowStock}`,
      detail: "Products that may cause supply instability.",
      icon: "warning",
    },
    {
      key: "avgRating",
      label: "Average rating",
      value: `${avgRating.toFixed(1)} ★`,
      detail: "Overall product reliability score.",
      icon: "star",
    },
    {
      key: "avgDiscount",
      label: "Discount potential",
      value: `${avgDiscount.toFixed(0)}%`,
      detail: "Average optimization opportunity across items.",
      icon: "chart",
    },
  ]

  const container: Variants | undefined = reduceMotion
    ? undefined
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.14,
            delayChildren: 0.06,
          },
        },
      }

  const item: Variants | undefined = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 24 },
        show: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.38,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }

  function Icon({ kind }: { kind: InsightIcon }) {
    if (kind === "warning")
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 9v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="12" cy="17" r="1" fill="currentColor" />
          <path
            d="M10 3.5L2.5 19a2 2 0 001.8 3h15.4a2 2 0 001.8-3L14 3.5a2 2 0 00-3.6 0z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )

    if (kind === "star")
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3l2.9 6 6.6.6-5 4.3 1.5 6.5L12 17l-6 3.4 1.5-6.5-5-4.3 6.6-.6L12 3z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      )

    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M3 20h18" stroke="currentColor" strokeWidth="1.5" />
        <rect x="6" y="10" width="3" height="6" rx="1" fill="currentColor" />
        <rect x="11" y="7" width="3" height="9" rx="1" fill="currentColor" />
        <rect x="16" y="4" width="3" height="12" rx="1" fill="currentColor" />
      </svg>
    )
  }

  return (
    <section className="mt-14">
      <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
        Optimization opportunities
      </h3>

      <p className="text-sm text-[rgb(var(--color-muted))] mt-1 mb-6">
        Derived insights from the current portfolio dataset.
      </p>

      <motion.div
        className="grid gap-4 sm:grid-cols-3"
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
      >
        {insights.map((ins) => (
          <motion.div
            key={ins.key}
            variants={item}
            whileHover={{ y: -4 }}
            className="group relative rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-[var(--shadow-sm)] transition-all duration-300 hover:shadow-lg hover:border-blue-500/40"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 rounded-[var(--radius-md)] bg-blue-500/5 blur-xl" />

            <div className="relative flex items-start gap-4">
              <div className="flex-shrink-0 rounded-full w-10 h-10 grid place-items-center bg-[rgb(var(--color-surface-2))] border border-[rgb(var(--color-border))] text-blue-500 transition-colors group-hover:text-blue-600">
                <motion.span
                  animate={reduceMotion ? undefined : { scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center justify-center"
                >
                  <Icon kind={ins.icon} />
                </motion.span>
              </div>

              <div>
                <p className="text-sm font-medium text-[rgb(var(--color-text))]">
                  {ins.label}
                </p>

                <p className="mt-2 text-2xl font-semibold text-[rgb(var(--color-text))]">
                  {ins.value}
                </p>

                <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
                  {ins.detail}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default OptimizationInsights