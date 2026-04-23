function formatAlertData(alert) {
  const d = alert.data || {}
  const parts = []
  if (d.temperature) parts.push(`Temp: ${d.temperature}°C`)
  if (d.ppm) parts.push(`Gas: ${d.ppm} PPM`)
  if (d.bpm) parts.push(`HR: ${d.bpm} BPM`)
  if (d.distance_cm) parts.push(`Dist: ${d.distance_cm} cm`)
  if (d.detected_class) parts.push(`Vision: ${d.detected_class}`)
  if (d.gps) parts.push(`GPS: ${d.gps.lat}, ${d.gps.lon}`)
  return parts.join(' · ') || alert.message || alert.type
}

export default function AlertLog({ alerts, onClear }) {
  return (
    <div className="panel">
      <div className="panel-header">
        Alert Log
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {alerts.length > 0 && (
            <button onClick={onClear} style={{
              fontFamily: 'var(--font-mono)', fontSize: 10, padding: '2px 8px',
              borderRadius: 4, border: '1px solid var(--border)', background: 'transparent',
              color: 'var(--text-muted)', cursor: 'pointer'
            }}>Clear</button>
          )}
          <span className="panel-badge">{alerts.length} alerts</span>
        </div>
      </div>
      <div className="panel-body">
        <div className="alert-log">
          {alerts.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, padding: 20 }}>
              No alerts
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`log-entry ${alert.severity}`}>
                <span className="log-time">
                  {new Date(alert.timestamp * 1000).toLocaleTimeString()}
                </span>
                <span className="log-msg">
                  <strong>{alert.type.toUpperCase()}</strong> — {formatAlertData(alert)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
