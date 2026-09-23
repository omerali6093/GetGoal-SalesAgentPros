import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, LayoutGrid, List, Star, Globe2 } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import Badge, { scoreVariant, leadStatusVariant, websiteStatusVariant } from '../components/ui/Badge.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import { businesses, industries, locations } from '../data/mockData.js'

const websiteFilters = ['All Website Status', 'No Website', 'Outdated Website', 'Needs Redesign', 'Needs Improvement', 'Good']
const leadFilters = ['All Lead Status', 'New', 'Qualified', 'Contacted', 'Follow-up', 'Converted']

function FilterSelect({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-bg-card border border-border rounded-lg py-2 px-3 text-xs text-ink-muted focus-ring outline-none focus:border-brand/50 focus:text-ink"
    >
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export default function Businesses() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [industry, setIndustry] = useState('All Industries')
  const [location, setLocation] = useState('All Locations')
  const [website, setWebsite] = useState(websiteFilters[0])
  const [leadStatus, setLeadStatus] = useState(leadFilters[0])
  const [view, setView] = useState('table')
  const [minScore, setMinScore] = useState(0)

  const filtered = useMemo(() => {
    return businesses.filter((b) => {
      if (query && !b.name.toLowerCase().includes(query.toLowerCase())) return false
      if (industry !== 'All Industries' && b.industry !== industry) return false
      if (location !== 'All Locations' && b.location !== location) return false
      if (website !== 'All Website Status' && b.websiteStatus !== website) return false
      if (leadStatus !== 'All Lead Status' && b.leadStatus !== leadStatus) return false
      if (b.opportunityScore < minScore) return false
      return true
    })
  }, [query, industry, location, website, leadStatus, minScore])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Businesses"
        subtitle={`${filtered.length.toLocaleString()} businesses in your database`}
      />

      <div className="bg-bg-card border border-border rounded-xl p-4 space-y-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search businesses..."
            className="w-full bg-bg border border-border rounded-lg py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted focus-ring outline-none focus:border-brand/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <FilterSelect value={industry} onChange={setIndustry} options={['All Industries', ...industries]} />
          <FilterSelect value={location} onChange={setLocation} options={['All Locations', ...locations]} />
          <FilterSelect value={website} onChange={setWebsite} options={websiteFilters} />
          <FilterSelect value={leadStatus} onChange={setLeadStatus} options={leadFilters} />
          <div className="flex items-center gap-2 text-xs text-ink-muted">
            Min score
            <input
              type="range"
              min={0}
              max={100}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="accent-brand w-24"
            />
            <span className="text-ink w-6">{minScore}</span>
          </div>

          <div className="ml-auto flex items-center gap-1 bg-bg border border-border rounded-lg p-1">
            <button
              onClick={() => setView('table')}
              className={`p-1.5 rounded-md ${view === 'table' ? 'bg-brand/15 text-brand-accent' : 'text-ink-muted hover:text-ink'}`}
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setView('cards')}
              className={`p-1.5 rounded-md ${view === 'cards' ? 'bg-brand/15 text-brand-accent' : 'text-ink-muted hover:text-ink'}`}
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No businesses match your filters"
          description="Try widening your search criteria or clearing a filter."
        />
      ) : view === 'table' ? (
        <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted">
                  <th className="font-medium px-5 py-3">Business</th>
                  <th className="font-medium px-3 py-3 hidden md:table-cell">Industry</th>
                  <th className="font-medium px-3 py-3 hidden lg:table-cell">Location</th>
                  <th className="font-medium px-3 py-3 hidden sm:table-cell">Website</th>
                  <th className="font-medium px-3 py-3 hidden lg:table-cell">Reviews</th>
                  <th className="font-medium px-3 py-3">Score</th>
                  <th className="font-medium px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => navigate(`/businesses/${b.id}`)}
                    className="border-t border-border hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-ink font-medium whitespace-nowrap">{b.name}</td>
                    <td className="px-3 py-3 text-ink-muted hidden md:table-cell">{b.industry}</td>
                    <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">{b.location.split(',')[0]}</td>
                    <td className="px-3 py-3 hidden sm:table-cell"><Badge variant={websiteStatusVariant(b.websiteStatus)}>{b.websiteStatus}</Badge></td>
                    <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">
                      <span className="inline-flex items-center gap-1"><Star size={12} className="text-state-warning" />{b.reviews}</span>
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink">{b.opportunityScore}</td>
                    <td className="px-5 py-3"><Badge variant={leadStatusVariant(b.leadStatus)}>{b.leadStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/businesses/${b.id}`)}
              className="text-left bg-bg-card border border-border rounded-xl p-4 hover:border-brand/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-ink">{b.name}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{b.industry} · {b.location.split(',')[0]}</p>
                </div>
                <Badge variant={scoreVariant(b.opportunityScore)}>{b.opportunityScore}</Badge>
              </div>
              <div className="flex items-center gap-2 text-xs text-ink-muted mt-3">
                <Globe2 size={13} />
                {b.websiteStatus}
              </div>
              <div className="flex items-center justify-between mt-3">
                <Badge variant={leadStatusVariant(b.leadStatus)}>{b.leadStatus}</Badge>
                <span className="text-xs text-ink-muted">{b.lastActivity}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
