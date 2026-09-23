# SalesPilot AI — Sales Intelligence Dashboard (Frontend)

A premium, dark-themed B2B SaaS frontend for an AI-powered sales prospecting
platform. **This is a frontend-only project** — all data is mocked in
`src/data/mockData.js` and all "AI" behavior (discovery, scoring, outreach
drafting) is simulated with frontend state and timers. There is no backend,
database, authentication, web scraping, or real AI/API integration.

It is structured to be easy to wire up to a real Node.js / Express / MongoDB
backend later: swap the functions in `src/data/mockData.js` and the local
state in each page for real API calls.

## Getting started

```bash
npm install
npm run dev       # start the dev server (http://localhost:5173)
npm run build     # production build to /dist
npm run preview   # preview the production build
```

## Tech stack

- React 18 + React Router 6 (HashRouter)
- Tailwind CSS (design tokens in `tailwind.config.js`)
- Recharts for analytics
- lucide-react for icons

## Structure

```
src/
  components/
    layout/       Sidebar, Topbar, DashboardLayout (app shell)
    ui/            Reusable primitives (MetricCard, Badge, ProgressBar,
                    AIAgentStatus, Toast, Skeleton, EmptyState, PageHeader, CountUp)
  data/
    mockData.js    All mock businesses, metrics, chart series, campaigns,
                    and outreach-draft generators
  pages/
    Dashboard.jsx        Page 1 — sales intelligence overview
    DiscoverLeads.jsx    Page 2 — AI discovery search + simulated progress
    Businesses.jsx       Page 3 — business database (table/card views)
    BusinessDetails.jsx  Page 4 — business intelligence + AI opportunity analysis
    Opportunities.jsx    Page 5 — drag-and-drop Kanban pipeline
    WebsiteAudit.jsx     Page 6 — website audit report + mock browser preview
    LeadDetails.jsx      Page 7 — CRM-style lead profile + AI sales insight
    Outreach.jsx         Page 8 — AI-assisted outreach editor (Email/WhatsApp/LinkedIn)
    Campaigns.jsx        Page 9 — campaign management
    Analytics.jsx        Page 10 — full analytics suite
    Settings.jsx         Agency, notification, and AI-agent preferences
```

## Design system

Colors, spacing, and animation tokens live in `tailwind.config.js` under the
`bg`, `border`, `brand`, `ink`, and `state` color groups, matching the design
brief (deep navy background, electric-blue accent, glassmorphism used
sparingly).
