import React, { useEffect, useState } from 'react'

export default function CountUp({ value, duration = 900, decimals = 0, suffix = '' }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    let raf
    const start = performance.now()
    const from = 0
    const to = value
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(from + (to - from) * eased)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return (
    <span>
      {display.toLocaleString('en-US', { maximumFractionDigits: decimals, minimumFractionDigits: decimals })}
      {suffix}
    </span>
  )
}
