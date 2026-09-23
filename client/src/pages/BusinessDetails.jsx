import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Phone, Globe2, Star, MapPin, Facebook, Instagram, Linkedin,
  Plus, Send, ExternalLink, Sparkles, ArrowLeft,
} from 'lucide-react'
import Badge, { websiteStatusVariant } from '../components/ui/Badge.jsx'
import ProgressBar from '../components/ui/ProgressBar.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { findBusinessById, opportunityIssuesByStatus, getRecommendedServices } from '../data/mockData.js'
import { useToast } from '../components/ui/Toast.jsx'

export default function BusinessDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const showToast = useToast()
  const biz = findBusinessById(id)

  if (!biz) {
    return (
      <EmptyState
        title="Business not found"
        description="This business may have been removed from the database."
        action={<button onClick={() => navigate('/businesses')} className="text-sm text-brand-accent hover:underline">Back to Businesses</button>}
      />
    )
  }

  const issues = opportunityIssuesByStatus[biz.websiteStatus] || opportunityIssuesByStatus['Needs Improvement']
  const services = getRecommendedServices(biz)

  return (
    <div className="space-y-6">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-ink-muted hover:text-ink">
        <ArrowLeft size={13} /> Back
      </button>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-bg-card border border-border rounded-xl p-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-ink tracking-tight">{biz.name}</h1>
          <div className="flex items-center gap-2 text-sm text-ink-muted mt-1.5">
            <span>{biz.industry}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><MapPin size={13} />{biz.location}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast(`${biz.name} added to your leads pipeline.`)}
            className="inline-flex items-center gap-1.5 border border-border text-ink text-sm px-3.5 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Plus size={14} /> Add to Leads
          </button>
          <button
            onClick={() => navigate(`/outreach?biz=${biz.id}`)}
            className="inline-flex items-center gap-1.5 bg-brand hover:bg-brand/90 text-white text-sm px-3.5 py-2 rounded-lg transition-colors shadow-glow"
          >
            <Send size={14} /> Generate Outreach
          </button>
          {biz.website && (
            <button className="hidden sm:inline-flex items-center gap-1.5 border border-border text-ink-muted text-sm px-3.5 py-2 rounded-lg hover:bg-white/5 transition-colors">
              <ExternalLink size={14} /> View Website
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Overview */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-4">Business Overview</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-muted">Owner</dt><dd className="text-ink">{biz.owner}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Category</dt><dd className="text-ink">{biz.industry}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-muted">Location</dt><dd className="text-ink">{biz.location}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ink-muted flex items-center gap-1.5"><Phone size={13} />Phone</dt><dd className="text-ink">{biz.phone}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ink-muted flex items-center gap-1.5"><Globe2 size={13} />Website</dt><dd className="text-ink">{biz.website || '—'}</dd></div>
            <div className="flex justify-between items-center"><dt className="text-ink-muted flex items-center gap-1.5"><Star size={13} />Reviews</dt><dd className="text-ink">{biz.reviews} ({biz.rating}★)</dd></div>
          </dl>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border">
            {biz.social.facebook && <Facebook size={16} className="text-ink-muted hover:text-brand-accent" />}
            {biz.social.instagram && <Instagram size={16} className="text-ink-muted hover:text-brand-accent" />}
            {biz.social.linkedin && <Linkedin size={16} className="text-ink-muted hover:text-brand-accent" />}
            {!biz.social.facebook && !biz.social.instagram && !biz.social.linkedin && (
              <span className="text-xs text-ink-muted">No social profiles found</span>
            )}
          </div>
        </div>

        {/* Website Analysis */}
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Website Analysis</h2>
            <Badge variant={websiteStatusVariant(biz.websiteStatus)}>{biz.websiteStatus}</Badge>
          </div>
          {biz.website ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
              <ProgressBar label="Performance" value={biz.scores.performance} />
              <ProgressBar label="Mobile Experience" value={biz.scores.mobile} />
              <ProgressBar label="SEO" value={biz.scores.seo} />
              <ProgressBar label="Accessibility" value={biz.scores.accessibility} />
              <ProgressBar label="Conversion" value={biz.scores.conversion} />
              <div className="flex flex-col justify-center">
                <span className="text-xs text-ink-muted">Technology</span>
                <span className="text-sm text-ink mt-1">{biz.technology}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-muted">No website detected for this business — analysis unavailable.</p>
          )}
        </div>
      </div>

      {/* AI Opportunity analysis */}
      <div className="bg-gradient-to-br from-brand/10 via-bg-card to-bg-card border border-brand/25 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={16} className="text-brand-accent" />
          <h2 className="text-sm font-semibold text-ink">Why this business is an opportunity</h2>
        </div>
        <ul className="space-y-2.5 mb-5">
          {issues.map((issue) => (
            <li key={issue} className="flex items-start gap-2.5 text-sm text-ink-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-state-warning mt-1.5 shrink-0" />
              {issue}
            </li>
          ))}
        </ul>
        <h3 className="text-xs font-semibold tracking-wide text-ink-muted mb-2.5">RECOMMENDED SERVICES</h3>
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <Badge key={s} variant="brand">{s}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
