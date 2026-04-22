import { useState, useEffect, useRef, useCallback } from 'react'

export function useWebSocket(onMessage) {
  const [status, setStatus] = useState('connecting')
  const wsRef = useRef(null)
  const reconnectRef = useRef(null)
  const onMessageRef = useRef(onMessage)
  onMessageRef.current = onMessage

  const sendCmd = useCallback((action, data = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...data }))
    }
  }, [])

  useEffect(() => {
    function connect() {
      const proto = window.location.protocol === 'https:' ? 'wss' : 'ws'
      const ws = new WebSocket(`${proto}://${window.location.host}/ws`)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus('connected')
        clearInterval(reconnectRef.current)
        reconnectRef.current = null
      }

      ws.onclose = () => {
        setStatus('disconnected')
        if (!reconnectRef.current) {
          reconnectRef.current = setInterval(connect, 3000)
        }
      }

      ws.onmessage = (e) => {
        try { onMessageRef.current(JSON.parse(e.data)) } catch (err) { console.error(err) }
      }
    }

    connect()
    return () => {
      wsRef.current?.close()
      clearInterval(reconnectRef.current)
    }
  }, [])

  return { status, sendCmd }
}
