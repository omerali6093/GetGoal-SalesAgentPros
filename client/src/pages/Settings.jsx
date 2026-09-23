import React, { useState } from 'react'
import { Bell, Building2, Sliders, KeyRound } from 'lucide-react'
import PageHeader from '../components/ui/PageHeader.jsx'
import { useToast } from '../components/ui/Toast.jsx'

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5.5 rounded-full relative transition-colors ${checked ? 'bg-brand' : 'bg-white/10'}`}
      style={{ height: 22, width: 40 }}
    >
      <span
        className="absolute top-0.5 w-4.5 h-4.5 rounded-full bg-white transition-transform"
        style={{ height: 18, width: 18, transform: checked ? 'translateX(20px)' : 'translateX(2px)' }}
      />
    </button>
  )
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2.5 mb-1">
        <Icon size={15} className="text-brand-accent" />
        <h2 className="text-sm font-semibold text-ink">{title}</h2>
      </div>
      {description && <p className="text-xs text-ink-muted mb-4">{description}</p>}
      <div className="space-y-4 mt-4">{children}</div>
    </div>
  )
}

function Row({ label, hint, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm text-ink">{label}</p>
        {hint && <p className="text-xs text-ink-muted mt-0.5">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const showToast = useToast()
  const [notifications, setNotifications] = useState({ newLeads: true, dailyDigest: true, campaignAlerts: false })
  const [agencyName, setAgencyName] = useState('Your Digital Agency')
  const [autoDiscovery, setAutoDiscovery] = useState(true)

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Manage your agency profile, notifications, and AI agent preferences." />

      <Section icon={Building2} title="Agency Profile">
        <label className="block">
          <span className="text-xs text-ink-muted mb-1.5 block">Agency name</span>
          <input
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            className="w-full bg-bg border border-border rounded-lg py-2.5 px-3 text-sm text-ink focus-ring outline-none focus:border-brand/50"
          />
        </label>
      </Section>

      <Section icon={Sliders} title="AI Agent Preferences" description="Control how your AI sales agent runs in the background.">
        <Row label="Continuous auto-discovery" hint="Let the agent search for new leads automatically each day">
          <Toggle checked={autoDiscovery} onChange={setAutoDiscovery} />
        </Row>
      </Section>

      <Section icon={Bell} title="Notifications">
        <Row label="New high-intent leads" hint="Get notified when the agent finds a high-opportunity business">
          <Toggle checked={notifications.newLeads} onChange={(v) => setNotifications((n) => ({ ...n, newLeads: v }))} />
        </Row>
        <Row label="Daily digest" hint="A summary of discoveries, qualifications, and outreach each morning">
          <Toggle checked={notifications.dailyDigest} onChange={(v) => setNotifications((n) => ({ ...n, dailyDigest: v }))} />
        </Row>
        <Row label="Campaign alerts" hint="Notify when a campaign's conversion rate changes significantly">
          <Toggle checked={notifications.campaignAlerts} onChange={(v) => setNotifications((n) => ({ ...n, campaignAlerts: v }))} />
        </Row>
      </Section>

      <Section icon={KeyRound} title="API & Integrations" description="This frontend is ready to connect to a Node.js / Express / MongoDB backend.">
        <Row label="Backend connection" hint="Not connected — running on local mock data">
          <span className="text-xs text-state-warning font-medium">Not connected</span>
        </Row>
      </Section>

      <button
        onClick={() => showToast('Settings saved.')}
        className="bg-brand hover:bg-brand/90 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-glow"
      >
        Save Changes
      </button>
    </div>
  )
}
