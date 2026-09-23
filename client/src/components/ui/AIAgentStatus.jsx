import React, { useEffect, useState } from 'react'
import { Activity } from 'lucide-react'

export default function AIAgentStatus({ compact = false }) {
  const [progress, setProgress] = useState(62)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => (p >= 96 ? 40 : p + 1))
    }, 400)
    return () => clearInterval(interval)
  }, [])

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-pulseSoft absolute inline-flex h-full w-full rounded-full bg-state-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-state-success" />
        </span>
        <span className="text-xs text-ink-muted">Agent Online</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-bg-card p-4">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={14} className="text-brand-accent" />
        <span className="text-[11px] font-semibold tracking-wide text-ink-muted">AI Sales Agent</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-pulseSoft absolute inline-flex h-full w-full rounded-full bg-state-success opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-state-success" />
        </span>
        <span className="text-sm font-medium text-ink">Agent Online</span>
      </div>

      <p className="text-xs text-ink-muted mb-2">
        Currently analyzing <span className="text-ink font-medium">24 businesses</span>
      </p>

      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-1.5 rounded-full bg-gradient-to-r from-brand to-brand-accent transition-all duration-500 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-1.5 text-right text-[11px] text-ink-muted">{progress}%</div>
    </div>
  )
}
