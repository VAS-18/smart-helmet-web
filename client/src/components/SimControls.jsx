export default function SimControls({ sendCmd }) {
  return (
    <div className="sim-panel">
      <div className="sim-title">▸ Simulation Controls</div>
      <div className="sim-buttons">
        <button className="sim-btn danger" onClick={() => sendCmd('sim_gas_leak', { level: 'critical' })}>Gas Leak</button>
        <button className="sim-btn danger" onClick={() => sendCmd('sim_fall')}>Fall Event</button>
        <button className="sim-btn danger" onClick={() => sendCmd('sim_fire')}>Fire Detection</button>
        <button className="sim-btn warn" onClick={() => sendCmd('sim_smoke')}>Smoke Detection</button>
        <button className="sim-btn warn" onClick={() => sendCmd('sim_heat')}>Heat Spike</button>
        <button className="sim-btn warn" onClick={() => sendCmd('sim_fatigue')}>Fatigue</button>
        <button className="sim-btn warn" onClick={() => sendCmd('sim_blockage')}>Proximity Block</button>
        <button className="sim-btn ok" onClick={() => sendCmd('sim_clear_blockage')}>Clear Block</button>
        <button
          className="sim-btn danger"
          onClick={() => sendCmd('trigger_sos')}
          style={{ fontWeight: 700, letterSpacing: 1 }}
        >
          ⚠ SOS
        </button>
      </div>
    </div>
  )
}
