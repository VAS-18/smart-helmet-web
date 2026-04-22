import { useState, useEffect } from 'react'

export default function Header({ status, isSimulation }) {
  const [time, setTime] = useState(new Date().toLocaleString())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleString()), 1000)
    return () => clearInterval(timer)
  }, [])

  const connLabel =
    status === 'connected' ? 'Connected' :
    status === 'disconnected' ? 'Disconnected' :
    'Connecting...'

  return (
    <div className="header">
      <div className="header-left">
        <div className="logo">HELM<span>OS</span></div>
        <div className="connection-badge">
          <div className={`status-dot${status !== 'connected' ? ' offline' : ''}`} />
          <span>{connLabel}</span>
        </div>
      </div>
      <div className="header-right">
        {isSimulation && <div className="sim-badge">SIMULATION</div>}
        <div className="header-time">{time}</div>
      </div>
    </div>
  )
}
