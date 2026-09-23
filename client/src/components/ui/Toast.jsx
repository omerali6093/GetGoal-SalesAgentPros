import React, { createContext, useCallback, useContext, useState } from 'react'
import { CheckCircle2, Info, X } from 'lucide-react'

const ToastContext = createContext(() => {})

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, message, type }])
    setTimeout(() => {
      setToasts((t) => t.filter((toast) => toast.id !== id))
    }, 3200)
  }, [])

  const dismiss = (id) => setToasts((t) => t.filter((toast) => toast.id !== id))

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-[320px] max-w-[90vw]">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="glass border border-border rounded-lg shadow-card px-4 py-3 flex items-start gap-3 animate-fadeIn"
          >
            {t.type === 'success' ? (
              <CheckCircle2 size={18} className="text-state-success mt-0.5 shrink-0" />
            ) : (
              <Info size={18} className="text-brand-accent mt-0.5 shrink-0" />
            )}
            <p className="text-sm text-ink flex-1">{t.message}</p>
            <button onClick={() => dismiss(t.id)} className="text-ink-muted hover:text-ink shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
