import { motion } from 'framer-motion'

export function Badge({
  children,
  tone,
}: {
  children: React.ReactNode
  tone: 'accent' | 'success' | 'warning' | 'danger'
}) {
  const map = {
    accent: 'bg-blue-500/10 text-blue-500',
    success: 'bg-emerald-500/10 text-emerald-500',
    warning: 'bg-amber-500/10 text-amber-500',
    danger: 'bg-red-500/10 text-red-500',
  }

  return (
    <motion.span
      whileHover={{ scale: 1.06 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`text-xs font-medium px-2 py-1 rounded ${map[tone]}`}
    >
      {children}
    </motion.span>
  )
}