import { useState, useEffect } from 'react'
import mqtt from 'mqtt'

export function useMqtt(brokerUrl, topic) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const client = mqtt.connect(brokerUrl)

    client.on('connect', () => {
      setStatus('connected')
      client.subscribe(topic)
    })

    client.on('message', (_topic, message) => {
      try {
        setData(JSON.parse(message.toString()))
      } catch {}
    })

    client.on('error', () => setStatus('error'))
    client.on('close', () => setStatus('disconnected'))
    client.on('reconnect', () => setStatus('connecting'))

    return () => client.end()
  }, [brokerUrl, topic])

  return { data, status }
}
