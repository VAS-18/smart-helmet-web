function formatAlertData(alert) {
  const d = alert.data || {}
  const parts = []
  if (d.temperature) parts.push(`Temp: ${d.temperature}°C`)
  if (d.ppm) parts.push(`Gas: ${d.ppm} PPM`)
  if (d.bpm) parts.push(`HR: ${d.bpm} BPM`)
  if (d.distance_cm) parts.push(`Dist: ${d.distance_cm} cm`)
  if (d.detected_class) parts.push(`Vision: ${d.detected_class}`)
  if (d.gps) parts.push(`GPS: ${d.gps.lat}, ${d.gps.lon}`)
  return parts.join(' · ') || alert.type
}

export default function AlertBanner({ alert, onAck }) {
  return (
    <div className={`alert-banner ${alert.severity}`}>
      <div className="alert-icon">{alert.severity === 'emergency' ? '🚨' : '⚠'}</div>
      <div className="alert-content">
        <div className="alert-title">[{alert.severity.toUpperCase()}] {alert.type.toUpperCase()}</div>
        <div className="alert-desc">{formatAlertData(alert)}</div>
      </div>
      <button className="alert-ack-btn" onClick={onAck}>Acknowledge</button>
    </div>
  )
}
