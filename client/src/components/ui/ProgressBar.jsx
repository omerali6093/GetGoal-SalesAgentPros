import React, { useEffect, useState } from 'react'

function colorFor(value) {
  if (value >= 70) return '#22C55E'
  if (value >= 45) return '#F59E0B'
  return '#EF4444'
}

export default function ProgressBar({ label, value, showValue = true, size = 'md' }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 80)
    return () => clearTimeout(t)
  }, [value])

  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-ink-muted">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-ink">{value}</span>}
        </div>
      )}
      <div className={`w-full ${height} bg-white/5 rounded-full overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${width}%`, backgroundColor: colorFor(value) }}
        />
      </div>
    </div>
  )
}
