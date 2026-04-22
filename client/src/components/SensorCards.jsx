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
  const gas = d?.gas
  const vitals = d?.vitals
  const kin = d?.kinematics
  const prox = d?.proximity

  const tempStatus = e ? (e.heat_index > 39 ? 'critical' : e.heat_index > 32 ? 'warning' : 'ok') : ''
  const mq135Status = gas?.mq135 ? (gas.mq135.status === 'critical' ? 'critical' : gas.mq135.status === 'warning' ? 'warning' : 'ok') : ''
  const bpmStatus = vitals ? (vitals.bpm > 150 ? 'critical' : vitals.fatigue_level === 'severe' ? 'warning' : 'ok') : ''
  const imuStatus = kin ? (kin.fall_state !== 'normal' ? 'critical' : 'ok') : ''
  const proxStatus = prox ? (prox.status === 'critical' ? 'critical' : prox.status === 'warning' ? 'warning' : 'ok') : ''

  const bpmBarColor = vitals
    ? (vitals.bpm > 120 ? 'var(--accent-red)' : vitals.bpm > 100 ? 'var(--accent-amber)' : 'var(--accent-pink)')
    : 'var(--accent-pink)'

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
        label="🌫 MQ-135 AQ"
        value={gas?.mq135 ? gas.mq135.ppm.toFixed(0) : null} unit="PPM"
        sub={`Status: ${gas?.mq135?.status ?? '--'}`}
        barWidth={gas?.mq135 ? calcBar(gas.mq135.ppm, 0, 800) : 0}
        barColor="var(--accent-purple)"
        status={mq135Status}
      />
      <SensorCard
        label="❤ Heart Rate"
        value={vitals?.bpm} unit="BPM"
        sub={`Fatigue: ${vitals?.fatigue_level ?? '--'}`}
        barWidth={vitals ? calcBar(vitals.bpm, 40, 170) : 0}
        barColor={bpmBarColor}
        status={bpmStatus}
      />
      <SensorCard
        label="📐 IMU / Fall"
        value={kin ? kin.svm.toFixed(2) : null} unit="g"
        sub={`State: ${kin?.fall_state ?? 'normal'}`}
        status={imuStatus}
      />
      <SensorCard
        label="📡 Proximity"
        value={prox ? prox.distance_cm.toFixed(0) : null} unit="cm"
        barWidth={prox ? calcBar(Math.min(prox.distance_cm, 200), 0, 200) : 0}
        barColor="var(--accent-teal)"
        status={proxStatus}
      />
    </div>
  )
}
