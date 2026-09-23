// All data in this file is mock/demo data generated on the frontend.
// In production this would be served by a Node.js/Express/MongoDB backend.

export const industries = [
  'Dental Clinics',
  'Restaurants',
  'Real Estate',
  'Automotive',
  'Law Firms',
  'Beauty & Spa',
  'Fitness Studios',
  'Home Services',
  'Healthcare',
  'Retail',
]

export const locations = [
  'Lahore, Pakistan',
  'Karachi, Pakistan',
  'Islamabad, Pakistan',
  'Dubai, UAE',
  'Abu Dhabi, UAE',
  'Riyadh, Saudi Arabia',
]

const websiteStatuses = ['No Website', 'Outdated Website', 'Needs Redesign', 'Needs Improvement', 'Good']
const leadStatuses = ['New', 'Qualified', 'Contacted', 'Follow-up', 'Converted']

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 9301 + 49297) % 233280
    return value / 233280
  }
}
const rand = seededRandom(42)
function pick(arr) {
  return arr[Math.floor(rand() * arr.length)]
}
function range(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min
}

const businessNames = [
  'ABC Dental Clinic', 'Urban Bites', 'Nova Auto Care', 'Bright Smile Dental',
  'Karachi Kebab House', 'Elite Motors Workshop', 'GreenLeaf Realty', 'Prime Law Associates',
  'Glow Beauty Studio', 'IronCore Fitness', 'HomeFix Services', 'City Eye Hospital',
  'Spice Route Restaurant', 'Skyline Properties', 'Family Dental Care', 'FastLane Auto Detailing',
  'Petal & Stem Florist', 'Zenith Legal Group', 'Serenity Spa & Wellness', 'PowerHouse Gym',
  'Reliable Plumbing Co.', 'Vision Care Center', 'The Pasta Kitchen', 'Metro Realty Group',
  'Smile Dental Studio', 'Turbo Auto Repair', 'Blossom Nail Bar', 'Apex Fitness Club',
  'QuickFix Electricians', 'Lakeside Medical Center', 'Saffron Grill', 'Harbor View Realty',
  'Perfect Teeth Dental', 'Precision Auto Body', 'Radiant Skin Clinic', 'CrossFit Downtown',
  'Trusted Home Repairs', 'Al-Noor Hospital', 'Coastal Cuisine', 'Falcon Properties',
]

const owners = [
  'Ahmed Raza', 'Sara Khan', 'Bilal Iqbal', 'Ayesha Malik', 'Usman Tariq',
  'Fatima Sheikh', 'Hamza Farooq', 'Zainab Aslam', 'Omar Siddiqui', 'Mariam Baig',
]

export const businesses = Array.from({ length: 60 }).map((_, i) => {
  const industry = pick(industries)
  const location = pick(locations)
  const websiteStatus = pick(websiteStatuses)
  const hasWebsite = websiteStatus !== 'No Website'
  const performance = hasWebsite ? range(28, 96) : 0
  const mobile = hasWebsite ? range(20, 95) : 0
  const seo = hasWebsite ? range(30, 92) : 0
  const accessibility = hasWebsite ? range(35, 90) : 0
  const conversion = hasWebsite ? range(18, 88) : 0
  const opportunityScore = hasWebsite
    ? Math.round(100 - (performance + mobile + seo + conversion) / 5.2)
    : range(78, 97)
  const reviews = range(8, 640)
  const rating = (range(28, 50) / 10).toFixed(1)

  return {
    id: `biz-${i + 1}`,
    name: businessNames[i % businessNames.length] + (i >= businessNames.length ? ` ${Math.floor(i / businessNames.length) + 1}` : ''),
    industry,
    location,
    owner: pick(owners),
    phone: `+92 3${range(0, 9)}${range(0, 9)} ${range(1000000, 9999999)}`,
    website: hasWebsite ? `www.${businessNames[i % businessNames.length].toLowerCase().replace(/[^a-z]+/g, '')}.com` : null,
    websiteStatus,
    reviews,
    rating,
    opportunityScore: Math.max(35, Math.min(99, opportunityScore)),
    leadStatus: pick(leadStatuses),
    scores: { performance, mobile, seo, accessibility, conversion },
    technology: hasWebsite ? pick(['WordPress + Elementor', 'Wix', 'Squarespace', 'Shopify', 'Custom HTML']) : 'None',
    social: {
      facebook: rand() > 0.3,
      instagram: rand() > 0.4,
      linkedin: rand() > 0.6,
    },
    lastActivity: pick(['2h ago', '1d ago', '3d ago', '5d ago', '1w ago', '2w ago']),
    discoveredAt: `2026-09-${String(range(1, 22)).padStart(2, '0')}`,
  }
})

export const opportunityIssuesByStatus = {
  'No Website': [
    'No website found — entirely dependent on foot traffic and word of mouth',
    'Competitors in the same area rank highly with active websites',
    'No online booking or contact capture mechanism',
  ],
  'Outdated Website': [
    'Website design appears outdated and does not reflect current branding trends',
    'No clear appointment or booking call-to-action',
    'Service information is difficult to find',
  ],
  'Needs Redesign': [
    'Website performance is below average',
    'Mobile experience needs improvement',
    'Visual design appears dated compared to competitors',
  ],
  'Needs Improvement': [
    'Website performance is below average',
    'Mobile experience needs improvement',
    'No clear appointment CTA',
    'Service information is difficult to find',
  ],
  Good: [
    'Minor SEO improvements available',
    'Conversion elements could be optimized further',
  ],
}

export const recommendedServicesPool = [
  'Website Redesign', 'SEO Optimization', 'Conversion Rate Optimization',
  'Online Booking System', 'Mobile Optimization', 'Local SEO & Google Business Profile',
  'Brand Identity Refresh', 'Content Strategy',
]

export function getRecommendedServices(biz) {
  const list = []
  if (!biz.website) list.push('Website Redesign', 'Local SEO & Google Business Profile')
  if (biz.scores.mobile < 60) list.push('Mobile Optimization')
  if (biz.scores.conversion < 60) list.push('Conversion Rate Optimization', 'Online Booking System')
  if (biz.scores.seo < 60) list.push('SEO Optimization')
  if (list.length < 3) list.push('Brand Identity Refresh')
  return [...new Set(list)].slice(0, 4)
}

// ---------- Dashboard summary metrics ----------
export const dashboardMetrics = [
  { key: 'discovered', label: 'Businesses Discovered', value: 12842, delta: 18.4, trend: 'up' },
  { key: 'highIntent', label: 'High-Intent Leads', value: 482, delta: 12.8, trend: 'up' },
  { key: 'websiteOpportunities', label: 'Websites Needing Improvement', value: 2341, delta: 24.5, trend: 'up' },
  { key: 'qualified', label: 'Qualified Opportunities', value: 186, delta: 16.2, trend: 'up' },
  { key: 'outreachPending', label: 'Outreach Pending', value: 74, delta: -4.1, trend: 'down' },
]

// ---------- Time series for charts ----------
function buildSeries(days, base, growth, volatility) {
  const out = []
  let value = base
  const today = new Date('2026-09-23')
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    value = Math.max(0, value + growth + (rand() - 0.5) * volatility)
    out.push({
      date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      leadsDiscovered: Math.round(value),
      qualifiedLeads: Math.round(value * 0.22 + rand() * 6),
      highOpportunity: Math.round(value * 0.14 + rand() * 4),
    })
  }
  return out
}

export const leadsOverTime30 = buildSeries(30, 120, 6, 30)
export const leadsOverTime7 = leadsOverTime30.slice(-7)
export const leadsOverTime90 = buildSeries(90, 60, 2.4, 26)

export const conversionFunnel = [
  { stage: 'Discovered', value: 12842 },
  { stage: 'Analyzed', value: 9120 },
  { stage: 'High-Intent', value: 3220 },
  { stage: 'Qualified', value: 1480 },
  { stage: 'Contacted', value: 640 },
  { stage: 'Converted', value: 186 },
]

export const industryDistribution = industries.map((name) => ({
  name,
  value: range(120, 2400),
}))

export const locationDistribution = locations.map((name) => ({
  name,
  value: range(400, 3200),
}))

export const opportunityScoreDistribution = [
  { band: '0-20', count: 210 },
  { band: '21-40', count: 640 },
  { band: '41-60', count: 1520 },
  { band: '61-80', count: 2870 },
  { band: '81-100', count: 1980 },
]

export const outreachActivity30 = buildSeries(30, 18, 0.6, 8).map((d) => ({
  date: d.date,
  sent: Math.round(d.leadsDiscovered * 0.18),
  replied: Math.round(d.leadsDiscovered * 0.05),
}))

// ---------- Campaigns ----------
export const campaigns = [
  {
    id: 'camp-1',
    name: 'Dental Clinics — Lahore',
    industry: 'Dental Clinics',
    location: 'Lahore, Pakistan',
    discovered: 412,
    qualified: 96,
    drafted: 58,
    conversionRate: 14.2,
    status: 'Active',
  },
  {
    id: 'camp-2',
    name: 'Restaurants — Karachi',
    industry: 'Restaurants',
    location: 'Karachi, Pakistan',
    discovered: 680,
    qualified: 142,
    drafted: 90,
    conversionRate: 9.8,
    status: 'Active',
  },
  {
    id: 'camp-3',
    name: 'Real Estate — Islamabad',
    industry: 'Real Estate',
    location: 'Islamabad, Pakistan',
    discovered: 238,
    qualified: 61,
    drafted: 40,
    conversionRate: 18.6,
    status: 'Paused',
  },
  {
    id: 'camp-4',
    name: 'Automotive — Dubai',
    industry: 'Automotive',
    location: 'Dubai, UAE',
    discovered: 305,
    qualified: 74,
    drafted: 31,
    conversionRate: 11.4,
    status: 'Active',
  },
  {
    id: 'camp-5',
    name: 'Law Firms — Riyadh',
    industry: 'Law Firms',
    location: 'Riyadh, Saudi Arabia',
    discovered: 154,
    qualified: 33,
    drafted: 12,
    conversionRate: 8.1,
    status: 'Completed',
  },
]

// ---------- Outreach message templates ----------
export function generateEmailDraft(biz) {
  return {
    subject: `A quick idea for ${biz.name}'s website`,
    body: `Hi ${biz.owner.split(' ')[0]},

I came across ${biz.name} while researching ${biz.industry.toLowerCase()} businesses in ${biz.location.split(',')[0]}, and wanted to reach out directly.

${biz.website
  ? `Your current site is doing some things well, but a few areas — particularly ${biz.scores.mobile < 60 ? 'mobile experience' : 'page speed'} and ${biz.scores.conversion < 60 ? 'appointment booking' : 'lead capture'} — seem to be costing you potential customers.`
  : `I noticed ${biz.name} doesn't currently have a website, which likely means you're relying entirely on word-of-mouth and foot traffic while competitors capture search traffic online.`}

We help local ${biz.industry.toLowerCase()} businesses like yours modernize their online presence with fast, mobile-first websites and simple booking flows — usually within 2-3 weeks.

Would you be open to a short 15-minute call this week to walk through a few specific suggestions for ${biz.name}?

Best,
Your Agency Team`,
  }
}

export function generateWhatsAppDraft(biz) {
  return {
    subject: null,
    body: `Hi ${biz.owner.split(' ')[0]}! 👋 I help ${biz.industry.toLowerCase()} businesses in ${biz.location.split(',')[0]} improve their website & get more bookings. I took a quick look at ${biz.name} and spotted a few easy wins. Mind if I share them? Takes 2 minutes to read.`,
  }
}

export function generateLinkedInDraft(biz) {
  return {
    subject: null,
    body: `Hi ${biz.owner.split(' ')[0]}, I lead digital growth projects for local ${biz.industry.toLowerCase()} businesses. I noticed a few opportunities on ${biz.name}'s online presence that could translate into more bookings — would you be open to connecting and comparing notes?`,
  }
}

// ---------- AI Agent live status ----------
export const agentActivityLog = [
  { id: 1, text: 'Analyzed 24 businesses in Lahore, Pakistan', time: '2 min ago' },
  { id: 2, text: 'Found 6 high-intent opportunities in Dental Clinics', time: '9 min ago' },
  { id: 3, text: 'Completed website audit for Urban Bites', time: '18 min ago' },
  { id: 4, text: 'Scored 42 new leads in Restaurants — Karachi', time: '31 min ago' },
  { id: 5, text: 'Discovered 112 new businesses in Islamabad, Pakistan', time: '1h ago' },
]

export function findBusinessById(id) {
  return businesses.find((b) => b.id === id)
}
