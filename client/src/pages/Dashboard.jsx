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

        
      </div>

    
    </div>
  )
}
