import React, { useMemo, useState } from 'react'
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts'
import PageHeader from '../components/ui/PageHeader.jsx'
import {
  leadsOverTime7, leadsOverTime30, leadsOverTime90, outreachActivity30,
  industryDistribution, locationDistribution, opportunityScoreDistribution,
} from '../data/mockData.js'

const COLORS = ['#2563EB', '#38BDF8', '#22C55E', '#F59E0B', '#EF4444', '#818CF8', '#F472B6', '#2DD4BF', '#A3E635', '#FB923C']

const ranges = { '7 Days': leadsOverTime7, '30 Days': leadsOverTime30, '90 Days': leadsOverTime90 }

function ChartCard({ title, subtitle, children, height = 260 }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <h2 className="text-sm font-semibold text-ink">{title}</h2>
      {subtitle && <p className="text-xs text-ink-muted mt-0.5 mb-3">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </div>
  )
}

const tooltipStyle = { background: '#111827', border: '1px solid #1E293B', borderRadius: 8, fontSize: 12 }

export default function Analytics() {
  const [range, setRange] = useState('30 Days')
  const data = ranges[range]
  const sampledIndustry = useMemo(() => industryDistribution.slice(0, 8), [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        subtitle="Track discovery, qualification, and outreach performance across your pipeline."
        actions={
          <div className="flex items-center gap-1 bg-bg-card border border-border rounded-lg p-1">
            {Object.keys(ranges).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  range === r ? 'bg-brand/15 text-brand-accent' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ChartCard title="Lead Discovery" subtitle="New businesses discovered over time">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="d1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} interval={Math.ceil(data.length / 6)} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="leadsDiscovered" name="Discovered" stroke="#2563EB" fill="url(#d1)" strokeWidth={2} />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Qualified Leads" subtitle="Leads that passed AI qualification">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="d2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} interval={Math.ceil(data.length / 6)} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="qualifiedLeads" name="Qualified" stroke="#38BDF8" fill="url(#d2)" strokeWidth={2} />
          </AreaChart>
        </ChartCard>

        <ChartCard title="Website Opportunities" subtitle="High-opportunity websites identified">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} interval={Math.ceil(data.length / 6)} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="highOpportunity" name="High Opportunity" fill="#F59E0B" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Outreach Activity" subtitle="Messages sent vs. replies received">
          <BarChart data={outreachActivity30}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} interval={4} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11, color: '#94A3B8' }} />
            <Bar dataKey="sent" name="Sent" fill="#2563EB" radius={[4, 4, 0, 0]} />
            <Bar dataKey="replied" name="Replied" fill="#22C55E" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <ChartCard title="Industry Distribution" height={280}>
          <PieChart>
            <Pie data={sampledIndustry} dataKey="value" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={2}>
              {sampledIndustry.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Location Distribution" height={280}>
          <BarChart data={locationDistribution} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
            <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} width={90} tickFormatter={(v) => v.split(',')[0]} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="value" fill="#38BDF8" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Opportunity Score Distribution" height={280}>
          <BarChart data={opportunityScoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
            <XAxis dataKey="band" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} width={32} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="count" fill="#2563EB" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  )
}
