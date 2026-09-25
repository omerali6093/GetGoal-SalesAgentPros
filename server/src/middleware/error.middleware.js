import logger from '../utils/logger.js'
import { failure } from '../utils/apiResponse.js'



// throw new ApiError(404, 'Bussiness or Lead not found')
export class ApiError extends Error {
    constructor(status, message, { code, details }= {}) {
        super(message)
        this.status = status
        this.code = code
        this.details = details
    }
}


// 404 HANDLER 
export function notFoundHandler(req, res) {
    return failure(res, `Route not found: ${req.method} ${req.originalUrl}`, { status: 404 })
}

export function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (status >= 500) {
    logger.error(err.stack || err)
  } else {
    logger.warn(`[${status}] ${message}`)
  }

  return failure(res, message, {
    status,
    code: err.code,
    details: err.details,
  })
}