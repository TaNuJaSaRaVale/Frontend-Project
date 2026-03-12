import { type ReactNode } from 'react'

type BadgeProps = {
  children: ReactNode
  tone?: 'accent' | 'success' | 'warning' | 'danger'
}

const toneClass: Record<NonNullable<BadgeProps['tone']>, string> = {
  accent:
    'border-[color:rgb(var(--color-accent)/0.35)] bg-[color:rgb(var(--color-accent)/0.10)] text-[color:rgb(var(--color-accent))]',
  success:
    'border-[color:rgb(var(--color-success)/0.35)] bg-[color:rgb(var(--color-success)/0.10)] text-[color:rgb(var(--color-success))]',
  warning:
    'border-[color:rgb(var(--color-warning)/0.35)] bg-[color:rgb(var(--color-warning)/0.10)] text-[color:rgb(var(--color-warning))]',
  danger:
    'border-[color:rgb(var(--color-danger)/0.35)] bg-[color:rgb(var(--color-danger)/0.10)] text-[color:rgb(var(--color-danger))]',
}

export function Badge({ children, tone = 'accent' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
        toneClass[tone],
      ].join(' ')}
    >
      {children}
    </span>
  )
}

