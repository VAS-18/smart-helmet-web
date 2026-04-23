import { useEffect } from 'react'
import { useMqtt } from '../hooks/useMqtt'

const BROKER = 'ws://10.65.233.150:9001'
const TOPIC = 'esp/dht11'

function calcBar(val, min, max) {
  if (val == null) return 0
  return Math.max(0, Math.min(100, ((val - min) / (max - min)) * 100))
}

function SensorCard({ label, value, unit, barWidth, barColor, status }) {
  const cls = status === 'critical' ? ' alert-critical' : status === 'warning' ? ' alert-warning' : status === 'ok' ? ' alert-ok' : ''
  return (
    <div className={`sensor-card${cls}`}>
      <div className="card-label">{label}</div>
      <div className="card-value">
        {value ?? '--'}{unit && <span className="card-unit">{unit}</span>}
      </div>
      <div className="card-bar">
        <div className="card-bar-fill" style={{ width: `${barWidth}%`, background: barColor }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { data, status } = useMqtt(BROKER, TOPIC)

  useEffect(() => { if (data) console.log('esp/dht11:', data) }, [data])

  const temp = data?.temperature ?? null
  const humidity = data?.humidity ?? null

  const tempStatus = temp == null ? '' : temp > 35 ? 'critical' : temp > 30 ? 'warning' : 'ok'

  return (
    <div>
      <div className="cards-row">
        <SensorCard
          label="🌡 Temperature"
          value={temp}
          unit="°C"
          barWidth={calcBar(temp, 0, 50)}
          barColor="var(--accent-teal)"
          status={tempStatus}
        />
        <SensorCard
          label="💧 Humidity"
          value={humidity}
          unit="%"
          barWidth={calcBar(humidity, 0, 100)}
          barColor="var(--accent-blue)"
          status={humidity != null ? 'ok' : ''}
        />
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: 'var(--text-muted, #888)' }}>
        MQTT {status} · {TOPIC}
      </div>
    </div>
  )
}
