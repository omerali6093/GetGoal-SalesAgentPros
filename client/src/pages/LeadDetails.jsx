import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Sparkles, Send, Phone, Globe2, Star, Clock } from 'lucide-react'
import Badge, { leadStatusVariant } from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { findBusinessById, opportunityIssuesByStatus, getRecommendedServices } from '../data/mockData.js'

const activity = [
  { id: 1, label: 'Lead discovered by AI agent', time: '5 days ago' },
  { id: 2, label: 'Website audit completed', time: '5 days ago' },
  { id: 3, label: 'Scored and added to pipeline', time: '4 days ago' },
  { id: 4, label: 'Marked as qualified', time: '2 days ago' },
]

export default function LeadDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const biz = findBusinessById(id)

  if (!biz) {
    return (
      <EmptyState
        title="Lead not found"
        action={<button onClick={() => navigate('/opportunities')} className="text-sm text-brand-accent hover:underline">Back to Opportunities</button>}
      />
    )
  }

  const issues = opportunityIssuesByStatus[biz.websiteStatus] || []
  const services = getRecommendedServices(biz)

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink">
        <ArrowLeft size={13} /> Back
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-bg-card border border-border rounded-xl p-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-ink tracking-tight">{biz.name}</h1>
          <p className="text-sm text-ink-muted mt-1">{biz.industry} · {biz.location}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-ink-muted">Opportunity Score</p>
            <p className="text-xl font-bold text-brand-accent">{biz.opportunityScore} / 100</p>
          </div>
          <Badge variant={leadStatusVariant(biz.leadStatus)} className="text-sm px-3 py-1">{biz.leadStatus}</Badge>
        </div>
      </div>

      {/* AI Sales Insight */}
      <div className="bg-gradient-to-br from-brand/10 via-bg-card to-bg-card border border-brand/25 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-brand-accent" />
          <h2 className="text-sm font-semibold text-ink">AI Sales Insight</h2>
        </div>
        <p className="text-sm text-ink-muted leading-relaxed mb-4">
          This business has an established local presence but its {biz.website ? 'website presents several opportunities for improving mobile usability, conversion, and appointment flow.' : 'lack of a website means it is likely losing customers to competitors that rank in local search.'}
        </p>
        <div className="bg-bg/60 border border-border rounded-lg p-3.5 mb-4">
          <p className="text-xs text-ink-muted mb-1">Recommended approach</p>
          <p className="text-sm text-ink">
            {biz.website
              ? 'Lead with a website modernization and appointment-booking solution.'
              : 'Lead with a fast-turnaround website build paired with local SEO setup.'}
          </p>
        </div>
        <button
          onClick={() => navigate(`/outreach?biz=${biz.id}`)}
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-glow"
        >
          <Send size={14} /> Generate Outreach
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Business Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-muted">Owner</dt><dd className="text-ink">{biz.owner}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ink-muted flex items-center gap-1.5"><Phone size={13} />Phone</dt><dd className="text-ink">{biz.phone}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ink-muted flex items-center gap-1.5"><Globe2 size={13} />Website</dt><dd className="text-ink">{biz.website || '—'}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ink-muted flex items-center gap-1.5"><Star size={13} />Reviews</dt><dd className="text-ink">{biz.reviews} ({biz.rating}★)</dd></div>
          </dl>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Opportunity Analysis</h2>
          <ul className="space-y-2.5">
            {issues.map((issue) => (
              <li key={issue} className="flex items-start gap-2.5 text-sm text-ink-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-state-warning mt-1.5 shrink-0" />
                {issue}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Website Audit</h2>
          {biz.website ? (
            <div className="space-y-3">
              <ProgressBar label="Performance" value={biz.scores.performance} size="sm" />
              <ProgressBar label="Mobile" value={biz.scores.mobile} size="sm" />
              <ProgressBar label="SEO" value={biz.scores.seo} size="sm" />
              <ProgressBar label="Conversion" value={biz.scores.conversion} size="sm" />
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No website to audit.</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Recommended Services</h2>
          <div className="flex flex-wrap gap-2">
            {services.map((s) => <Badge key={s} variant="brand">{s}</Badge>)}
          </div>
        </div>
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Activity Timeline</h2>
          <ul className="space-y-4">
            {activity.map((a) => (
              <li key={a.id} className="flex items-start gap-2.5 text-xs">
                <Clock size={13} className="text-ink-muted mt-0.5 shrink-0" />
                <div>
                  <p className="text-ink-muted">{a.label}</p>
                  <p className="text-ink-muted/60 mt-0.5">{a.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
