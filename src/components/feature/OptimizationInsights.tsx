import { motion, useReducedMotion } from "framer-motion"
import { useKpiData } from "../../hooks/useKpiData"

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

  const insights = [
    {
      label: "Low-stock risk",
      value: `${lowStock}`,
      detail: "Products that may cause supply instability.",
      color: "from-emerald-400 to-green-500",
      icon: "⚠️",
    },
    {
      label: "Average rating",
      value: `${avgRating.toFixed(1)} ★`,
      detail: "Overall product reliability score.",
      color: "from-blue-400 to-indigo-500",
      icon: "⭐",
    },
    {
      label: "Discount potential",
      value: `${avgDiscount.toFixed(0)}%`,
      detail: "Average optimization opportunity across items.",
      color: "from-orange-400 to-amber-500",
      icon: "📉",
    },
  ]

  const container = reduceMotion
    ? undefined
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.18,
            delayChildren: 0.1,
          },
        },
      }

  const item = reduceMotion
    ? undefined
    : {
        hidden: { opacity: 0, y: 40, scale: 0.92 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          },
        },
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
        {insights.map((insight) => (
          <motion.div
            key={insight.label}
            variants={item}
            whileHover={{ y: -6, scale: 1.02 }}
            className="group relative rounded-[var(--radius-md)] border border-[rgb(var(--color-border))] bg-[rgb(var(--color-surface))] p-5 shadow-[var(--shadow-sm)] overflow-hidden"
          >
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r ${insight.color} blur-xl`}
            />

            <div className="relative">

              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg bg-gradient-to-r ${insight.color} text-white mb-3`}
                animate={reduceMotion ? undefined : { scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {insight.icon}
              </motion.div>

              <p className="text-sm text-[rgb(var(--color-muted))]">
                {insight.label}
              </p>

              <p className="mt-1 text-3xl font-semibold text-[rgb(var(--color-text))]">
                {insight.value}
              </p>

              <p className="mt-1 text-sm text-[rgb(var(--color-muted))]">
                {insight.detail}
              </p>

            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}