import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, Sparkles } from 'lucide-react'
import { businesses } from '../../data/mockData.js'

export default function Topbar({ onOpenMobile }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [showResults, setShowResults] = useState(false)

  const results = query.length > 1
    ? businesses.filter((b) => b.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : []

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-bg/85 backdrop-blur-md flex items-center gap-3 px-4 lg:px-6">
      <button
        onClick={onOpenMobile}
        className="lg:hidden text-ink-muted hover:text-ink"
      >
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowResults(true)
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 150)}
          onFocus={() => query && setShowResults(true)}
          placeholder="Search businesses, leads, campaigns..."
          className="w-full bg-bg-card border border-border rounded-lg py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus-ring outline-none focus:border-brand/50"
        />
        {showResults && results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-bg-card border border-border rounded-lg shadow-card overflow-hidden z-40">
            {results.map((b) => (
              <button
                key={b.id}
                onClick={() => navigate(`/businesses/${b.id}`)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-white/5 transition-colors"
              >
                <div>
                  <p className="text-sm text-ink">{b.name}</p>
                  <p className="text-xs text-ink-muted">{b.industry} · {b.location}</p>
                </div>
                <span className="text-xs text-brand-accent font-semibold">{b.opportunityScore}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1" />

    

      <button
        onClick={() => navigate('/discover')}
        className="hidden sm:inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-glow"
      >
        <Sparkles size={14} />
        Start New Search
      </button>

      
    </header>
  )
}
