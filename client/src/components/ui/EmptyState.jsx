import React from 'react'

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-dashed border-border rounded-xl bg-bg-card/50">
      {Icon && (
        <div className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center mb-4 text-ink-muted">
          <Icon size={20} />
        </div>
      )}
      <h3 className="text-sm font-semibold text-ink mb-1">{title}</h3>
      {description && <p className="text-sm text-ink-muted max-w-sm mb-4">{description}</p>}
      {action}
    </div>
  )
}
