function calcBar(val, min, max) {
  if (val == null) return 0
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100))
}

function SensorCard({ label, value, unit, sub, barWidth, barColor, status, valueStyle }) {
  const statusClass = status === 'critical' ? ' alert-critical' : status === 'warning' ? ' alert-warning' : status === 'ok' ? ' alert-ok' : ''
  return (
    <div className={`sensor-card${statusClass}`}>
      <div className="card-label">{label}</div>
      <div className="card-value" style={valueStyle}>
        {value ?? '--'}{unit && <span className="card-unit">{unit}</span>}
      </div>
      {sub && <div className="card-sub">{sub}</div>}
      {barWidth !== undefined && (
        <div className="card-bar">
          <div className="card-bar-fill" style={{ width: `${barWidth}%`, background: barColor }} />
        </div>
      )}
    </div>
  )
}

export default function SensorCards({ telemetry: d }) {
  const e = d?.environment
  const airAlert = d?.airAlert
  const distance = d?.distance
  const vitals = d?.vitals
  const kin = d?.kinematics

  const tempStatus = e ? (e.heat_index > 39 ? 'critical' : e.heat_index > 32 ? 'warning' : 'ok') : ''
  const imuStatus = kin ? (kin.fall_state !== 'normal' ? 'critical' : 'ok') : ''

  const bpm = vitals?.bpm ?? null
  const bpmStatus = bpm == null ? '' : bpm === 0 ? 'critical' : (bpm < 60 || bpm > 100) ? 'warning' : 'ok'
  const bpmBarColor = bpm === 0 ? 'var(--accent-red)' : (bpm != null && (bpm < 60 || bpm > 100)) ? 'var(--accent-amber)' : 'var(--accent-pink)'

  return (
    <div className="cards-row">
      <SensorCard
        label="🌡 Temperature"
        value={e?.temperature} unit="°C"
        sub={`Heat Index: ${e?.heat_index ?? '--'}°C`}
        barWidth={e ? calcBar(e.temperature, 15, 50) : 0}
        barColor="var(--accent-teal)"
        status={tempStatus}
      />
      <SensorCard
        label="💧 Humidity"
        value={e?.humidity} unit="%"
        barWidth={e ? calcBar(e.humidity, 0, 100) : 0}
        barColor="var(--accent-blue)"
        status=""
      />
      <SensorCard
        label="📡 Proximity"
        value={distance == null ? null : distance === -1 ? 'Safe' : distance}
        unit={distance == null || distance === -1 ? null : 'cm'}
        status={distance == null ? '' : distance === -1 ? 'ok' : distance <= 15 ? 'critical' : distance < 30 ? 'warning' : ''}
      />
      <SensorCard
        label="💨 Air Quality"
        value={airAlert == null ? null : airAlert ? 'Poor' : 'Good'}
        status={airAlert == null ? '' : airAlert ? 'critical' : 'ok'}
      />
      <SensorCard
        label="❤ Heart Rate"
        value={bpm === 0 ? 'No pulse detected' : bpm}
        unit={bpm === 0 || bpm == null ? null : 'BPM'}
        barWidth={bpm != null && bpm > 0 ? calcBar(bpm, 40, 170) : 0}
        barColor={bpmBarColor}
        status={bpmStatus}
      />
      <SensorCard
        label="📐 IMU / Fall"
        value={kin ? kin.svm.toFixed(2) : null} unit="g"
        sub={`State: ${kin?.fall_state ?? 'normal'}`}
        status={imuStatus}
      />
    </div>
  )
}
