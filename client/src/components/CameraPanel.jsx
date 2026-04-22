import { useRef, useEffect, useState } from 'react'

export default function CameraPanel({ telemetry }) {
  const canvasRef = useRef(null)
  const [liveTime, setLiveTime] = useState('LIVE')

  const vision = telemetry?.vision
  const isHazard = vision?.is_hazard ?? false
  const hazardText = isHazard
    ? `${vision.detected_class.toUpperCase()} ${(vision.confidence * 100).toFixed(0)}%`
    : 'CLEAR'
  const fps = vision?.fps ?? '--'

  // Use refs so the animation loop always reads the latest values without restart
  const isHazardRef = useRef(false)
  const hazardTextRef = useRef('CLEAR')
  isHazardRef.current = isHazard
  hazardTextRef.current = hazardText

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let animId

    function draw() {
      if (!canvas.offsetWidth) { animId = requestAnimationFrame(draw); return }
      const ctx = canvas.getContext('2d')
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      const w = canvas.width, h = canvas.height
      const t = Date.now() / 1000

      ctx.fillStyle = '#040d04'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(20,184,166,0.03)'
      ctx.lineWidth = 1
      for (let y = 0; y < h; y += 3) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(20,184,166,0.06)'
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = 0; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      for (let i = 0; i < 5; i++) {
        const x = w * (0.2 + 0.15 * i) + Math.sin(t * 0.5 + i * 1.7) * 30
        const y = h * (0.3 + Math.cos(t * 0.3 + i) * 0.2)
        const r = 15 + Math.sin(t + i * 2) * 5
        ctx.fillStyle = `rgba(20,184,166,${0.08 + Math.sin(t + i) * 0.04})`
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      }

      if (isHazardRef.current) {
        ctx.fillStyle = 'rgba(239,68,68,0.12)'
        ctx.fillRect(0, 0, w, h)
        ctx.strokeStyle = 'rgba(239,68,68,0.8)'
        ctx.lineWidth = 2
        const bx = w * 0.25, by = h * 0.2, bw = w * 0.5, bh = h * 0.55
        ctx.strokeRect(bx, by, bw, bh)
        ctx.fillStyle = 'rgba(239,68,68,0.7)'
        ctx.font = 'bold 11px JetBrains Mono'
        ctx.fillText(hazardTextRef.current, bx + 4, by - 4)
      }

      animId = requestAnimationFrame(draw)
    }

    draw()
    const timeInterval = setInterval(
      () => setLiveTime('LIVE  ' + new Date().toLocaleTimeString()),
      1000,
    )

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(timeInterval)
    }
  }, [])

  return (
    <div className="panel">
      <div className="panel-header">
        Camera Feed — MobileNetV2 Inference
        <span className="panel-badge">{fps} FPS</span>
      </div>
      <div className="panel-body">
        <div className="camera-feed">
          <canvas ref={canvasRef} />
          <div className="camera-overlay">
            <span>{liveTime}</span>
            <span>96×96 INT8</span>
          </div>
          <div className={`camera-ai-badge ${isHazard ? 'hazard' : 'safe'}`}>
            {hazardText}
          </div>
        </div>
      </div>
    </div>
  )
}
