import React from 'react'
import { Routes, Route } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import DiscoverLeads from './pages/DiscoverLeads.jsx'
import Businesses from './pages/Businesses.jsx'
import BusinessDetails from './pages/BusinessDetails.jsx'
import Opportunities from './pages/Opportunities.jsx'
import WebsiteAudit from './pages/WebsiteAudit.jsx'
import LeadDetails from './pages/LeadDetails.jsx'
import Outreach from './pages/Outreach.jsx'



export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/discover" element={<DiscoverLeads />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/businesses/:id" element={<BusinessDetails />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/website-audit" element={<WebsiteAudit />} />
        <Route path="/leads/:id" element={<LeadDetails />} />
        <Route path="/outreach" element={<Outreach />} />
      </Route>
    </Routes>
  )
}
