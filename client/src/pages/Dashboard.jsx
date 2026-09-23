import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  FunnelChart, Funnel, LabelList,
} from 'recharts'
import { Sparkles, Building2, Zap, Globe2, Target, Clock3 } from 'lucide-react'
import MetricCard from '../components/ui/MetricCard.jsx'
import AIAgentStatus from '../components/ui/AIAgentStatus.jsx'
import Badge, { scoreVariant, websiteStatusVariant } from '../components/ui/Badge.jsx'
import {
  dashboardMetrics, leadsOverTime30, conversionFunnel, businesses, agentActivityLog,
} from '../data/mockData.js'

const metricIcons = {
  discovered: Building2,
  highIntent: Zap,
  websiteOpportunities: Globe2,
  qualified: Target,
  outreachPending: Clock3,
}

export default function Dashboard() {
  const navigate = useNavigate()
  const topOpportunities = [...businesses]
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, 6)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-bg-card border border-border rounded-xl p-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-ink tracking-tight">Good morning, Omer</h1>
          <p className="text-sm text-ink-muted mt-1.5">
            Your AI sales agent found <span className="text-brand-accent font-semibold">48 new opportunities</span> today.
          </p>
        </div>
        <button
          onClick={() => navigate('/discover')}
          className="inline-flex items-center gap-2 bg-brand hover:bg-brand/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-glow self-start"
        >
          <Sparkles size={15} />
          Start Lead Search
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {dashboardMetrics.map((m) => (
          <MetricCard key={m.key} label={m.label} value={m.value} delta={m.delta} trend={m.trend} icon={metricIcons[m.key]} />
        ))}
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-ink">Opportunity Overview</h2>
              <p className="text-xs text-ink-muted mt-0.5">Leads discovered vs. qualified, last 30 days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={leadsOverTime30}>
              <defs>
                <linearGradient id="discGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="qualGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} interval={5} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={32} />
              <Tooltip
                contentStyle={{ background: '#111827', border: '1px solid #1E293B', borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: '#F8FAFC' }}
              />
              <Area type="monotone" dataKey="leadsDiscovered" name="Discovered" stroke="#2563EB" fill="url(#discGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="qualifiedLeads" name="Qualified" stroke="#38BDF8" fill="url(#qualGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-ink mb-1">Conversion Funnel</h2>
          <p className="text-xs text-ink-muted mb-3">From discovery to converted client</p>
          <div className="space-y-2.5 mt-4">
            {conversionFunnel.map((stage, i) => {
              const pct = Math.round((stage.value / conversionFunnel[0].value) * 100)
              return (
                <div key={stage.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-ink-muted">{stage.stage}</span>
                    <span className="text-ink font-medium">{stage.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-brand to-brand-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Top opportunities table */}
        <div className="lg:col-span-2 bg-bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="text-sm font-semibold text-ink">Top Opportunities</h2>
            <button onClick={() => navigate('/opportunities')} className="text-xs text-brand-accent hover:underline">
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-ink-muted border-t border-border">
                  <th className="font-medium px-5 py-2.5">Business</th>
                  <th className="font-medium px-3 py-2.5 hidden md:table-cell">Industry</th>
                  <th className="font-medium px-3 py-2.5 hidden lg:table-cell">Location</th>
                  <th className="font-medium px-3 py-2.5">Website</th>
                  <th className="font-medium px-3 py-2.5">Score</th>
                  <th className="font-medium px-5 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody>
                {topOpportunities.map((b) => (
                  <tr
                    key={b.id}
                    onClick={() => navigate(`/businesses/${b.id}`)}
                    className="border-t border-border hover:bg-white/[0.03] cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-3 text-ink font-medium">{b.name}</td>
                    <td className="px-3 py-3 text-ink-muted hidden md:table-cell">{b.industry}</td>
                    <td className="px-3 py-3 text-ink-muted hidden lg:table-cell">{b.location.split(',')[0]}</td>
                    <td className="px-3 py-3">
                      <Badge variant={websiteStatusVariant(b.websiteStatus)}>{b.websiteStatus}</Badge>
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink">{b.opportunityScore}</td>
                    <td className="px-5 py-3">
                      <Badge variant={scoreVariant(b.opportunityScore)}>
                        {b.opportunityScore >= 80 ? 'High Opportunity' : 'Qualified'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-5">
          <AIAgentStatus />
          <div className="bg-bg-card border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-ink mb-3">Recent Agent Activity</h2>
            <ul className="space-y-3">
              {agentActivityLog.map((a) => (
                <li key={a.id} className="flex items-start gap-2.5 text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-accent mt-1.5 shrink-0" />
                  <div>
                    <p className="text-ink-muted leading-relaxed">{a.text}</p>
                    <p className="text-ink-muted/60 mt-0.5">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
