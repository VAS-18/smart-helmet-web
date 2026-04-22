import { Line } from 'react-chartjs-2'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Legend,
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 200 },
  plugins: {
    legend: {
      display: true,
      labels: { color: '#8892a4', boxWidth: 10, font: { size: 10 } },
    },
  },
  scales: {
    x: { display: false },
    y: {
      grid: { color: 'rgba(255,255,255,0.04)' },
      ticks: { color: '#4a5568', font: { size: 10 } },
    },
  },
}

export default function TelemetryChart({ history }) {
  const data = {
    labels: history.labels,
    datasets: [
      { label: 'Temp °C', data: history.temp, borderColor: '#14b8a6', borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
      { label: 'Heart BPM', data: history.hr, borderColor: '#ec4899', borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
      { label: 'MQ-2 PPM', data: history.gas, borderColor: '#f59e0b', borderWidth: 1.5, pointRadius: 0, tension: 0.3 },
    ],
  }

  return (
    <div className="panel">
      <div className="panel-header">
        Telemetry History
        <span className="panel-badge">Last 60 readings</span>
      </div>
      <div className="panel-body">
        <div className="chart-container">
          <Line data={data} options={options} />
        </div>
      </div>
    </div>
  )
}
