import React from 'react'

export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-xl lg:text-2xl font-bold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-ink-muted mt-1 max-w-xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </div>
  )
}
