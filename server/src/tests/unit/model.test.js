import mongoose from 'mongoose'
import User from '../../src/models/User.js'
import Business from '../../src/models/Business.js'
import WebsiteAudit from '../../src/models/WebsiteAudit.js'
import Lead from '../../src/models/Lead.js'
import Campaign from '../../src/models/Campaign.js'
import OutreachMessage from '../../src/models/OutreachMessage.js'
import ActivityLog from '../../src/models/ActivityLog.js'

// Mongoose's .validate() runs full schema validation (required fields,
// enums, min/max, custom validators) WITHOUT needing an open DB connection —
// only .save() needs a connection. This lets us fully verify every model's
// shape here, in an environment with no live MongoDB available.

const fakeId = () => new mongoose.Types.ObjectId()

describe('User model', () => {
  it('accepts a valid user', async () => {
    const user = new User({
      name: 'Omer Malik',
      email: 'omer@agency.com',
      passwordHash: 'hashed_value',
    })
    await expect(user.validate()).resolves.toBeUndefined()
  })

  it('rejects a missing required field', async () => {
    const user = new User({ email: 'omer@agency.com', passwordHash: 'x' })
    await expect(user.validate()).rejects.toThrow(/name/)
  })

  it('rejects an invalid email', async () => {
    const user = new User({ name: 'Omer', email: 'not-an-email', passwordHash: 'x' })
    await expect(user.validate()).rejects.toThrow(/Invalid email/)
  })

  it('rejects an invalid role', async () => {
    const user = new User({
      name: 'Omer', email: 'omer@agency.com', passwordHash: 'x', role: 'superadmin',
    })
    await expect(user.validate()).rejects.toThrow()
  })
})

describe('Business model', () => {
  const validPayload = {
    name: 'ABC Dental Clinic',
    industry: 'Dental Clinics',
    location: 'Lahore, Pakistan',
    opportunityScore: 92,
  }

  it('accepts a valid business with defaults applied', async () => {
    const biz = new Business(validPayload)
    await expect(biz.validate()).resolves.toBeUndefined()
    expect(biz.websiteStatus).toBe('No Website')
    expect(biz.leadStatus).toBe('New')
    expect(biz.scores.performance).toBe(0)
    expect(biz.social.facebook).toBe(false)
  })

  it('rejects an industry outside the enum', async () => {
    const biz = new Business({ ...validPayload, industry: 'Not A Real Industry' })
    await expect(biz.validate()).rejects.toThrow(/industry/)
  })

  it('rejects an opportunityScore above 100', async () => {
    const biz = new Business({ ...validPayload, opportunityScore: 150 })
    await expect(biz.validate()).rejects.toThrow()
  })

  it('rejects a scores.performance value above 100', async () => {
    const biz = new Business({ ...validPayload, scores: { performance: 250 } })
    await expect(biz.validate()).rejects.toThrow()
  })
})

describe('WebsiteAudit model', () => {
  it('accepts a valid audit', async () => {
    const audit = new WebsiteAudit({
      business: fakeId(),
      scores: { performance: 52, mobile: 42, seo: 64, accessibility: 71, conversion: 38 },
      issues: ['Poor mobile experience', 'Slow loading'],
    })
    await expect(audit.validate()).resolves.toBeUndefined()
  })

  it('rejects a missing business reference', async () => {
    const audit = new WebsiteAudit({ issues: [] })
    await expect(audit.validate()).rejects.toThrow(/business/)
  })
})

describe('Lead model', () => {
  it('accepts a valid lead with default stage history', async () => {
    const lead = new Lead({ business: fakeId(), opportunityScore: 88 })
    await expect(lead.validate()).resolves.toBeUndefined()
    expect(lead.stage).toBe('New')
    expect(lead.stageHistory).toHaveLength(1)
    expect(lead.stageHistory[0].stage).toBe('New')
  })

  it('rejects a stage outside LEAD_STATUSES', async () => {
    const lead = new Lead({ business: fakeId(), opportunityScore: 88, stage: 'Ghosted' })
    await expect(lead.validate()).rejects.toThrow()
  })

  it('rejects a missing opportunityScore', async () => {
    const lead = new Lead({ business: fakeId() })
    await expect(lead.validate()).rejects.toThrow(/opportunityScore/)
  })
})

describe('Campaign model', () => {
  it('accepts a valid campaign', async () => {
    const campaign = new Campaign({
      name: 'Dental Clinics — Lahore',
      industry: 'Dental Clinics',
      location: 'Lahore, Pakistan',
    })
    await expect(campaign.validate()).resolves.toBeUndefined()
    expect(campaign.status).toBe('Active')
    expect(campaign.discovered).toBe(0)
  })

  it('rejects an invalid status', async () => {
    const campaign = new Campaign({
      name: 'Test', industry: 'Dental Clinics', location: 'Lahore', status: 'Cancelled',
    })
    await expect(campaign.validate()).rejects.toThrow()
  })
})

describe('OutreachMessage model', () => {
  it('accepts a valid email draft', async () => {
    const msg = new OutreachMessage({
      business: fakeId(),
      channel: 'email',
      subject: 'A quick idea for your website',
      body: 'Hi there...',
    })
    await expect(msg.validate()).resolves.toBeUndefined()
    expect(msg.status).toBe('draft')
  })

  it('rejects an invalid channel', async () => {
    const msg = new OutreachMessage({ business: fakeId(), channel: 'sms', body: 'Hi' })
    await expect(msg.validate()).rejects.toThrow()
  })

  it('rejects a missing body', async () => {
    const msg = new OutreachMessage({ business: fakeId(), channel: 'email' })
    await expect(msg.validate()).rejects.toThrow(/body/)
  })
})

describe('ActivityLog model', () => {
  it('accepts a valid activity entry', async () => {
    const entry = new ActivityLog({
      business: fakeId(),
      type: 'discovered',
      message: 'Discovered 112 new businesses in Islamabad, Pakistan',
    })
    await expect(entry.validate()).resolves.toBeUndefined()
  })

  it('rejects an invalid type', async () => {
    const entry = new ActivityLog({ business: fakeId(), type: 'made_coffee', message: 'x' })
    await expect(entry.validate()).rejects.toThrow()
  })
})