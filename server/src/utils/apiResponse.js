export function success(res, data, {status  = 200, meta} = {}) {
    const body = {success: true, data};
    if(meta) body.meta = meta;
    return res.status(status).json(body)
}

export function failure(res, message, { status = 400, code, details } = {}) {
  const error = { message }
  if (code) error.code = code
  if (details) error.details = details
  return res.status(status).json({ success: false, error })
}