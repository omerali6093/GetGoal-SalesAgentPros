import React, { useState } from 'react'
import { Plus, Building2, Target, FileText, TrendingUp, X } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge from '../components/ui/Badge.jsx'
import { campaigns as initialCampaigns, industries, locations } from '../data/mockData.js'
import { useToast } from '../components/ui/Toast.jsx'

function statusVariant(status) {
  if (status === 'Active') return 'success'
  if (status === 'Paused') return 'warning'
  return 'neutral'
}

export default function Campaigns() {
  const showToast = useToast()
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [modalOpen, setModalOpen] = useState(false)
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState(industries[0])
  const [location, setLocation] = useState(locations[0])

  function createCampaign() {
    if (!name.trim()) return
    const newCampaign = {
      id: `camp-${campaigns.length + 1}`,
      name,
      industry,
      location,
      discovered: 0,
      qualified: 0,
      drafted: 0,
      conversionRate: 0,
      status: 'Active',
    }
    setCampaigns([newCampaign, ...campaigns])
    setModalOpen(false)
    setName('')
    showToast('Campaign created. Your AI agent will begin discovery shortly.')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Campaigns"
        subtitle="Organize lead discovery and outreach by industry and location."
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white text-sm font-medium px-3.5 py-2 rounded-lg transition-colors shadow-glow"
          >
            <Plus size={14} /> New Campaign
          </button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((c) => (
          <div key={c.id} className="bg-bg-card border border-border rounded-xl p-5 hover:border-brand/40 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-ink">{c.name}</h3>
                <p className="text-xs text-ink-muted mt-0.5">{c.industry}</p>
              </div>
              <Badge variant={statusVariant(c.status)}>{c.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Building2 size={13} className="text-ink-muted" />
                <div>
                  <p className="text-ink font-semibold">{c.discovered.toLocaleString()}</p>
                  <p className="text-ink-muted">Discovered</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Target size={13} className="text-ink-muted" />
                <div>
                  <p className="text-ink font-semibold">{c.qualified.toLocaleString()}</p>
                  <p className="text-ink-muted">Qualified</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FileText size={13} className="text-ink-muted" />
                <div>
                  <p className="text-ink font-semibold">{c.drafted.toLocaleString()}</p>
                  <p className="text-ink-muted">Drafted</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={13} className="text-ink-muted" />
                <div>
                  <p className="text-ink font-semibold">{c.conversionRate}%</p>
                  <p className="text-ink-muted">Conversion</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-bg-card border border-border rounded-xl p-6 w-full max-w-md shadow-card animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-semibold text-ink">New Campaign</h2>
              <button onClick={() => setModalOpen(false)} className="text-ink-muted hover:text-ink"><X size={16} /></button>
            </div>
            <div className="space-y-4">
              <label className="block">
                <span className="text-xs text-ink-muted mb-1.5 block">Campaign name</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Beauty Salons — Dubai"
                  className="w-full bg-bg border border-border rounded-lg py-2.5 px-3 text-sm text-ink placeholder:text-ink-muted focus-ring outline-none focus:border-brand/50"
                />
              </label>
              <label className="block">
                <span className="text-xs text-ink-muted mb-1.5 block">Industry</span>
                <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-bg border border-border rounded-lg py-2.5 px-3 text-sm text-ink focus-ring outline-none focus:border-brand/50">
                  {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-ink-muted mb-1.5 block">Location</span>
                <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-bg border border-border rounded-lg py-2.5 px-3 text-sm text-ink focus-ring outline-none focus:border-brand/50">
                  {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </label>
            </div>
            <button
              onClick={createCampaign}
              className="w-full mt-6 bg-brand hover:bg-brand/90 text-white text-sm font-medium py-2.5 rounded-lg transition-colors shadow-glow"
            >
              Create Campaign
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
