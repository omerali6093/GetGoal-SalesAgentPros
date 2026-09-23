import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flame, Zap, Circle, MapPin } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import { businesses } from '../data/mockData.js'
import { useToast } from '../components/ui/Toast.jsx'

const columns = ['New', 'Qualified', 'Contacted', 'Follow-up', 'Converted']

const intentFilters = [
  { key: 'all', label: 'All', icon: Circle },
  { key: 'high', label: 'High Intent', icon: Flame },
  { key: 'medium', label: 'Medium Intent', icon: Zap },
  { key: 'low', label: 'Low Intent', icon: Circle },
]

function intentOf(score) {
  if (score >= 80) return 'high'
  if (score >= 55) return 'medium'
  return 'low'
}

export default function Opportunities() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [intent, setIntent] = useState('all')
  const [board, setBoard] = useState(() => {
    const map = {}
    columns.forEach((c) => (map[c] = []))
    businesses.slice(0, 42).forEach((b) => {
      map[b.leadStatus]?.push(b)
    })
    return map
  })
  const [dragging, setDragging] = useState(null)

  function filteredCards(list) {
    if (intent === 'all') return list
    return list.filter((b) => intentOf(b.opportunityScore) === intent)
  }

  function onDrop(column) {
    if (!dragging) return
    setBoard((prev) => {
      const next = {}
      for (const key of columns) next[key] = prev[key].filter((b) => b.id !== dragging.id)
      next[column] = [dragging, ...next[column]]
      return next
    })
    if (dragging.leadStatus !== column) {
      showToast(`${dragging.name} moved to ${column}.`)
    }
    setDragging(null)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales Opportunities"
        subtitle="Drag leads across the pipeline as they progress toward becoming clients."
      />

      <div className="flex flex-wrap gap-2">
        {intentFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => setIntent(f.key)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
              intent === f.key
                ? 'bg-brand/10 border-brand/40 text-brand-accent'
                : 'border-border text-ink-muted hover:text-ink'
            }`}
          >
            <f.icon size={13} className={f.key === 'high' ? 'text-state-danger' : f.key === 'medium' ? 'text-state-warning' : ''} />
            {f.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
        {columns.map((column) => {
          const cards = filteredCards(board[column])
          return (
            <div
              key={column}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(column)}
              className="bg-bg-card border border-border rounded-xl p-3 flex flex-col min-h-[420px]"
            >
              <div className="flex items-center justify-between px-1.5 pb-3 mb-2 border-b border-border">
                <span className="text-xs font-semibold tracking-wide text-ink-muted">{column.toUpperCase()}</span>
                <span className="text-xs text-ink-muted bg-white/5 rounded-full px-2 py-0.5">{cards.length}</span>
              </div>
              <div className="space-y-2.5 flex-1">
                {cards.map((b) => (
                  <div
                    key={b.id}
                    draggable
                    onDragStart={() => setDragging(b)}
                    className="bg-bg border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-brand/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-sm font-medium text-ink leading-snug">{b.name}</p>
                      <span className="text-xs font-semibold text-brand-accent shrink-0">{b.opportunityScore}</span>
                    </div>
                    <p className="text-xs text-ink-muted mb-1">{b.industry}</p>
                    <p className="text-xs text-ink-muted mb-2 flex items-center gap-1"><MapPin size={11} />{b.location.split(',')[0]}</p>
                    <p className="text-xs text-state-warning mb-3">{b.websiteStatus}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-ink-muted">{b.lastActivity}</span>
                      <button
                        onClick={() => navigate(`/leads/${b.id}`)}
                        className="text-[11px] text-brand-accent hover:underline"
                      >
                        View Lead
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
