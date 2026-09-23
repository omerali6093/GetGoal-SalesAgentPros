import React, { useState } from 'react'
import { Search, Monitor, AlertTriangle, Loader2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { businesses } from '../data/mockData.js'

export default function WebsiteAudit() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(businesses.find((b) => b.website))

  function runAudit() {
    if (!query.trim()) return
    setLoading(true)
    setTimeout(() => {
      const match =
        businesses.find((b) => b.name.toLowerCase().includes(query.toLowerCase()) && b.website) ||
        businesses.filter((b) => b.website)[Math.floor(Math.random() * 20)]
      setResult(match)
      setLoading(false)
    }, 1000)
  }

  const overallScore = result
    ? Math.round((result.scores.performance + result.scores.mobile + result.scores.seo + result.scores.accessibility + result.scores.conversion) / 5)
    : 0

  const issues = result
    ? [
        result.scores.mobile < 60 && 'Poor mobile experience',
        result.scores.performance < 60 && 'Slow loading speed',
        result.scores.conversion < 55 && 'Weak calls-to-action',
        result.scores.seo < 60 && 'Underoptimized for search engines',
        'Missing structured conversion elements',
      ].filter(Boolean)
    : []

  return (
    <div className="space-y-6">
      <PageHeader title="Website Intelligence" subtitle="Run an in-depth audit on any business website." />

      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runAudit()}
              placeholder="Enter business or website..."
              className="w-full bg-bg border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus-ring outline-none focus:border-brand/50"
            />
          </div>
          <button
            onClick={runAudit}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shrink-0"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
            Audit
          </button>
        </div>
      </div>

      {!result ? (
        <EmptyState icon={Monitor} title="No audit yet" description="Search for a business to generate a website audit report." />
      ) : (
        <>
          <div className="bg-bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
            <div className="relative w-32 h-32 shrink-0">
              <svg viewBox="0 0 120 120" className="w-32 h-32 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="#1E293B" strokeWidth="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none" stroke="#38BDF8" strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 52}
                  strokeDashoffset={2 * Math.PI * 52 * (1 - overallScore / 100)}
                  style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-ink">{overallScore}</span>
                <span className="text-[10px] text-ink-muted">/ 100</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-ink-muted mb-1">Website Opportunity Score</p>
              <h2 className="text-lg font-semibold text-ink mb-1">{result.name}</h2>
              <p className="text-sm text-ink-muted">{result.website} · {result.technology}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              ['Performance', result.scores.performance],
              ['Mobile', result.scores.mobile],
              ['SEO', result.scores.seo],
              ['Accessibility', result.scores.accessibility],
              ['Conversion', result.scores.conversion],
            ].map(([label, val]) => (
              <div key={label} className="bg-bg-card border border-border rounded-xl p-4">
                <ProgressBar label={label} value={val} />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={15} className="text-state-warning" />
                <h2 className="text-sm font-semibold text-ink">Detected Issues</h2>
              </div>
              <ul className="space-y-2.5">
                {issues.map((issue) => (
                  <li key={issue} className="flex items-start gap-2.5 text-sm text-ink-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-state-danger mt-1.5 shrink-0" />
                    {issue}
                  </li>
                ))}
              </ul>
            </div>

            {/* Mock browser preview */}
            <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border bg-bg-secondary">
                <span className="w-2.5 h-2.5 rounded-full bg-state-danger/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-state-warning/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-state-success/70" />
                <span className="ml-2 text-[11px] text-ink-muted bg-bg rounded px-2 py-0.5 truncate">
                  {result.website}
                </span>
              </div>
              <div className="p-4 space-y-2.5">
                <div className="h-3 w-2/3 bg-white/10 rounded skeleton" />
                <div className="h-20 w-full bg-white/5 rounded-lg border border-border" />
                <div className="h-2.5 w-full bg-white/10 rounded" />
                <div className="h-2.5 w-5/6 bg-white/10 rounded" />
                <div className="h-8 w-28 bg-brand/20 rounded-lg border border-brand/30" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
