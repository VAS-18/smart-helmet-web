export default function GpsVitalsPanel({ telemetry: d }) {
  const loc = d?.location
  const vitals = d?.vitals

  return (
    <div className="panel">
      <div className="panel-header">GPS & Vitals</div>
      <div className="panel-body">
        <div className="gps-info" style={{ marginBottom: 16 }}>
          <div className="gps-field">
            <div className="gps-label">Latitude</div>
            <div className="gps-value">{loc ? loc.latitude.toFixed(6) : '--'}</div>
          </div>
          <div className="gps-field">
            <div className="gps-label">Longitude</div>
            <div className="gps-value">{loc ? loc.longitude.toFixed(6) : '--'}</div>
          </div>
          <div className="gps-field">
            <div className="gps-label">Altitude</div>
            <div className="gps-value">{loc ? `${loc.altitude} m` : '--'}</div>
          </div>
          <div className="gps-field">
            <div className="gps-label">Satellites</div>
            <div className="gps-value">{loc ? `${loc.satellites} sats` : '--'}</div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
          <div className="card-label" style={{ marginBottom: 10 }}>HRV Analysis</div>
          <div className="vitals-row">
            <div className="vital-metric">
              <div className="vital-label">SDNN</div>
              <div className="vital-value">
                {vitals?.hrv ? vitals.hrv.sdnn.toFixed(1) : '--'}
                <span className="card-unit"> ms</span>
              </div>
            </div>
            <div className="vital-metric">
              <div className="vital-label">RMSSD</div>
              <div className="vital-value">
                {vitals?.hrv ? vitals.hrv.rmssd.toFixed(1) : '--'}
                <span className="card-unit"> ms</span>
              </div>
            </div>
            <div className="vital-metric">
              <div className="vital-label">RR Interval</div>
              <div className="vital-value">
                {vitals ? vitals.rr_interval_ms.toFixed(0) : '--'}
                <span className="card-unit"> ms</span>
              </div>
            </div>
            <div className="vital-metric">
              <div className="vital-label">Signal</div>
              <div className="vital-value" style={{ fontSize: 13 }}>
                {vitals?.signal_quality ?? '--'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
