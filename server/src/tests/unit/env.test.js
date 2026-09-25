import { afterAll, beforeEach, describe, jest } from "@jest/globals"


describe('config/env', () => {
    const ORIGINAL_ENV = process.env;

    beforeEach(
        () => {
            jest.resetModules()
            process.env = {...ORIGINAL_ENV}
        }
    )

    afterAll(
        () => {
            process.env = ORIGINAL_ENV
        }
    )


    it('exposes sane defaults when optional vars are unset', async () => {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/salespilot_test'
    delete process.env.PORT
    delete process.env.LLM_PROVIDER

    const { env } = await import('../../src/config/env.js?t=' + Date.now())

    expect(env.port).toBe(5000)
    expect(env.llmProvider).toBe('ollama')
    expect(env.mongodbUri).toBe('mongodb://localhost:27017/salespilot_test')
  })

  it('exits the process when a required var is missing', async () => {
    delete process.env.MONGODB_URI

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {})
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    const { assertRequiredEnv } = await import('../../src/config/env.js?t=' + Date.now())
    assertRequiredEnv()

    expect(exitSpy).toHaveBeenCalledWith(1)
    expect(errorSpy).toHaveBeenCalled()

    exitSpy.mockRestore()
    errorSpy.mockRestore()
  })

})