import { useState, useEffect, useRef, useCallback } from 'react'
import { useMqtt } from './hooks/useMqtt'
import Header from './components/Header'
import SensorCards from './components/SensorCards'
import TelemetryChart from './components/TelemetryChart'
import GpsVitalsPanel from './components/GpsVitalsPanel'
import AlertLog from './components/AlertLog'
import Toasts from './components/Toast'

const MAX_HISTORY = 60
let alertSeq = 0

function makeAlert(type, severity, message, data = {}) {
  return { id: `${type}-${++alertSeq}`, type, severity, message, timestamp: Date.now() / 1000, data }
}

export default function App() {
  const [history, setHistory] = useState({ temp: [], hr: [], humidity: [], labels: [] })
  const [alertLog, setAlertLog] = useState([])
  const [toasts, setToasts] = useState([])
  const prevData = useRef(null)

  const { data, status } = useMqtt('ws://10.65.233.150:9001', 'esp/dht11')

  const telemetry = data
    ? { environment: { temperature: data.temperature, humidity: data.humidity, heat_index: data.heatIndex }, airAlert: data.airAlert, distance: data.distance, vitals: { bpm: data.bpm } }
    : null

  useEffect(() => {
    if (!data) return
    console.log('esp/dht11:', data)
    const prev = prevData.current
    const newAlerts = []

    if (data.airAlert && !prev?.airAlert)
      newAlerts.push(makeAlert('air_quality', 'critical', 'Air quality is poor'))

    if (data.temperature > 45 && !(prev?.temperature > 45))
      newAlerts.push(makeAlert('temperature', 'warning', `High temp: ${data.temperature}°C`, { temperature: data.temperature }))

    if (data.distance !== -1 && data.distance <= 15 && !(prev?.distance !== -1 && prev?.distance <= 15))
      newAlerts.push(makeAlert('proximity', 'critical', `Object at ${data.distance}cm`, { distance_cm: data.distance }))

    if (newAlerts.length > 0) {
      setAlertLog(prev => [...newAlerts, ...prev].slice(0, 50))
      setToasts(prev => [...prev, ...newAlerts])
    }

    prevData.current = data
  }, [data])

  useEffect(() => {
    if (!data) return
    const tick = new Date().toLocaleTimeString()
    setHistory(prev => {
      const labels = [...prev.labels, tick]
      const temp = [...prev.temp, data.temperature ?? null]
      const hr = [...prev.hr, data.bpm ?? null]
      const humidity = [...prev.humidity, data.humidity ?? null]
      if (labels.length > MAX_HISTORY) {
        labels.shift(); temp.shift(); hr.shift(); humidity.shift()
      }
      return { labels, temp, hr, humidity }
    })
  }, [data])

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <>
      <Header status={data ? 'connected' : status} isSimulation={false} />
      <div style={{ padding: '0 24px', marginTop: 12 }} />
      <div className="main">
        <SensorCards telemetry={telemetry} />
        <div className="panels">
          <TelemetryChart history={history} />
          <GpsVitalsPanel telemetry={telemetry} />
          <AlertLog alerts={alertLog} onClear={() => setAlertLog([])} />
        </div>
      </div>
      <Toasts toasts={toasts} onDismiss={dismissToast} />
    </>
  )
}
