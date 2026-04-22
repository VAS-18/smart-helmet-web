import { useState, useCallback } from 'react'
import { useWebSocket } from './hooks/useWebSocket'
import Header from './components/Header'
import AlertBanner from './components/AlertBanner'
import SensorCards from './components/SensorCards'
import TelemetryChart from './components/TelemetryChart'
import GpsVitalsPanel from './components/GpsVitalsPanel'
import AlertLog from './components/AlertLog'
import SimControls from './components/SimControls'

const MAX_HISTORY = 60

export default function App() {
  const [telemetry, setTelemetry] = useState(null)
  const [history, setHistory] = useState({ temp: [], hr: [], humidity: [], labels: [] })
  const [alertLog, setAlertLog] = useState([])
  const [topAlert, setTopAlert] = useState(null)
  const [isSimulation, setIsSimulation] = useState(false)

  const handleMessage = useCallback((d) => {
    if (!d.timestamp) return

    if (d.system?.simulation) setIsSimulation(true)

    setTelemetry(d)

    const tick = new Date(d.timestamp * 1000).toLocaleTimeString()
    setHistory(prev => {
      const labels = [...prev.labels, tick]
      const temp = [...prev.temp, d.environment?.temperature ?? null]
      const hr = [...prev.hr, d.vitals?.bpm ?? null]
      const humidity = [...prev.humidity, d.environment?.humidity ?? null]
      if (labels.length > MAX_HISTORY) {
        labels.shift(); temp.shift(); hr.shift(); humidity.shift()
      }
      return { labels, temp, hr, humidity }
    })

    if (d.alerts?.length > 0) {
      const top = d.alerts[0]
      setTopAlert(top)
      setAlertLog(prev => {
        if (prev.find(a => a.id === top.id)) return prev
        return [top, ...prev].slice(0, 50)
      })
    }
  }, [])

  const { status, sendCmd } = useWebSocket(handleMessage)

  const ackTopAlert = useCallback(() => {
    if (topAlert) {
      sendCmd('acknowledge_alert', { alert_id: topAlert.id })
      setTopAlert(null)
    }
  }, [topAlert, sendCmd])

  return (
    <>
      <Header status={status} isSimulation={isSimulation} />
      <div style={{ padding: '0 24px', marginTop: 12 }}>
        {topAlert && <AlertBanner alert={topAlert} onAck={ackTopAlert} />}
      </div>
      <div className="main">
        <SensorCards telemetry={telemetry} />
        <div className="panels">
          <TelemetryChart history={history} />
          <GpsVitalsPanel telemetry={telemetry} />
          <AlertLog alerts={alertLog} />
        </div>
        {isSimulation && <SimControls sendCmd={sendCmd} />}
      </div>
    </>
  )
}
