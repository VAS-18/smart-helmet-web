import { useState, useEffect } from 'react'

const FIXED_LAT = 28.462809955644012
const FIXED_LNG = 77.49068256751669

export default function GpsVitalsPanel({ telemetry: d }) {
  const loc = d?.location
  const vitals = d?.vitals
  const [locationName, setLocationName] = useState(null)

  useEffect(() => {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${FIXED_LAT}&lon=${FIXED_LNG}&format=json`)
      .then(r => r.json())
      .then(data => setLocationName(data.display_name))
      .catch(() => setLocationName(null))
  }, [])

  const mapSrc = `https://maps.google.com/maps?q=${FIXED_LAT},${FIXED_LNG}&z=16&output=embed`

  return (
    <div className="panel">
      <div className="panel-header">
        GPS Location
        {loc && <span className="panel-badge">{loc.satellites} sats</span>}
      </div>
      <div className="panel-body" style={{ padding: 0 }}>
        <div style={{ position: 'relative', width: '100%', height: 240, background: 'var(--bg-card)' }}>
          <iframe
            title="GPS Location"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 'none', display: 'block', filter: 'grayscale(100%) invert(90%) contrast(90%)' }}
            referrerPolicy="no-referrer-when-downgrade"
            loading="lazy"
          />
        </div>

        {locationName && (
          <div style={{ padding: '8px 16px', fontSize: 11, color: 'var(--text-muted)', borderBottom: '1px solid var(--border)', lineHeight: 1.4 }}>
            {locationName}
          </div>
        )}

        <div className="gps-info" style={{ padding: '10px 16px', gap: 8 }}>
          <div className="gps-field">
            <div className="gps-label">Lat</div>
            <div className="gps-value">{FIXED_LAT.toFixed(6)}</div>
          </div>
          <div className="gps-field">
            <div className="gps-label">Lng</div>
            <div className="gps-value">{FIXED_LNG.toFixed(6)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
