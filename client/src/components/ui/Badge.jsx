import React from 'react'

const variants = {
  success: 'bg-state-success/10 text-state-success border-state-success/25',
  warning: 'bg-state-warning/10 text-state-warning border-state-warning/25',
  danger: 'bg-state-danger/10 text-state-danger border-state-danger/25',
  brand: 'bg-brand/10 text-brand-accent border-brand/25',
  neutral: 'bg-white/5 text-ink-muted border-border',
}

export default function Badge({ children, variant = 'neutral', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  )
}

export function opportunityVariant(score) {
  if (score >= 80) return 'danger' // "hot" opportunity — reuses danger token for urgency red isn't ideal; see below
}

// Semantic helpers used across pages
export function scoreVariant(score) {
  if (score >= 80) return 'warning' // high opportunity — amber signals "needs attention / high value"
  if (score >= 55) return 'brand'
  return 'neutral'
}

export function leadStatusVariant(status) {
  switch (status) {
    case 'Converted':
      return 'success'
    case 'Qualified':
      return 'brand'
    case 'Contacted':
      return 'warning'
    case 'Follow-up':
      return 'warning'
    default:
      return 'neutral'
  }
}

export function websiteStatusVariant(status) {
  switch (status) {
    case 'Good':
      return 'success'
    case 'No Website':
      return 'danger'
    default:
      return 'warning'
  }
}
