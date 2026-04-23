import { useEffect } from 'react'

const ICONS = { critical: '🚨', warning: '⚠️' }

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 4000)
    return () => clearTimeout(t)
  }, [toast.id, onDismiss])

  return (
    <div className={`toast toast-${toast.severity}`} onClick={() => onDismiss(toast.id)}>
      <span className="toast-icon">{ICONS[toast.severity] ?? '⚠️'}</span>
      <div className="toast-body">
        <div className="toast-title">{toast.type.replace(/_/g, ' ').toUpperCase()}</div>
        <div className="toast-msg">{toast.message}</div>
      </div>
    </div>
  )
}

export default function Toasts({ toasts, onDismiss }) {
  if (toasts.length === 0) return null
  return (
    <div className="toast-container">
      {toasts.map(t => <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />)}
    </div>
  )
}
