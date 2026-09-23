import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, CheckCircle2, Loader2, ChevronDown } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge, { scoreVariant, websiteStatusVariant } from '../components/ui/Badge.jsx'
import { businesses, industries, locations } from '../data/mockData.js'
import { useToast } from '../components/ui/Toast.jsx'

const steps = [
  'Searching business data',
  'Finding websites',
  'Analyzing online presence',
  'Identifying opportunities',
  'Scoring leads',
]

function Select({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs text-ink-muted mb-1.5 block">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-bg border border-border rounded-lg py-2.5 pl-3 pr-9 text-sm text-ink focus-ring outline-none focus:border-brand/50"
        >
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted pointer-events-none" />
      </div>
    </label>
  )
}

export default function DiscoverLeads() {
  const navigate = useNavigate()
  const showToast = useToast()
  const [form, setForm] = useState({
    industry: industries[0],
    location: locations[0],
    businessType: 'Local Business',
    websiteStatus: 'Any',
    opportunityLevel: 'Any',
    count: 100,
  })
  const [phase, setPhase] = useState('idle') // idle | running | done
  const [activeStep, setActiveStep] = useState(-1)
  const [results, setResults] = useState([])

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function runDiscovery() {
    setPhase('running')
    setActiveStep(0)
    setResults([])

    steps.forEach((_, i) => {
      setTimeout(() => {
        setActiveStep(i)
        if (i === steps.length - 1) {
          setTimeout(() => {
            const matched = businesses
              .filter((b) => (form.industry === 'Any Industry' ? true : b.industry === form.industry))
              .slice(0, 12)
            setResults(matched.length ? matched : businesses.slice(0, 12))
            setPhase('done')
            showToast(`AI agent discovered ${matched.length || 12} matching businesses.`)
          }, 700)
        }
      }, i * 750)
    })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find New Opportunities"
        subtitle="Let your AI sales agent discover businesses that could benefit from your services."
      />

      <div className="bg-bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select label="Industry" value={form.industry} onChange={(v) => update('industry', v)} options={['Any Industry', ...industries]} />
          <Select label="Location" value={form.location} onChange={(v) => update('location', v)} options={locations} />
          <Select label="Business Type" value={form.businessType} onChange={(v) => update('businessType', v)} options={['Local Business', 'Franchise', 'Enterprise']} />
          <Select label="Website Status" value={form.websiteStatus} onChange={(v) => update('websiteStatus', v)} options={['Any', 'No Website', 'Needs Improvement', 'Good']} />
          <Select label="Opportunity Level" value={form.opportunityLevel} onChange={(v) => update('opportunityLevel', v)} options={['Any', 'High', 'Medium']} />
          <label className="block">
            <span className="text-xs text-ink-muted mb-1.5 block">Number of businesses</span>
            <input
              type="number"
              min={10}
              max={500}
              value={form.count}
              onChange={(e) => update('count', e.target.value)}
              className="w-full bg-bg border border-border rounded-lg py-2.5 px-3 text-sm text-ink focus-ring outline-none focus:border-brand/50"
            />
          </label>
        </div>

        <button
          onClick={runDiscovery}
          disabled={phase === 'running'}
          className="mt-6 inline-flex items-center gap-2 bg-brand hover:bg-brand/90 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-glow"
        >
          {phase === 'running' ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
          {phase === 'running' ? 'AI Agent Working...' : 'Start AI Discovery'}
        </button>
      </div>

      {phase !== 'idle' && (
        <div className="bg-bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-pulseSoft absolute inline-flex h-full w-full rounded-full bg-state-success opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-state-success" />
            </span>
            <span className="text-xs font-semibold tracking-wide text-ink-muted">AI SALES AGENT</span>
          </div>

          <div className="space-y-3">
            {steps.map((step, i) => {
              const isDone = i < activeStep || phase === 'done'
              const isActive = i === activeStep && phase === 'running'
              return (
                <div key={step} className="flex items-center gap-3 text-sm">
                  {isDone ? (
                    <CheckCircle2 size={16} className="text-state-success shrink-0" />
                  ) : isActive ? (
                    <Loader2 size={16} className="text-brand-accent animate-spin shrink-0" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-border shrink-0" />
                  )}
                  <span className={isDone || isActive ? 'text-ink' : 'text-ink-muted'}>{step}</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Discovery Results</h2>
            <span className="text-xs text-ink-muted">{results.length} businesses found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-t border-border">
                  <th className="font-medium px-6 py-2.5">Business</th>
                  <th className="font-medium px-3 py-2.5 hidden md:table-cell">Industry</th>
                  <th className="font-medium px-3 py-2.5 hidden lg:table-cell">Location</th>
                  <th className="font-medium px-3 py-2.5">Website</th>
                  <th className="font-medium px-3 py-2.5">Score</th>
                  <th className="font-medium px-6 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {results.map((b) => (
                  <tr key={b.id} className="border-t border-border hover:bg-white/[0.03] transition-colors">
                    <td className="px-6 py-3 text-ink font-medium">{b.name}</td>
                    <td className="px-3 py-3 text-ink-muted hidden md:table-cell">{b.industry}</td>
                    <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">{b.location.split(',')[0]}</td>
                    <td className="px-3 py-3"><Badge variant={websiteStatusVariant(b.websiteStatus)}>{b.websiteStatus}</Badge></td>
                    <td className="px-3 py-3 font-semibold text-ink">
                      <Badge variant={scoreVariant(b.opportunityScore)}>{b.opportunityScore}</Badge>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button onClick={() => navigate(`/businesses/${b.id}`)} className="text-xs text-brand-accent hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
