import React from 'react'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import CountUp from './CountUp.jsx'

export default function MetricCard({ label, value, delta, trend, icon: Icon }) {
  const positive = trend === 'up'
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5 shadow-card hover:border-brand/40 transition-colors duration-200">
      <div className="flex items-start justify-between">
        <span className="text-sm text-ink-muted">{label}</span>
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center text-brand-accent shrink-0">
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="mt-3 text-2xl font-bold text-ink tracking-tight">
        <CountUp value={value} />
      </div>
      <div className={`mt-2 inline-flex items-center gap-1 text-xs font-medium ${positive ? 'text-state-success' : 'text-state-danger'}`}>
        {positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
        {Math.abs(delta)}%
        <span className="text-ink-muted font-normal">this month</span>
      </div>
    </div>
  )
}
