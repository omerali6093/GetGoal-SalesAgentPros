import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Search, Building2, Target, ShieldCheck,
  Megaphone, Send, BarChart3, Settings, Radar, ChevronsLeft, ChevronsRight,
} from 'lucide-react'
import AIAgentStatus from '../ui/AIAgentStatus.jsx'
import logo from "../../assets/getgoal-logo.png";

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/discover', label: 'Discover Leads', icon: Search },
  { to: '/businesses', label: 'Businesses', icon: Building2 },
  { to: '/website-audit', label: 'Website Audits', icon: ShieldCheck },
  { to: '/outreach', label: 'Outreach', icon: Send },
]

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <aside
        className={`
          fixed lg:sticky top-0 h-screen z-50 lg:z-0 shrink-0
          bg-bg-secondary border-r border-border flex flex-col
          transition-all duration-200 ease-out
          ${collapsed ? 'lg:w-[76px]' : 'lg:w-[248px]'}
          w-[248px]
          ${mobileOpen ? 'left-0' : '-left-[260px] lg:left-0'}
        `}
      >
        <div className="flex items-center gap-2.5 h-16 px-5 border-b border-border shrink-0">
          {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center shrink-0"> */}
            {/* <Radar size={17} className="text-white" /> */}
            <div className='w-26 h-30'>
            <img src={logo} alt="" />
            </div>
          {/* </div> */}
          {!collapsed && (
            <span className="font-semibold text-[15px] tracking-tight text-ink whitespace-nowrap">
              GetGoal <span className="text-brand-accent">SalesAI</span>
            </span>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-150 ${
                  isActive
                    ? 'bg-brand/10 text-ink border border-brand/25'
                    : 'text-ink-muted hover:text-ink hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon size={17} className={isActive ? 'text-brand-accent shrink-0' : 'shrink-0'} />
                  {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-3">
          {!collapsed && <AIAgentStatus compact />}
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-brand-accent flex items-center justify-center text-xs font-semibold text-white shrink-0">
              OM
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm text-ink truncate">Omer Malik</p>
                <p className="text-xs text-ink-muted truncate">Agency Admin</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:flex w-full items-center justify-center gap-2 rounded-lg border border-border py-1.5 text-ink-muted hover:text-ink hover:bg-white/5 transition-colors"
          >
            {collapsed ? <ChevronsRight size={15} /> : <ChevronsLeft size={15} />}
          </button>
        </div>
      </aside>
    </>
  )
}
