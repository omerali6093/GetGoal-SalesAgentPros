process.env.MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salespilot_test'
process.env.NODE_ENV = 'test'

import request from 'supertest'
import createApp from '../../src/app.js'


const app = createApp()

describe('GET /heatlh', () => {
    it('return 200 with status ok', async () => {
        const res = await request(app).get('/health')
        expect(res.status).tobe(200)
        expect(res.body.success).tobe(true)
        expect(res.body.data.status).tobe('ok')
        expect(res.body.data.environment).toBe('test')
    })
})

describe('Unknown route', () => {
  it('returns 404 in the standard error envelope', async () => {
    const res = await request(app).get('/does-not-exist')
    expect(res.status).toBe(404)
    expect(res.body.success).toBe(false)
    expect(res.body.error.message).toMatch(/Route not found/)
  })
})


describe('Security headers', () => {
  it('sets helmet headers', async () => {
    const res = await request(app).get('/health')
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })
})